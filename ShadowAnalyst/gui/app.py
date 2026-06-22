import os
import sys
import time
import shutil
import base64
import random
import threading
from io import BytesIO
from PIL import Image
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import webview
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from openai import OpenAI

import json

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# Config loading
CONFIG_FILE = os.path.join(BASE_DIR, "config.json")

DEFAULT_CONFIG = {
    "watch_dir": r"C:\Clinic_MVP\Dropzone_XRay",
    "groq_api_keys": [
        "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",
        "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"
    ],
    "groq_vision_model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "mqtt_host": "62.84.100.97",
    "mqtt_port": 1883,
    "mqtt_user": "clinic",
    "mqtt_pass": "clinic2024",
    "mqtt_topic_xray": "clinic/xray/result"
}

if not os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(DEFAULT_CONFIG, f, indent=4, ensure_ascii=False)
    config = DEFAULT_CONFIG
else:
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        config = json.load(f)

WATCH_DIR = config.get("watch_dir", DEFAULT_CONFIG["watch_dir"])
GROQ_API_KEYS = config.get("groq_api_keys", DEFAULT_CONFIG["groq_api_keys"])
GROQ_VISION_MODEL = config.get("groq_vision_model", DEFAULT_CONFIG["groq_vision_model"])

MQTT_HOST = config.get("mqtt_host", DEFAULT_CONFIG["mqtt_host"])
MQTT_PORT = config.get("mqtt_port", DEFAULT_CONFIG["mqtt_port"])
MQTT_USER = config.get("mqtt_user", DEFAULT_CONFIG["mqtt_user"])
MQTT_PASS = config.get("mqtt_pass", DEFAULT_CONFIG["mqtt_pass"])
TOPIC_XRAY_RESULT = config.get("mqtt_topic_xray", DEFAULT_CONFIG["mqtt_topic_xray"])

# API for CRM (assuming clinic_admin is on the same VPS as MQTT)
CRM_API_URL = f"http://{MQTT_HOST}:8000/api/current_appointment"

# Ensure dirs exist
os.makedirs(WATCH_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "uploads"), exist_ok=True)

# State
app_state = {
    "is_processing": False,
    "latest_image": "",
    "latest_report": ""
}

api = FastAPI()
api.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@api.get("/", response_class=HTMLResponse)
def get_ui():
    with open(os.path.join(TEMPLATES_DIR, "index.html"), "r", encoding="utf-8") as f:
        return f.read()

@api.get("/api/status")
def get_status():
    return app_state

# AI Logic
def prepare_image(file_path):
    try:
        img = None
        if file_path.lower().endswith('.dcm'):
            import pydicom
            import numpy as np
            ds = pydicom.dcmread(file_path)
            arr = ds.pixel_array.astype(float)
            # Окно/Нормализация для рентгена
            arr = (np.maximum(arr, 0) / arr.max()) * 255.0
            arr = np.uint8(arr)
            # Учитываем инверсию DICOM
            if getattr(ds, 'PhotometricInterpretation', '') == 'MONOCHROME1':
                arr = 255 - arr
            img = Image.fromarray(arr)
        else:
            img = Image.open(file_path)
            
        with img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            max_size = 1000
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=80, optimize=True)
            img_bytes = buffer.getvalue()
            return f"data:image/jpeg;base64,{base64.b64encode(img_bytes).decode('utf-8')}"
    except Exception as e:
        print(f"Image error: {e}")
        return None

def run_ai_analysis(file_path, patient_info=None):
    image_b64 = prepare_image(file_path)
    if not image_b64:
        return "Ошибка обработки картинки."

    # Load prompt
    prompt_path = os.path.join(os.path.dirname(BASE_DIR), "dentalimage.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            system_prompt = f.read()
    except Exception:
        system_prompt = "Опиши снимок зубов."

    if patient_info:
        system_prompt += f"\n\nВАЖНО: Это снимок пациента по имени {patient_info['patient_name']}. Упомяни его имя в отчете."

    keys = GROQ_API_KEYS.copy()
    random.shuffle(keys)

    for api_key in keys:
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
            timeout=40.0,
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
            return response.choices[0].message.content.strip()
        except Exception as e:
            if "429" in str(e):
                continue
            return f"Сбой ИИ: {e}"
    return "Сбой: исчерпаны лимиты API."

def send_to_mqtt(image_path, report_text, filename, patient_name=None):
    import paho.mqtt.client as mqtt
    import base64
    import json
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        payload = {
            "file": filename,
            "report": report_text,
            "image_b64": encoded_string,
            "patient_name": patient_name
        }
        
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.username_pw_set(MQTT_USER, MQTT_PASS)
        client.connect(MQTT_HOST, MQTT_PORT, 60)
        client.publish(TOPIC_XRAY_RESULT, json.dumps(payload), qos=1)
        client.disconnect()
        print(f"MQTT: Successfully published {filename} to {TOPIC_XRAY_RESULT}")
    except Exception as e:
        print(f"MQTT Publish error: {e}")

# Watchdog logic
global_window = None
processing_files = set()

def wait_for_file_ready(file_path, timeout=30):
    start_time = time.time()
    last_size = -1
    while time.time() - start_time < timeout:
        try:
            current_size = os.path.getsize(file_path)
            if current_size == last_size and current_size > 0:
                # Попробуем открыть для проверки доступности
                with open(file_path, 'rb') as f:
                    pass
                return True
            last_size = current_size
        except OSError:
            pass
        time.sleep(0.5)
    return False

def process_new_xray(file_path):
    filename = os.path.basename(file_path)
    if filename in processing_files:
        return
    
    processing_files.add(filename)
    try:
        print(f"Waiting for file to be ready: {file_path}")
        if not wait_for_file_ready(file_path):
            print(f"Timeout waiting for file {file_path}")
            return
            
        # Update state to loading
        app_state["is_processing"] = True
        
        # Bring window to front
        if global_window:
            global_window.restore()
            global_window.show()

        # Copy to static folder (if DICOM, save as JPEG so browser can render it)
        if file_path.lower().endswith('.dcm'):
            # Convert for UI
            img_b64 = prepare_image(file_path)
            if img_b64:
                header, encoded = img_b64.split(",", 1)
                data = base64.b64decode(encoded)
                filename = filename + ".jpg" # UI need standard ext
                static_img_path = os.path.join(STATIC_DIR, "uploads", filename)
                with open(static_img_path, "wb") as f:
                    f.write(data)
            else:
                static_img_path = os.path.join(STATIC_DIR, "uploads", filename)
                shutil.copy2(file_path, static_img_path)
        else:
            static_img_path = os.path.join(STATIC_DIR, "uploads", filename)
            shutil.copy2(file_path, static_img_path)

        # Fetch patient from CRM
        patient_info = None
        try:
            resp = requests.get(CRM_API_URL, timeout=3)
            if resp.status_code == 200:
                data = resp.json()
                if "error" not in data:
                    patient_info = data
                    print(f"CRM Link: Found patient {patient_info['patient_name']}")
        except Exception as e:
            print(f"CRM API error: {e}")

        # Analyze
        report = run_ai_analysis(file_path, patient_info)

        # Send to MQTT in background
        pat_name = patient_info["patient_name"] if patient_info else "Неизвестен"
        threading.Thread(target=send_to_mqtt, args=(file_path, report, filename, pat_name), daemon=True).start()

        # Update state
        app_state["latest_image"] = f"/static/uploads/{filename}"
        app_state["latest_report"] = report
        app_state["is_processing"] = False
        print("Analysis complete.")
    finally:
        # Убираем из множества через некоторое время, чтобы избежать дублей при изменении
        threading.Timer(10.0, lambda: processing_files.discard(filename)).start()

class XRayHandler(FileSystemEventHandler):
    def on_created(self, event):
        self.handle_event(event)
        
    def on_modified(self, event):
        self.handle_event(event)

    def handle_event(self, event):
        if event.is_directory:
            return
        if not event.src_path.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.webp', '.dcm')):
            return
        
        # Start processing in a background thread to avoid blocking Watchdog
        threading.Thread(target=process_new_xray, args=(event.src_path,), daemon=True).start()

def start_watchdog():
    observer = Observer()
    observer.schedule(XRayHandler(), WATCH_DIR, recursive=False)
    observer.start()
    return observer

# Main
def start_server():
    uvicorn.run(api, host="127.0.0.1", port=8085, log_level="error")

if __name__ == '__main__':
    # Start web server
    t = threading.Thread(target=start_server, daemon=True)
    t.start()
    
    # Wait for server
    time.sleep(1)

    # Start watcher
    observer = start_watchdog()

    # Start PyWebView UI
    print("Starting Desktop App...")
    global_window = webview.create_window(
        'ShadowAnalyst', 
        'http://127.0.0.1:8085',
        width=1200, 
        height=800,
        min_size=(800, 600),
        frameless=False,
        background_color='#0a0e17'
    )
    
    webview.start(debug=True)
    
    # Cleanup
    observer.stop()
    observer.join()
