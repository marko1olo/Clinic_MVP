"""
Денталия-2 Telegram Bot
Основной процесс: Telegram polling + MQTT subscriber в фоновом потоке.
Когда агент на ноуте пуляет событие в MQTT -> бот шлет сообщение в Telegram.
"""
import asyncio
import threading
import logging
import json
import sys
import time
from datetime import datetime

import paho.mqtt.client as mqtt
from aiogram import Bot, Dispatcher, Router
from aiogram.types import Message
from aiogram.filters.command import Command, CommandStart

sys.path.insert(0, '.')
from config.settings import (
    BOT_TOKEN, MQTT_HOST, MQTT_PORT, MQTT_USER, MQTT_PASS,
    TOPIC_XRAY_RESULT, TOPIC_ALERT_ADMIN, TOPIC_REVIEW_NEG, TOPIC_MARKETING_SEND
)
import db
import base64
from aiogram.types import BufferedInputFile

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
router = Router()
dp.include_router(router)

# Хранилище теперь в db.py
# registered_chats: set[int] = set()

# ── Telegram handlers ────────────────────────────────────────────────────────

@router.message(CommandStart())
async def cmd_start(message: Message):
    chat_id = message.chat.id
    role = await asyncio.to_thread(db.get_user_role, chat_id)
    if not role:
        await asyncio.to_thread(db.add_user, chat_id, 'guest', message.from_user.full_name) # По умолчанию гость для безопасности
        role = 'guest'
    log.info(f"New chat registered: {chat_id} as {role}")
    await message.answer(
        f"*Денталия-2* — система мониторинга\n\n"
        f"Ваш chat\\_id: `{chat_id}`\n"
        f"Ваша роль: `{role}`\n\n"
        f"Команды:\n"
        f"/status — состояние системы\n"
        f"/test — тестовое уведомление",
        parse_mode="Markdown"
    )

@router.message(Command("status"))
async def cmd_status(message: Message):
    doctors = len(await asyncio.to_thread(db.get_users_by_role, 'doctor'))
    admins = len(await asyncio.to_thread(db.get_users_by_role, 'admin'))
    await message.answer(
        f"*Система работает* ✅\n"
        f"Врачей: {doctors}, Админов: {admins}\n"
        f"MQTT: `{MQTT_HOST}:{MQTT_PORT}`\n"
        f"Время сервера: {datetime.now().strftime('%H:%M:%S')}",
        parse_mode="Markdown"
    )

@router.message(Command("test"))
async def cmd_test(message: Message):
    await message.answer(
        "🦷 *Тест уведомления*\n\n"
        "Снимок: `test_xray.png`\n"
        "Находки:\n"
        "— Подозрение на кариес (зуб 4.6) — 85%\n"
        "— Воспаление у корня (зуб 3.5) — 60%\n\n"
        "_Рекомендация: обратить внимание на 4.6_",
        parse_mode="Markdown"
    )

# ── MQTT -> Telegram bridge ──────────────────────────────────────────────────

async def broadcast(text: str, role: str = 'admin'):
    """Отправить текст всем получателям с заданной ролью."""
    users = await asyncio.to_thread(db.get_users_by_role, role)
    if not users:
        log.warning(f"No registered {role}s to send to.")
        return

    async def _send_msg(chat_id):
        try:
            await bot.send_message(chat_id, text, parse_mode="Markdown")
        except Exception as e:
            log.error(f"Failed to send to {chat_id}: {e}")

    await asyncio.gather(*(_send_msg(chat_id) for chat_id in users))

async def broadcast_photo(photo_bytes: bytes, caption: str, report_text: str, role: str = 'doctor'):
    """Отправить фото и текст всем получателям с заданной ролью."""
    users = await asyncio.to_thread(db.get_users_by_role, role)
    if not users:
        log.warning(f"No registered {role}s to send photo to.")
        return
    
    # Pre-chunk the report text outside the per-user loop to avoid redundant slicing
    max_len = 4000
    report_chunks = [report_text[i:i+max_len] for i in range(0, len(report_text), max_len)]

    async def _send_to_user(chat_id):
        try:
            input_file = BufferedInputFile(photo_bytes, filename="xray.jpg")
            await bot.send_photo(chat_id, photo=input_file, caption=caption, parse_mode="Markdown")
            
            # Send the rest as text sequentially to preserve correct ordering
            for chunk in report_chunks:
                await bot.send_message(chat_id, text=chunk)
        except Exception as e:
            log.error(f"Failed to send photo to {chat_id}: {e}")

    await asyncio.gather(*(_send_to_user(chat_id) for chat_id in users))

def handle_xray_result(topic, payload, loop):
    image_b64 = payload.get('image_b64')
    report = payload.get('report', 'No report')
    patient_name = payload.get('patient_name')

    patient_str = f"Пациент: {patient_name}" if patient_name and patient_name != "Неизвестен" else "Пациент: неизвестен (нет записи)"

    if image_b64:
        photo_bytes = base64.b64decode(image_b64)
        caption = f"🦷 *Новый рентген проанализирован!*\n👤 _{patient_str}_\nПолный отчет следующим сообщением."
        asyncio.run_coroutine_threadsafe(broadcast_photo(photo_bytes, caption, report, role='doctor'), loop)
        # Notify admins as well but just a short text
        admin_text = f"🔄 *Система*: Снимок {payload.get('file', '')} ({patient_str}) отправлен врачам."
        asyncio.run_coroutine_threadsafe(broadcast(admin_text, role='admin'), loop)
    else:
        text = f"🦷 *Анализ снимка готов*\n👤 _{patient_str}_\n\nНаходки:\n{report}\n"
        asyncio.run_coroutine_threadsafe(broadcast(text, role='doctor'), loop)

def handle_alert_admin(topic, payload, loop):
    text = f"🚨 *АЛЕРТ*\n\n{payload.get('text', str(payload))}"
    asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)

def handle_review_neg(topic, payload, loop):
    text = (
        f"⚠️ *Негативный отзыв*\n\n"
        f"Пациент: {payload.get('patient', 'неизвестен')}\n"
        f"Сообщение: _{payload.get('text', '')}_\n\n"
        f"Требует обратной связи!"
    )
    asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)

def handle_marketing_send(topic, payload, loop):
    text = (
        f"📣 *Маркетинг — задание*\n\n"
        f"Пациент: {payload.get('patient', '?')}\n"
        f"Черновик: _{payload.get('draft', '')}_"
    )
    asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)

def handle_default(topic, payload, loop):
    text = f"📨 `{topic}`\n\n{str(payload)}"
    asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)

TOPIC_HANDLERS = {
    TOPIC_XRAY_RESULT: handle_xray_result,
    TOPIC_ALERT_ADMIN: handle_alert_admin,
    TOPIC_REVIEW_NEG: handle_review_neg,
    TOPIC_MARKETING_SEND: handle_marketing_send,
}

def on_mqtt_message(client, userdata, msg):
    """Колбэк от MQTT — запускаем корутину broadcast в event loop бота."""
    topic = msg.topic
    try:
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
        except json.JSONDecodeError:
            payload = {"text": msg.payload.decode('utf-8', errors='replace')}

        log.info(f"MQTT [{topic}] received.")
    except Exception as e:
        log.error(f"Error processing MQTT message: {e}")
        return

    loop = userdata.get('loop')
    if not loop:
        return

    handler = TOPIC_HANDLERS.get(topic, handle_default)
    handler(topic, payload, loop)

def start_mqtt(loop: asyncio.AbstractEventLoop):
    """Запускает MQTT клиент в отдельном потоке."""
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.user_data_set({'loop': loop})
    client.username_pw_set(MQTT_USER, MQTT_PASS)
    client.on_message = on_mqtt_message

    client.on_connect = lambda c, ud, f, rc, p: (
        log.info(f"MQTT connected, rc={rc}"),
        c.subscribe([
            (TOPIC_XRAY_RESULT, 1),
            (TOPIC_ALERT_ADMIN, 1),
            (TOPIC_REVIEW_NEG, 1),
            (TOPIC_MARKETING_SEND, 1),
        ])
    )
    client.on_disconnect = lambda c, ud, d, rc, p: log.warning(f"MQTT disconnected rc={rc}")

    client.loop_start()
    try:
        client.connect_async(MQTT_HOST, MQTT_PORT, keepalive=60)
    except Exception as e:
        log.error(f"Failed to initiate async MQTT connection: {e}")

# ── Main ─────────────────────────────────────────────────────────────────────

async def main():
    loop = asyncio.get_event_loop()

    # Запускаем MQTT в фоновом потоке средствами самого paho-mqtt
    start_mqtt(loop)
    log.info("MQTT bridge native async background thread started")

    log.info("Starting Telegram bot polling...")
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())

if __name__ == "__main__":
    asyncio.run(main())
