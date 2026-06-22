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
from datetime import datetime

import paho.mqtt.client as mqtt
from aiogram import Bot, Dispatcher, Router, F
from aiogram.types import Message
from aiogram.filters import Command, CommandStart

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
    role = db.get_user_role(chat_id)
    if not role:
        db.add_user(chat_id, 'doctor', message.from_user.full_name) # По умолчанию врач для простоты
        role = 'doctor'
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
    doctors = len(db.get_users_by_role('doctor'))
    admins = len(db.get_users_by_role('admin'))
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
    users = db.get_users_by_role(role)
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
    users = db.get_users_by_role(role)
    if not users:
        log.warning(f"No registered {role}s to send photo to.")
        return
    
    async def _send_to_user(chat_id):
        try:
            input_file = BufferedInputFile(photo_bytes, filename="xray.jpg")
            await bot.send_photo(chat_id, photo=input_file, caption=caption, parse_mode="Markdown")
            
            # Send the rest as text
            max_len = 4000
            for i in range(0, len(report_text), max_len):
                chunk = report_text[i:i+max_len]
                await bot.send_message(chat_id, text=chunk)
        except Exception as e:
            log.error(f"Failed to send photo to {chat_id}: {e}")

    await asyncio.gather(*(_send_to_user(chat_id) for chat_id in users))

def on_mqtt_message(client, userdata, msg):
    """Колбэк от MQTT — запускаем корутину broadcast в event loop бота."""
    topic = msg.topic
    try:
        payload = json.loads(msg.payload.decode('utf-8'))
    except Exception:
        payload = {"text": msg.payload.decode('utf-8', errors='replace')}

    log.info(f"MQTT [{topic}] received.")

    loop = userdata.get('loop')
    if not loop:
        return

    # Формируем текст в зависимости от топика
    if topic == TOPIC_XRAY_RESULT:
        # X-Ray Results go to DOCTORS
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
    elif topic == TOPIC_ALERT_ADMIN:
        text = f"🚨 *АЛЕРТ*\n\n{payload.get('text', str(payload))}"
        asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)
    elif topic == TOPIC_REVIEW_NEG:
        text = (
            f"⚠️ *Негативный отзыв*\n\n"
            f"Пациент: {payload.get('patient', 'неизвестен')}\n"
            f"Сообщение: _{payload.get('text', '')}_\n\n"
            f"Требует обратной связи!"
        )
        asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)
    elif topic == TOPIC_MARKETING_SEND:
        text = (
            f"📣 *Маркетинг — задание*\n\n"
            f"Пациент: {payload.get('patient', '?')}\n"
            f"Черновик: _{payload.get('draft', '')}_"
        )
        asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)
    else:
        text = f"📨 `{topic}`\n\n{str(payload)}"
        asyncio.run_coroutine_threadsafe(broadcast(text, role='admin'), loop)

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

    while True:
        try:
            client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
            client.loop_forever()
        except Exception as e:
            log.error(f"MQTT error: {e}, retrying in 5s...")
            import time; time.sleep(5)

# ── Main ─────────────────────────────────────────────────────────────────────

async def main():
    loop = asyncio.get_event_loop()

    # Запускаем MQTT в фоновом потоке
    mqtt_thread = threading.Thread(target=start_mqtt, args=(loop,), daemon=True)
    mqtt_thread.start()
    log.info("MQTT bridge thread started")

    log.info("Starting Telegram bot polling...")
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())

if __name__ == "__main__":
    asyncio.run(main())
