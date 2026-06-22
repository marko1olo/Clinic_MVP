import os
import time
import json
import base64
import random
from io import BytesIO
from PIL import Image
import paho.mqtt.client as mqtt
from openai import OpenAI

# Config
WATCH_DIR = r"C:\Clinic_MVP\Dropzone_XRay"
PROCESSED_DIR = r"C:\Clinic_MVP\Processed"
MQTT_HOST = os.environ.get("MQTT_HOST", "10.77.0.1")
MQTT_PORT = int(os.environ.get("MQTT_PORT", 1883))
MQTT_USER = os.environ.get("MQTT_USER", "clinic")
MQTT_PASS = os.environ.get("MQTT_PASS")
TOPIC_XRAY_RESULT = "clinic/xray/result"

# Groq API
GROQ_API_KEYS = [
    "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",
    "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"
]
GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

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


from PIL import Image, ImageDraw, ImageFont
def analyze_image(file_path):
    """Шлет картинку в Groq Vision API с ротацией ключей при лимитах (429)."""
    image_b64 = prepare_image(file_path)
    if not image_b64:
        return None, "Ошибка обработки файла"

    # Читаем огромный экспертный промпт из файла
    prompt_path = os.path.join(os.path.dirname(__file__), "dentalimage.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            system_prompt = f.read()
    except Exception as e:
        print(f"Не удалось загрузить dentalimage.md: {e}")
        system_prompt = "Опиши снимок зубов как стоматолог."

    keys = GROQ_API_KEYS.copy()
    random.shuffle(keys)

    for api_key in keys:
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
            timeout=30.0,
            max_retries=0
        )
        try:
            response = client.chat.completions.create(
                model=GROQ_VISION_MODEL,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": system_prompt},
                            {"type": "image_url", "image_url": {"url": image_b64}}
                        ]
                    }
                ],
                max_tokens=1500
            )
            report = response.choices[0].message.content.strip()
            return None, report # None вместо marked_path
        except Exception as e:
            err_str = str(e).lower()
            if "429" in err_str:
                print(f"[!] Лимит по ключу {api_key[:8]}... Пробуем следующий.")
                continue
            else:
                print(f"Ошибка API Groq: {e}")
                return None, f"Сбой ИИ-анализа: {e}"

    return None, "Сбой: Все ключи Groq исчерпали лимиты (429)."

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
                        
                        # Анализ ИИ и отрисовка рамок
                        marked_path, findings = analyze_image(file_path)
                        print(f"    Анализ завершен. Результат:\n{findings}")
                        
                        # Отправка результатов
                        # Если размеченный файл создан, отправляем его имя
                        final_file_for_popup = marked_path if marked_path else file_path
                        publish_result(os.path.basename(final_file_for_popup), findings)
                        
                        # Перемещение обработанного оригинала
                        processed_path = os.path.join(PROCESSED_DIR, filename)
                        os.replace(file_path, processed_path)
                        
                        # Если есть размеченный, тоже переносим
                        if marked_path and os.path.exists(marked_path):
                            marked_filename = os.path.basename(marked_path)
                            os.replace(marked_path, os.path.join(PROCESSED_DIR, marked_filename))
                        
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
