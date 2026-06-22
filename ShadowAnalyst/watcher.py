import os
import time
import json
import base64
import random
from io import BytesIO
from PIL import Image
import paho.mqtt.client as mqtt
from openai import OpenAI

# Config Defaults
WATCH_DIR = r"C:\Clinic_MVP\Dropzone_XRay"
PROCESSED_DIR = r"C:\Clinic_MVP\Processed"
MQTT_HOST = "62.84.100.97" # Default public IP
MQTT_PORT = 1883
MQTT_USER = "clinic"
MQTT_PASS = "clinic2024"
TOPIC_XRAY_RESULT = "clinic/xray/result"

# API Defaults
GROQ_API_KEYS = [
    "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",
    "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",
    "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",
    "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",
    "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"
]
GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
GOOGLE_API_KEYS = []

# Load config dynamically if exists
CONFIG_FILE = r"C:\Clinic_MVP\config.json"
if os.path.exists(CONFIG_FILE):
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            config = json.load(f)
            WATCH_DIR = config.get("watch_dir", WATCH_DIR)
            PROCESSED_DIR = config.get("processed_dir", PROCESSED_DIR)
            MQTT_HOST = config.get("mqtt_host", MQTT_HOST)
            MQTT_PORT = config.get("mqtt_port", MQTT_PORT)
            MQTT_USER = config.get("mqtt_user", MQTT_USER)
            MQTT_PASS = config.get("mqtt_pass", MQTT_PASS)
            TOPIC_XRAY_RESULT = config.get("mqtt_topic_xray", TOPIC_XRAY_RESULT)
            GROQ_API_KEYS = config.get("groq_api_keys", GROQ_API_KEYS)
            GROQ_VISION_MODEL = config.get("groq_vision_model", GROQ_VISION_MODEL)
            GOOGLE_API_KEYS = config.get("google_api_keys", GOOGLE_API_KEYS)
    except Exception as e:
        print(f"Error loading config.json: {e}")

def setup_dirs():
    os.makedirs(WATCH_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DIR, exist_ok=True)

def prepare_image(file_path):
    """Сжимает картинку для отправки в Groq, возвращает base64 строку."""
    try:
        with Image.open(file_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Ужимаем до 1000px по большей стороне для экономии трафика и лимитов
            max_size = 1000
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=80, optimize=True)
            img_bytes = buffer.getvalue()
            return f"data:image/jpeg;base64,{base64.b64encode(img_bytes).decode('utf-8')}"
    except Exception as e:
        print(f"Ошибка подготовки картинки: {e}")
        return None

# Загружаем огромный экспертный промпт один раз при старте
prompt_path = os.path.join(os.path.dirname(__file__), "dentalimage.md")
try:
    with open(prompt_path, "r", encoding="utf-8") as f:
        SYSTEM_PROMPT = f.read()
except Exception as e:
    print(f"Не удалось загрузить dentalimage.md: {e}")
    SYSTEM_PROMPT = "Опиши снимок зубов как стоматолог."

from PIL import Image, ImageDraw, ImageFont

def make_groq_client(api_key: str) -> OpenAI:
    return OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
        timeout=30.0,
        max_retries=0
    )

def make_gemini_client(api_key: str) -> OpenAI:
    return OpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        timeout=30.0,
        max_retries=0
    )

def analyze_image(file_path):
    """Анализирует снимок, используя каскад моделей Gemini -> Groq."""
    image_b64 = prepare_image(file_path)
    if not image_b64:
        return None, "Ошибка обработки файла"

    # Default cascade sequence
    models_with_providers = [
        ("gemini-3.5-flash", "gemini"),
        ("models/gemini-3.1-flash-lite", "gemini"),
        (GROQ_VISION_MODEL, "groq")
    ]

    first_report = ""
    last_err = "Нет доступных ключей"
    
    for model_name, provider in models_with_providers:
        if provider == "gemini":
            keys = GOOGLE_API_KEYS.copy()
            client_maker = make_gemini_client
        else:
            keys = GROQ_API_KEYS.copy()
            client_maker = make_groq_client

        random.shuffle(keys)
        success = False
        
        for api_key in keys:
            if not api_key:
                continue
            try:
                client = client_maker(api_key)
                response = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": SYSTEM_PROMPT},
                                {"type": "image_url", "image_url": {"url": image_b64}}
                            ]
                        }
                    ],
                    max_tokens=1500
                )
                if response.choices and len(response.choices) > 0:
                    val = response.choices[0].message.content
                    if val:
                        first_report = val.strip()
                        success = True
                        break
            except Exception as e:
                print(f"[!] Сбой ключа ИИ ({model_name}, {provider}): {e}")
                last_err = e
                continue
        if success:
            break

    if not first_report:
        return None, f"Сбой ИИ-анализа: все ключи исчерпаны. Ошибка: {last_err}"
        
    return None, first_report

def publish_result(filename, findings):
    """Публикует результат в MQTT для показа врачу и отправки в ТГ."""
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_USER, MQTT_PASS)
    try:
        client.connect(MQTT_HOST, MQTT_PORT, 5)
        payload = {
            "file": filename,
            "findings": findings
        }
        client.publish(TOPIC_XRAY_RESULT, json.dumps(payload, ensure_ascii=False))
        client.disconnect()
        print(f"-> Опубликовано в MQTT: {filename}")
    except Exception as e:
        print(f"Ошибка отправки MQTT: {e}")

def watch_loop():
    setup_dirs()
    print(f"[*] Shadow Analyst запущен. Жду снимки в: {WATCH_DIR}")
    
    while True:
        try:
            for filename in os.listdir(WATCH_DIR):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                    file_path = os.path.join(WATCH_DIR, filename)
                    
                    # Проверка что файл полностью записался
                    size1 = os.path.getsize(file_path)
                    time.sleep(1)
                    size2 = os.path.getsize(file_path)
                    
                    if size1 == size2 and size1 > 0:
                        print(f"\n[+] Найден новый снимок: {filename}")
                        print("    Отправка в ИИ...")
                        
                        start_time = time.time()
                        # Анализ ИИ и отрисовка рамок
                        marked_path, findings = analyze_image(file_path)
                        elapsed = time.time() - start_time
                        print(f"    Анализ завершен за {elapsed:.1f} сек. Результат:\n{findings}")
                        
                        # Отправка результатов
                        final_file_for_popup = marked_path if marked_path else file_path
                        publish_result(os.path.basename(final_file_for_popup), findings)
                        
                        # Перемещение обработанного оригинала (с повторной попыткой, если заблокирован)
                        processed_path = os.path.join(PROCESSED_DIR, filename)
                        try:
                            os.replace(file_path, processed_path)
                        except PermissionError:
                            print("    [!] Файл занят, повторная попытка через 2 сек...")
                            time.sleep(2)
                            os.replace(file_path, processed_path)
                        
                        # Если есть размеченный, тоже переносим
                        if marked_path and os.path.exists(marked_path):
                            marked_filename = os.path.basename(marked_path)
                            try:
                                os.replace(marked_path, os.path.join(PROCESSED_DIR, marked_filename))
                            except Exception as e:
                                print(f"    [!] Ошибка перемещения размеченного файла: {e}")
                        
                        print(f"    Файлы перемещены в {PROCESSED_DIR}")
                        
            time.sleep(2)
        except KeyboardInterrupt:
            print("Остановка.")
            break
        except Exception as e:
            print(f"Глобальная ошибка: {e}")
            time.sleep(5)

if __name__ == "__main__":
    watch_loop()
