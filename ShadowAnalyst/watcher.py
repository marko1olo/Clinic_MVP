import os
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import time
import json
import base64
import random
import threading
from io import BytesIO
from PIL import Image
from openai import OpenAI
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Config Defaults
WATCH_DIR = r"C:\Clinic_MVP\Dropzone_XRay"
PROCESSED_DIR = r"C:\Clinic_MVP\Processed"
MQTT_HOST = "62.84.100.97" # Default public IP
MQTT_PORT = 1883
MQTT_USER = os.getenv("MQTT_USER", "")
MQTT_PASS = os.getenv("MQTT_PASS", "")
TOPIC_XRAY_RESULT = "clinic/xray/result"

# API Defaults
GROQ_API_KEYS = [key.strip() for key in os.getenv("GROQ_API_KEYS", "").split(",") if key.strip()]
GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
GOOGLE_API_KEYS = [key.strip() for key in os.getenv("GOOGLE_API_KEYS", "").split(",") if key.strip()]

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

_clients_cache = {}

def get_openai_client(api_key, base_url, timeout=30.0):
    cache_key = (api_key, base_url)
    if cache_key not in _clients_cache:
        _clients_cache[cache_key] = OpenAI(
            api_key=api_key if api_key else "dummy_key",
            base_url=base_url,
            timeout=timeout,
            max_retries=0
        )
    return _clients_cache[cache_key]

def make_groq_client(api_key: str) -> OpenAI:
    return get_openai_client(api_key, "https://api.groq.com/openai/v1")

def make_gemini_client(api_key: str) -> OpenAI:
    return get_openai_client(api_key, "https://generativelanguage.googleapis.com/v1beta/openai/")

def _call_ai_model(client: OpenAI, model_name: str, image_b64: str) -> str | None:
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
        ]
    )
    if response.choices and len(response.choices) > 0:
        val = response.choices[0].message.content
        if val:
            import re
            return re.sub(r"<think>.*?</think>", "", val, flags=re.DOTALL).strip()
    return None

def _try_provider_keys(model_name: str, provider: str, image_b64: str) -> tuple[str, Exception | str | None]:
    if provider == "gemini":
        keys = GOOGLE_API_KEYS.copy()
        client_maker = make_gemini_client
    else:
        keys = GROQ_API_KEYS.copy()
        client_maker = make_groq_client

    random.shuffle(keys)
    last_err = "Нет доступных ключей"

    for api_key in keys:
        if not api_key:
            continue
        try:
            client = client_maker(api_key)
            report = _call_ai_model(client, model_name, image_b64)
            if report:
                return report, None
        except Exception as e:
            print(f"[!] Сбой ключа ИИ ({model_name}, {provider}): {e}")
            last_err = e
            continue

    return "", last_err

def analyze_image(file_path):
    """Анализирует снимок, используя каскад моделей Gemini -> Groq."""
    image_b64 = prepare_image(file_path)
    if not image_b64:
        return None, "Ошибка обработки файла"

    # Default cascade sequence
    models_with_providers = [
        ("gemini-3.5-flash", "gemini"),
        ("gemini-3-flash-preview", "gemini"),
        ("qwen/qwen3.6-27b", "groq"),
        (GROQ_VISION_MODEL, "groq")
    ]

    first_report = ""
    last_err = "Нет доступных ключей"
    
    for model_name, provider in models_with_providers:
        report, err = _try_provider_keys(model_name, provider, image_b64)
        if report:
            first_report = report
            break
        if err:
            last_err = err

    if not first_report:
        return None, f"Сбой ИИ-анализа: все ключи исчерпаны. Ошибка: {last_err}"
        
    return None, first_report

def publish_result(filename, findings):
    """Публикует результат в MQTT для показа врачу и отправки в ТГ."""
    import paho.mqtt.client as mqtt
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    if MQTT_USER:
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

processing_files = set()
processing_lock = threading.Lock()

def process_single_file(file_path):
    with processing_lock:
        if file_path in processing_files:
            return
        processing_files.add(file_path)

    try:
        filename = os.path.basename(file_path)

        # Проверка что файл полностью записался
        size1 = os.path.getsize(file_path)
        time.sleep(1)
        if not os.path.exists(file_path):
            return
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
            # Если размеченный файл создан, отправляем его имя
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
    except FileNotFoundError:
        pass # File was already processed or moved
    except Exception as e:
        print(f"Ошибка при обработке {file_path}: {e}")
    finally:
        threading.Timer(10.0, lambda: processing_files.discard(file_path)).start()

class XRayHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        if event.src_path.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
            threading.Thread(target=process_single_file, args=(event.src_path,), daemon=True).start()

    def on_modified(self, event):
        if event.is_directory:
            return
        if event.src_path.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
            threading.Thread(target=process_single_file, args=(event.src_path,), daemon=True).start()

def watch_loop():
    setup_dirs()
    print(f"[*] Shadow Analyst запущен. Жду снимки в: {WATCH_DIR}")
    
    # Process existing files first
    try:
        for filename in os.listdir(WATCH_DIR):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                file_path = os.path.join(WATCH_DIR, filename)
                threading.Thread(target=process_single_file, args=(file_path,), daemon=True).start()
    except Exception as e:
        print(f"Ошибка при проверке существующих файлов: {e}")

    event_handler = XRayHandler()
    observer = Observer()
    observer.schedule(event_handler, WATCH_DIR, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Остановка.")
        observer.stop()
    except Exception as e:
        print(f"Глобальная ошибка: {e}")
        observer.stop()
    observer.join()

if __name__ == "__main__":
    watch_loop()
