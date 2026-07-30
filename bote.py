import asyncio
import io
import random
import logging
import numpy as np
from PIL import Image, ImageOps, ImageEnhance
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, InputMediaPhoto, BufferedInputFile
from aiogram.filters import CommandStart
import socket

# --- ЖЕСТКИЙ ХАК ДЛЯ РАБОТЫ ЧЕРЕЗ ВКЛЮЧЕННЫЙ WIREGUARD ---
old_getaddrinfo = socket.getaddrinfo

def new_getaddrinfo(*args, **kwargs):
    host = args[0] if args else kwargs.get('host')
    if host == 'api.telegram.org':
        port = args[1] if len(args) > 1 else kwargs.get('port', 443)
        # Напрямую отдаем рабочий IP Телеграма, минуя баги DNS винды и VPN
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('149.154.167.220', port))]
    return old_getaddrinfo(*args, **kwargs)

socket.getaddrinfo = new_getaddrinfo
# ---------------------------------------------------------
# Вставь сюда токен своего бота
BOT_TOKEN = '8930684800:AAHGQmAMWEn2RCGPhUFW0Yxza_TUssugGkA'

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

def create_variations(img_bytes: io.BytesIO) -> list[io.BytesIO]:
    original = Image.open(img_bytes).convert("RGB")
    w, h = original.size
    variations = []
    
    for i in range(5):
        img = original.copy()
        
        # 1. Зеркалирование (с вероятностью 50%)
        # Для человека смысл картинки не меняется, для машины — это совершенно другое фото
        if random.choice([True, False]):
            img = ImageOps.mirror(img)
            
        # 2. Кроп и Зум (обрезаем случайные куски от 2% до 12% с каждой стороны)
        crop_left = int(w * random.uniform(0.02, 0.12))
        crop_top = int(h * random.uniform(0.02, 0.12))
        crop_right = w - int(w * random.uniform(0.02, 0.12))
        crop_bottom = h - int(h * random.uniform(0.02, 0.12))
        
        img = img.crop((crop_left, crop_top, crop_right, crop_bottom))
        
        # Растягиваем обратно до оригинального размера (или около того), чтобы сместить сетку
        img = img.resize((w, h), Image.Resampling.BICUBIC)
        
        # 3. Добавление асимметричной рамки (от 0 до 8% от ширины/высоты)
        # Это сдвигает картинку относительно центра холста
        pad_l = random.randint(0, int(w * 0.08))
        pad_t = random.randint(0, int(h * 0.08))
        pad_r = random.randint(0, int(w * 0.08))
        pad_b = random.randint(0, int(h * 0.08))
        
        # Цвет рамки можно сделать черным, белым или случайным
        bg_color = random.choice([(0, 0, 0), (255, 255, 255), (15, 15, 15)])
        img = ImageOps.expand(img, border=(pad_l, pad_t, pad_r, pad_b), fill=bg_color)
        
        # 4. Изменение яркости и контрастности (бьет по порогам хеширования)
        # Меняем от 0.75 (затемнение/снижение) до 1.25 (осветление/повышение)
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(random.uniform(0.75, 1.25))
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(random.uniform(0.75, 1.25))
        
        # 5. Сохранение с рандомным сжатием и удалением EXIF-метаданных (Pillow удаляет их по умолчанию)
        out_bio = io.BytesIO()
        img.save(out_bio, format='JPEG', quality=random.randint(80, 95))
        out_bio.seek(0)
        
        variations.append(out_bio)
        
    return variations
@dp.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        "Привет! Отправь мне любое количество картинок.\n\n"
        "Я пропущу каждую через свои фильтры (немного изменю соотношение сторон, "
        "добавлю шума, слегка искажу) и верну по 5 уникальных вариантов на каждую!"
    )

@dp.message(F.photo)
async def handle_photo(message: Message):
    # Берем фото самого лучшего качества (последнее в массиве photo)
    photo = message.photo[-1]
    
    # Скачиваем фото в оперативную память (без сохранения на диск)
    img_bytes = io.BytesIO()
    await bot.download(photo, destination=img_bytes)
    img_bytes.seek(0)
    
    # Вызываем тяжелую функцию обработки в отдельном пуле потоков,
    # чтобы бот продолжал отвечать другим пользователям, пока процессор считает шум
    loop = asyncio.get_event_loop()
    try:
        variations = await loop.run_in_executor(None, create_variations, img_bytes)
    except Exception as e:
        logging.error(f"Ошибка при обработке фото: {e}")
        await message.reply("Произошла ошибка при обработке картинки :(")
        return

    # Формируем медиагруппу (альбом) из 5 полученных картинок
    media_group = []
    for idx, bio in enumerate(variations):
        # BufferedInputFile передает байты напрямую в Telegram
        input_file = BufferedInputFile(bio.getvalue(), filename=f"variation_{idx}.jpg")
        media_group.append(InputMediaPhoto(media=input_file))
        
    # Отправляем альбом пользователю в ответ на его фото
    await message.reply_media_group(media=media_group)

async def main():
    logging.basicConfig(level=logging.INFO)
    print("Бот запущен и готов принимать пикчи!")
    # Запускаем поллинг (ожидание сообщений)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())