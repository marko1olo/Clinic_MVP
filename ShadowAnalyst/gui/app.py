import os
import asyncio
import sys
import time
import shutil
import base64
import random
import threading
import subprocess
import re
from io import BytesIO
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import webview
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from openai import OpenAI

import json
import edge_tts
import database
import aiofiles

# --- LOGGING INTERCEPTOR ---
import collections
log_buffer = collections.deque(maxlen=200)

class LogInterceptor:
    def __init__(self, original_stdout):
        self.original_stdout = original_stdout

    def write(self, message):
        if self.original_stdout is not None:
            try:
                self.original_stdout.write(message)
            except Exception:
                pass
        if message.strip():
            log_buffer.append(message.strip())

    def flush(self):
        if self.original_stdout is not None:
            try:
                self.original_stdout.flush()
            except Exception:
                pass

    def isatty(self):
        return False

sys.stdout = LogInterceptor(sys.stdout)
sys.stderr = LogInterceptor(sys.stderr)


# ─── SSH SOCKS5 Tunnel Manager ────────────────────────────────────────────────
# При блокировке Groq API (РФ-фильтры) автоматически поднимает SOCKS5 прокси
# через VPS по SSH. Не трогает системные маршруты, не нужен WireGuard.

SOCKS_PORT     = 1080
SSH_HOST       = "root@62.84.100.97"
SSH_KEY        = os.path.expanduser(r"~\.ssh\id_ed25519")
SOCKS_PROXY    = f"socks5://127.0.0.1:{SOCKS_PORT}"

_tunnel_proc   : subprocess.Popen | None = None
_tunnel_lock   = threading.Lock()
_tunnel_active = False

def _is_tunnel_up() -> bool:
    """Проверяет, запущен ли SSH-процесс туннеля."""
    global _tunnel_proc
    return _tunnel_proc is not None and _tunnel_proc.poll() is None

def ensure_tunnel() -> bool:
    """Запускает SSH SOCKS5 туннель если не активен. Возвращает True при успехе."""
    global _tunnel_proc, _tunnel_active
    with _tunnel_lock:
        if _is_tunnel_up():
            return True
        print("[VPN] Поднимаю SSH SOCKS5 туннель...")
        try:
            cmd = [
                "ssh",
                "-N", "-D", str(SOCKS_PORT),
                "-4",
                "-o", "StrictHostKeyChecking=no",
                "-o", "ServerAliveInterval=15",
                "-o", "ServerAliveCountMax=3",
                "-o", "ConnectTimeout=10",
                "-o", "ExitOnForwardFailure=yes",
                "-i", SSH_KEY,
                SSH_HOST
            ]
            _tunnel_proc = subprocess.Popen(
                cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            # Даём SSH секунду на установку
            time.sleep(1.5)
            if _is_tunnel_up():
                _tunnel_active = True
                print(f"[VPN] Туннель активен (PID={_tunnel_proc.pid})")
                return True
            else:
                print("[VPN] SSH туннель не запустился")
                return False
        except Exception as e:
            print(f"[VPN] Ошибка запуска туннеля: {e}")
            return False

def stop_tunnel():
    global _tunnel_proc, _tunnel_active
    with _tunnel_lock:
        if _tunnel_proc and _tunnel_proc.poll() is None:
            _tunnel_proc.terminate()
            print("[VPN] Туннель остановлен")
        _tunnel_proc = None
        _tunnel_active = False

def make_groq_client(api_key: str, use_proxy: bool = False) -> OpenAI:
    """Создаёт OpenAI-совместимый Groq-клиент, опционально через SOCKS5."""
    timeout_val = 20.0 if use_proxy else 12.0
    kwargs = dict(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
        timeout=timeout_val,
        max_retries=0
    )
    if use_proxy:
        import httpx
        http_client = httpx.Client(proxy=SOCKS_PROXY, timeout=20.0)
        kwargs["http_client"] = http_client
    return OpenAI(**kwargs)

def check_internet_connection(timeout=1):
    import socket
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect(("8.8.8.8", 53))
        return True
    except Exception:
        return False

from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception

def is_retryable(exception):
    err_str = str(exception).lower()
    if "429" in err_str or "too many requests" in err_str or "401" in err_str or "unauthorized" in err_str or "403" in err_str or "invalid" in err_str:
        return False
    return True

gemini_use_proxy = False
groq_use_proxy = False

def check_tcp_socks5(target_host, target_port, timeout=3.0) -> bool:
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        s.connect(("127.0.0.1", SOCKS_PORT))
        
        # SOCKS5 greeting
        s.sendall(b"\x05\x01\x00")
        resp = s.recv(2)
        if len(resp) < 2 or resp[0] != 0x05 or resp[1] != 0x00:
            s.close()
            return False
            
        # SOCKS5 CONNECT request
        host_bytes = target_host.encode('ascii')
        request = b"\x05\x01\x00\x03" + bytes([len(host_bytes)]) + host_bytes + target_port.to_bytes(2, 'big')
        s.sendall(request)
        
        resp = s.recv(10)
        s.close()
        if len(resp) >= 2 and resp[0] == 0x05 and resp[1] == 0x00:
            return True
        return False
    except Exception:
        return False

def check_connection_loop():
    global gemini_use_proxy, groq_use_proxy
    print("[VPN] Запущен фоновый мониторинг доступности API...")
    
    # Сначала сделаем быструю проверку при запуске
    time.sleep(2)
    
    while True:
        # 1. Проверяем Gemini напрямую по TCP
        import socket
        try:
            socket.setdefaulttimeout(3.0)
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(("generativelanguage.googleapis.com", 443))
            s.close()
            if gemini_use_proxy:
                print("[VPN Monitor] Gemini API доступен напрямую. Переключаем на direct.")
            gemini_use_proxy = False
        except Exception:
            # Если прямой доступ не удался, пробуем через SSH-туннель
            if ensure_tunnel():
                if check_tcp_socks5("generativelanguage.googleapis.com", 443):
                    if not gemini_use_proxy:
                        print("[VPN Monitor] Gemini напрямую недоступен. Переключаем на прокси.")
                    gemini_use_proxy = True

        # 2. Проверяем Groq напрямую по TCP
        try:
            socket.setdefaulttimeout(3.0)
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(("api.groq.com", 443))
            s.close()
            if groq_use_proxy:
                print("[VPN Monitor] Groq API доступен напрямую. Переключаем на direct.")
            groq_use_proxy = False
        except Exception:
            # Если прямой доступ не удался, пробуем через SSH-туннель
            if ensure_tunnel():
                if check_tcp_socks5("api.groq.com", 443):
                    if not groq_use_proxy:
                        print("[VPN Monitor] Groq напрямую недоступен. Переключаем на прокси.")
                    groq_use_proxy = True
        
        time.sleep(60)

@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=2, max=8), reraise=True, retry=retry_if_exception(is_retryable))
def groq_chat(api_key: str, **kwargs):
    client = make_groq_client(api_key, use_proxy=groq_use_proxy)
    try:
        return client.chat.completions.create(**kwargs)
    except Exception as e:
        err = str(e)
        is_conn_err = any(x in err for x in [
            "Connection", "timeout", "RemoteDisconnected",
            "ConnectionError", "SSLError", "ProxyError",
            "Network", "OSError", "[Errno"
        ])
        if not is_conn_err:
            raise
        if not groq_use_proxy:
            print(f"[VPN] Сбой прямого запроса Groq ({e}). Пробуем через SSH SOCKS5...")
            if ensure_tunnel():
                client_proxy = make_groq_client(api_key, use_proxy=True)
                return client_proxy.chat.completions.create(**kwargs)
        raise

def make_gemini_client(api_key: str, use_proxy: bool = False) -> OpenAI:
    """Создаёт OpenAI-совместимый Gemini-клиент, опционально через SOCKS5."""
    timeout_val = 20.0 if use_proxy else 12.0
    kwargs = dict(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        timeout=timeout_val,
        max_retries=1
    )
    if use_proxy:
        import httpx
        http_client = httpx.Client(proxy=SOCKS_PROXY, timeout=20.0)
        kwargs["http_client"] = http_client
    return OpenAI(**kwargs)

@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=2, max=8), reraise=True, retry=retry_if_exception(is_retryable))
def gemini_chat(api_key: str, **kwargs):
    client = make_gemini_client(api_key, use_proxy=gemini_use_proxy)
    try:
        return client.chat.completions.create(**kwargs)
    except Exception as e:
        err = str(e)
        is_conn_err = any(x in err for x in [
            "Connection", "timeout", "RemoteDisconnected",
            "ConnectionError", "SSLError", "ProxyError",
            "Network", "OSError", "[Errno"
        ])
        if not is_conn_err:
            raise
        if not gemini_use_proxy:
            print(f"[VPN] Сбой прямого запроса Gemini ({e}). Пробуем через SSH SOCKS5...")
            if ensure_tunnel():
                client_proxy = make_gemini_client(api_key, use_proxy=True)
                return client_proxy.chat.completions.create(**kwargs)
        raise

# ──────────────────────────────────────────────────────────────────────────────

# Paths
if getattr(sys, 'frozen', False):
    # PyInstaller temp folder
    BASE_DIR = sys._MEIPASS
    EXE_DIR = os.path.dirname(sys.executable)
else:
    # Normal execution
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    EXE_DIR = BASE_DIR

STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# Config loading
import database
PROJECT_ROOT = database.PROJECT_ROOT

# Manual .env Loader to avoid third-party library issues and load from root paths
def load_dotenv_manually():
    possible_env_paths = [
        os.path.join(PROJECT_ROOT, ".env"),
        os.path.abspath(os.path.join(BASE_DIR, "..", "..", ".env")), # C:\Clinic_MVP\.env
        os.path.abspath(os.path.join(BASE_DIR, "..", ".env")),      # C:\Clinic_MVP\ShadowAnalyst\.env
        os.path.join(BASE_DIR, ".env"),                             # C:\Clinic_MVP\ShadowAnalyst\gui\.env
        os.path.join(EXE_DIR, ".env"),
        os.path.join(os.getcwd(), ".env")
    ]
    loaded = False
    for path in possible_env_paths:
        if os.path.exists(path):
            print(f"[CONFIG] Found .env file at {path}. Loading environment variables.")
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#"):
                            continue
                        parts = line.split("=", 1)
                        if len(parts) == 2:
                            k = parts[0].strip()
                            v = parts[1].strip()
                            if v.startswith(('"', "'")) and v.endswith(('"', "'")):
                                v = v[1:-1]
                            os.environ[k] = v
                loaded = True
            except Exception as e:
                print(f"[CONFIG] Error reading .env at {path}: {e}")
    if not loaded:
        print("[CONFIG] No .env file loaded on startup.")

load_dotenv_manually()

# Config loading - search in multiple locations to support dev/prod mode configs
CONFIG_FILE = os.path.join(PROJECT_ROOT, "config.json")
possible_config_paths = [
    CONFIG_FILE,
    os.path.abspath(os.path.join(BASE_DIR, "..", "..", "config.json")), # C:\Clinic_MVP\config.json
    os.path.abspath(os.path.join(BASE_DIR, "..", "config.json")),      # C:\Clinic_MVP\ShadowAnalyst\config.json
    os.path.join(EXE_DIR, "config.json"),                             # C:\Clinic_MVP\ShadowAnalyst\gui\config.json
    os.path.join(os.getcwd(), "config.json")
]

for path in possible_config_paths:
    if os.path.exists(path):
        CONFIG_FILE = path
        print(f"[CONFIG] Found config.json at {path}")
        break

DEFAULT_CONFIG = {
    "watch_dir": r"C:\Clinic_MVP\Dropzone_XRay",
    "groq_api_keys": [key.strip() for key in os.getenv("GROQ_API_KEYS", "").split(",") if key.strip()],
    "google_api_keys": [key.strip() for key in os.getenv("GOOGLE_API_KEYS", "").split(",") if key.strip()],
    "use_gemini": True,
    "gemini_vision_model": "gemini-3.5-flash",
    "groq_vision_model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "mqtt_host": "62.84.100.97",
    "mqtt_port": 1883,
    "mqtt_user": os.getenv("MQTT_USER", ""),
    "mqtt_pass": os.getenv("MQTT_PASS", ""),
    "mqtt_topic_xray": "clinic/xray/result",
    "auto_analyze": True,
    "auto_enhance": False,
    "theme": "theme-noir",
    "tts_voice": "ru-RU-DmitryNeural",
    "model_tier": 2, # Default tier is 2 (Qwen 3.6 + Llama 4) as recommended by user
    "comparison_slider": True,
    "tts_provider": "elevenlabs",
    "autorun": False,
    "elevenlabs_api_key": os.getenv("ELEVENLABS_API_KEY", ""),
    "elevenlabs_api_keys": [key.strip() for key in os.getenv("ELEVENLABS_API_KEYS", "").split(",") if key.strip()],
    "elevenlabs_voice_id": "pNInz6obpgq54HWK483c"
}

try:
    import winreg
except ImportError:
    winreg = None

def set_autorun(enable: bool):
    try:
        key_path = r"Software\Microsoft\Windows\CurrentVersion\Run"
        app_name = "ShadowAnalyst"
        if getattr(sys, 'frozen', False):
            exe_path = sys.executable
        else:
            exe_path = f'"{sys.executable}" "{os.path.abspath(__file__)}"'
            
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path, 0, winreg.KEY_ALL_ACCESS) as key:
            if enable:
                winreg.SetValueEx(key, app_name, 0, winreg.REG_SZ, exe_path)
            else:
                try:
                    winreg.DeleteValue(key, app_name)
                except FileNotFoundError:
                    pass
    except Exception as e:
        print(f"Autorun error: {e}")

def save_config(cfg):
    try:
        tmp_file = CONFIG_FILE + ".tmp"
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=4, ensure_ascii=False)
        os.replace(tmp_file, CONFIG_FILE)
    except Exception as e:
        print(f"Error saving config atomically: {e}")

if not os.path.exists(CONFIG_FILE):
    save_config(DEFAULT_CONFIG)
    config = DEFAULT_CONFIG.copy()
else:
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        config = json.load(f)

# Merge environment keys if present in env but not in config
def merge_unique_keys(config_keys, env_keys):
    res = list(config_keys)
    for k in env_keys:
        if k not in res:
            res.append(k)
    return res

env_groq = [key.strip() for key in os.getenv("GROQ_API_KEYS", "").split(",") if key.strip()]
config["groq_api_keys"] = merge_unique_keys(config.get("groq_api_keys", []), env_groq)

env_google = [key.strip() for key in os.getenv("GOOGLE_API_KEYS", "").split(",") if key.strip()]
config["google_api_keys"] = merge_unique_keys(config.get("google_api_keys", []), env_google)

# Save merged config back to CONFIG_FILE (ignored in git)
save_config(config)

WATCH_DIR = config.get("watch_dir", DEFAULT_CONFIG["watch_dir"])
GROQ_API_KEYS = config.get("groq_api_keys", DEFAULT_CONFIG["groq_api_keys"])
GROQ_VISION_MODEL = config.get("groq_vision_model", DEFAULT_CONFIG["groq_vision_model"])
GOOGLE_API_KEYS = config.get("google_api_keys", DEFAULT_CONFIG.get("google_api_keys", []))
GEMINI_VISION_MODEL = config.get("gemini_vision_model", DEFAULT_CONFIG.get("gemini_vision_model", "gemini-3.5-flash"))
USE_GEMINI = config.get("use_gemini", DEFAULT_CONFIG.get("use_gemini", True))

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
    "processing_image": None,
    "error_message": "",
    "queue_length": 0,
    "latest_image": "",
    "latest_ai_image": "",
    "latest_report": "",
    "latest_summary": "",
    "auto_analyze": config.get("auto_analyze", DEFAULT_CONFIG["auto_analyze"]),
    "auto_enhance": config.get("auto_enhance", DEFAULT_CONFIG["auto_enhance"]),
    "theme": config.get("theme", DEFAULT_CONFIG["theme"]),
    "watch_dir": WATCH_DIR,
    "tts_voice": config.get("tts_voice", DEFAULT_CONFIG["tts_voice"]),
    "model_tier": config.get("model_tier", DEFAULT_CONFIG.get("model_tier", 2)),
    "comparison_slider": config.get("comparison_slider", DEFAULT_CONFIG.get("comparison_slider", True)),
    "tts_provider": config.get("tts_provider", DEFAULT_CONFIG.get("tts_provider", "edge")),
    "elevenlabs_api_key": config.get("elevenlabs_api_key", DEFAULT_CONFIG.get("elevenlabs_api_key", "")),
    "elevenlabs_api_keys": config.get("elevenlabs_api_keys", DEFAULT_CONFIG.get("elevenlabs_api_keys", [])),
    "elevenlabs_voice_id": config.get("elevenlabs_voice_id", DEFAULT_CONFIG.get("elevenlabs_voice_id", "pNInz6obpgq54HWK483c")),
    "google_api_keys": config.get("google_api_keys", DEFAULT_CONFIG.get("google_api_keys", [])),
    "groq_api_keys": config.get("groq_api_keys", DEFAULT_CONFIG.get("groq_api_keys", [])),
    "current_scan_id": None,
    "recent_scans": []
}


# Watchdog reference to restart
observer_ref = None

def restart_watchdog(new_dir):
    global observer_ref, WATCH_DIR
    if new_dir == WATCH_DIR:
        return
    print(f"Restarting Watchdog on new folder: {new_dir}")
    try:
        if observer_ref:
            observer_ref.stop()
            observer_ref.join()
        WATCH_DIR = new_dir
        os.makedirs(WATCH_DIR, exist_ok=True)
        config["watch_dir"] = new_dir
        save_config(config)
        observer_ref = start_watchdog()
        app_state["watch_dir"] = new_dir
    except Exception as e:
        print(f"Error restarting watchdog: {e}")

def run_cv2_enhancement(src_path, dest_path):
    try:
        import cv2
        import numpy as np
        
        file_bytes = np.fromfile(src_path, dtype=np.uint8)
        if len(file_bytes) == 0:
            print("File is empty or could not be read.")
            return False
            
        img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)
        if img is None:
            print("Failed to decode image. Corrupted or unsupported format.")
            return False
            
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(img)
        gaussian = cv2.GaussianBlur(enhanced, (0, 0), 3.0)
        sharpened = cv2.addWeighted(enhanced, 1.4, gaussian, -0.4, 0)
        
        ext = os.path.splitext(dest_path)[1] or '.jpg'
        is_success, im_buf_arr = cv2.imencode(ext, sharpened)
        if is_success:
            im_buf_arr.tofile(dest_path)
        else:
            print("Failed to encode image.")
            return False
        
        # Free memory explicitly
        del img, enhanced, gaussian, sharpened, file_bytes, im_buf_arr
        import gc
        gc.collect()
        
        return True
    except Exception as e:
        print(f"OpenCV enhancement error: {e}")
        return False

api = FastAPI()
api.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@api.get("/", response_class=HTMLResponse)
def get_ui():
    with open(os.path.join(TEMPLATES_DIR, "index.html"), "r", encoding="utf-8") as f:
        return f.read()

@api.get("/api/status")
def get_status():
    return app_state

@api.get("/api/logs")
def get_logs():
    return {"logs": list(log_buffer)}

@api.post("/api/clear_error")
def clear_error():
    app_state["error_message"] = None
    return {"status": "ok"}

@api.post("/api/active_scan")
def set_active_scan(data: dict):
    app_state["latest_image"] = data.get("original_image", "")
    app_state["latest_report"] = data.get("report", "")
    app_state["latest_summary"] = data.get("summary", "")
    app_state["current_scan_id"] = data.get("id")
    return {"status": "ok"}

@api.post("/api/settings")
def update_settings(settings: dict):
    global GOOGLE_API_KEYS, GROQ_API_KEYS
    updated = False

    simple_keys = [
        "auto_analyze", "auto_enhance", "theme", "enable_ai_vision",
        "tts_voice", "model_tier", "comparison_slider", "tts_provider",
        "elevenlabs_api_key", "elevenlabs_api_keys", "elevenlabs_voice_id"
    ]
    for key in simple_keys:
        if key in settings:
            app_state[key] = settings[key]
            config[key] = settings[key]
            updated = True

    if "google_api_keys" in settings:
        app_state["google_api_keys"] = settings["google_api_keys"]
        config["google_api_keys"] = settings["google_api_keys"]
        GOOGLE_API_KEYS = settings["google_api_keys"]
        updated = True
    if "groq_api_keys" in settings:
        app_state["groq_api_keys"] = settings["groq_api_keys"]
        config["groq_api_keys"] = settings["groq_api_keys"]
        GROQ_API_KEYS = settings["groq_api_keys"]
        updated = True
    if "autorun" in settings:
        app_state["autorun"] = settings["autorun"]
        config["autorun"] = settings["autorun"]
        set_autorun(settings["autorun"])
        updated = True
        
    if "watch_dir" in settings and settings["watch_dir"] and settings["watch_dir"] != WATCH_DIR:
        restart_watchdog(settings["watch_dir"])
    elif updated:
        save_config(config)
    return {"status": "ok"}

@api.get("/api/tts")
async def get_tts(text: str, provider: str = None):
    import urllib.parse
    import hashlib
    from fastapi.responses import Response
    from fastapi import HTTPException
    import httpx
    
    if not provider:
        provider = app_state.get("tts_provider", "edge")

    # Local audio cache check
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    cache_filename = f"audio_{text_hash}.mp3"
    cache_path = os.path.join(STATIC_DIR, "uploads", cache_filename)
    
    if os.path.exists(cache_path):
        try:
            def _read_cache():
                with open(cache_path, "rb") as f:
                    return f.read()
            content = await asyncio.to_thread(_read_cache)
            return Response(content=content, media_type="audio/mpeg")
        except Exception as e:
            print(f"Error reading audio cache: {e}")

    audio_bytes = None
        
    if provider == "elevenlabs":
        keys = config.get("elevenlabs_api_keys", [])
        if not keys:
            single_key = config.get("elevenlabs_api_key") or app_state.get("elevenlabs_api_key")
            keys = [single_key] if single_key else []
            
        voice_id = config.get("elevenlabs_voice_id") or app_state.get("elevenlabs_voice_id") or "pNInz6obpgq54HWK483c"
        
        for api_key in keys:
            if not api_key:
                continue
            try:
                url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
                headers = {
                    "xi-api-key": api_key,
                    "Content-Type": "application/json"
                }
                data = {
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.75
                    }
                }
                
                proxy = SOCKS_PROXY if _tunnel_active else None
                async with httpx.AsyncClient(proxy=proxy) as client:
                    r = await client.post(url, json=data, headers=headers, timeout=20.0)

                if r.status_code == 200:
                    audio_bytes = r.content
                    break
                else:
                    print(f"ElevenLabs API failed with key {api_key[:8]}... (status={r.status_code}): {r.text}")
            except Exception as e:
                print(f"ElevenLabs TTS synthesis failed with key {api_key[:8]}...: {e}")
                
    if not audio_bytes:
        # Fallback to Edge-TTS
        voice = app_state.get("tts_voice", "ru-RU-DmitryNeural")
        try:
            import edge_tts
            communicate = edge_tts.Communicate(text, voice)
            audio_data = b""
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]
            if audio_data:
                audio_bytes = audio_data
        except Exception as e:
            print(f"Edge-TTS failed, falling back to Google: {e}")
            
    if not audio_bytes:
        url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q={urllib.parse.quote(text)}"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        try:
            async with httpx.AsyncClient() as client:
                r = await client.get(url, headers=headers, timeout=10.0)
            if r.status_code == 200:
                audio_bytes = r.content
        except Exception as e:
            print(f"Backend TTS error: {e}")
            
    if audio_bytes:
        try:
            with open(cache_path, "wb") as f:
                f.write(audio_bytes)
        except Exception as e:
            print(f"Failed to write audio cache: {e}")
        return Response(content=audio_bytes, media_type="audio/mpeg")

    raise HTTPException(status_code=400, detail="TTS failed")


@api.post("/api/history")
def save_history_record(data: dict):
    try:
        # Generate audio cache link if summary exists
        summary = data.get("summary", "")
        if summary:
            import hashlib
            text_hash = hashlib.md5(summary.encode('utf-8')).hexdigest()
            data["audio_url"] = f"/static/uploads/audio_{text_hash}.mp3"
        
        scan_id = data.get("id")
        if scan_id:
            database.update_scan(scan_id, data)
            app_state["current_scan_id"] = scan_id
            return {"status": "ok", "id": scan_id, "audio_url": data.get("audio_url", "")}
        else:
            scan_id = database.save_scan(data)
            app_state["current_scan_id"] = scan_id
            return {"status": "ok", "id": scan_id, "audio_url": data.get("audio_url", "")}
    except Exception as e:
        print(f"Error saving scan: {e}")
        return {"status": "error", "message": str(e)}


@api.get("/api/history")
def get_history_list():
    try:
        return database.get_all_scans()
    except Exception as e:
        print(f"Error getting history list: {e}")
        return []


@api.delete("/api/history/{scan_id}")
def delete_history_record(scan_id: int):
    try:
        database.delete_scan(scan_id)
        return {"status": "ok"}
    except Exception as e:
        print(f"Error deleting scan {scan_id}: {e}")
        return {"status": "error", "message": str(e)}


@api.post("/api/enhance")
def toggle_enhance(data: dict):
    filename = data.get("filename")
    enable = data.get("enable", False)
    if not filename:
        return {"error": "No filename provided"}
    filename = os.path.basename(filename).split('?')[0]
    
    if enable:
        if "_enhanced" in filename:
            return {"status": "ok", "url": f"/static/uploads/{filename}"}
        orig_path = os.path.join(STATIC_DIR, "uploads", filename)
        if not os.path.exists(orig_path):
            orig_path = os.path.join(WATCH_DIR, filename)
        if not os.path.exists(orig_path):
            return {"error": "Original file not found"}
        base, ext = os.path.splitext(filename)
        enhanced_filename = f"{base}_enhanced{ext}"
        enhanced_path = os.path.join(STATIC_DIR, "uploads", enhanced_filename)
        if not os.path.exists(enhanced_path):
            if not run_cv2_enhancement(orig_path, enhanced_path):
                return {"error": "Enhancement failed"}
        app_state["latest_image"] = f"/static/uploads/{enhanced_filename}"
        return {"status": "ok", "url": f"/static/uploads/{enhanced_filename}"}
    else:
        if "_enhanced" in filename:
            orig_filename = filename.replace("_enhanced", "")
            orig_path = os.path.join(STATIC_DIR, "uploads", orig_filename)
            if os.path.exists(orig_path):
                app_state["latest_image"] = f"/static/uploads/{orig_filename}"
                return {"status": "ok", "url": f"/static/uploads/{orig_filename}"}
        return {"status": "ok", "url": app_state["latest_image"]}

@api.post("/api/analyze")
def trigger_analysis():
    image_url = app_state.get("latest_image")
    if not image_url:
        return {"error": "No image loaded to analyze"}
    filename = os.path.basename(image_url).split('?')[0]
    app_state["is_processing"] = True
    app_state["processing_image"] = f"/static/uploads/{filename}"
    threading.Thread(target=process_analysis_only, args=(filename,), daemon=True).start()
    return {"status": "processing"}

@api.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    save_path = os.path.join(WATCH_DIR, file.filename)
    async with aiofiles.open(save_path, "wb") as f:
        while chunk := await file.read(1024 * 1024): # Read in 1MB chunks
            await f.write(chunk)
    return {"status": "ok", "filename": file.filename}

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
            max_size = 600
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=80, optimize=True)
            img_bytes = buffer.getvalue()
            return f"data:image/jpeg;base64,{base64.b64encode(img_bytes).decode('utf-8')}"
    except Exception as e:
        print(f"Image error: {e}")
        return None



def _load_prompt(filename, default_text):
    import os
    paths = [
        os.path.join(EXE_DIR, filename),
        os.path.join(os.path.dirname(EXE_DIR), filename),
        os.path.join(BASE_DIR, filename),
        os.path.join(os.path.dirname(BASE_DIR), filename),
    ]
    for path in paths:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return f.read()
            except Exception:
                pass
    return default_text

def _get_models_for_tier(model_tier):
    if model_tier == 5:
        return [
            ("gemini-3.5-flash", "gemini"),
            ("gemini-3-flash-preview", "gemini"),
            ("qwen/qwen3.6-27b", "groq"),
            (GROQ_VISION_MODEL, "groq")
        ]
    elif model_tier == 4:
        return [
            ("gemini-3-flash-preview", "gemini"),
            ("qwen/qwen3.6-27b", "groq"),
            (GROQ_VISION_MODEL, "groq")
        ]
    elif model_tier == 3:
        return [
            ("qwen/qwen3.6-27b", "groq"),
            ("gemini-3-flash-preview", "gemini"),
            ("gemini-3.5-flash", "gemini"),
            (GROQ_VISION_MODEL, "groq")
        ]
    elif model_tier == 2:
        return [
            ("qwen/qwen3.6-27b", "groq"),
            ("gemini-3-flash-preview", "gemini"),
            (GROQ_VISION_MODEL, "groq")
        ]
    else:  # model_tier == 1
        return [
            ("gemini-3-flash-preview", "gemini"),
            (GROQ_VISION_MODEL, "groq")
        ]

def _execute_ai_cascade(models, prompt, image_b64, min_len, pass_name, extra_messages=None):
    import random
    import re

    output_text = ""
    success_idx = 0
    last_err = "No keys available"

    if extra_messages is None:
        extra_messages = []

    for idx, (model_name, provider) in enumerate(models):
        if provider == "gemini":
            keys = GOOGLE_API_KEYS.copy()
            chat_func = gemini_chat
        else:
            keys = GROQ_API_KEYS.copy()
            chat_func = groq_chat

        if not keys:
            print(f"Skipping model {model_name} ({provider}) - no API keys configured.")
            continue

        random.shuffle(keys)
        success = False

        for api_key in keys:
            try:
                content = [{"type": "text", "text": prompt}] + extra_messages + [{"type": "image_url", "image_url": {"url": image_b64}}]
                response = chat_func(
                    api_key=api_key,
                    model=model_name,
                    messages=[
                        {
                            "role": "user",
                            "content": content
                        }
                    ]
                )
                if response.choices and len(response.choices) > 0:
                    val = response.choices[0].message.content
                    if val:
                        val_cleaned = re.sub(r"(?i)<think>.*?(?:</think>|$)", "", val, flags=re.DOTALL).strip()
                        if len(val_cleaned) >= min_len:
                            output_text = val_cleaned
                            success_idx = idx
                            success = True
                            print(f"[{pass_name}] Success with model {model_name} ({len(val_cleaned)} chars)")
                            break
                        else:
                            print(f"[{pass_name}] Model {model_name} returned cut-off or too short response ({len(val_cleaned)} chars). Trying next model.")
                    else:
                        print(f"Key {api_key[:10]}... returned empty content for model {model_name}.")
            except Exception as e:
                print(f"Error using key {api_key[:10]}... with model {model_name} ({provider}): {e}")
                last_err = e
                err_str = str(e).lower()
                if "429" in err_str or "rate_limit" in err_str or "rate limit" in err_str:
                    print(f"[{pass_name}] Rate limit (429) hit for model {model_name} with key {api_key[:10]}... trying next key.")
                    continue
                continue
        if success:
            break

    return output_text, success_idx, last_err

def _parse_final_output(final_output, first_report):
    import re
    summary_match = re.search(r"<summary>(.*?)</summary>", final_output, re.DOTALL | re.IGNORECASE)
    report_match = re.search(r"<report>(.*?)</report>", final_output, re.DOTALL | re.IGNORECASE)

    if not summary_match and not report_match:
        cleaned = final_output.strip()
        sentences = re.split(r'(?<=[.!?])\s+', cleaned)
        if len(sentences) >= 2:
            summary_text = " ".join(sentences[:2])
            report_text = " ".join(sentences[2:])
        else:
            summary_text = cleaned
            report_text = cleaned
    else:
        summary_text = summary_match.group(1).strip() if summary_match else "Снимок проанализирован ИИ-ассистентом."
        report_text = report_match.group(1).strip() if report_match else first_report

    cjk_pattern = re.compile(r'[\u4e00-\u9fff]+')
    summary_text = cjk_pattern.sub('', summary_text)
    report_text = cjk_pattern.sub('', report_text)

    summary_text = re.sub(r'^[#*\s\-\d.]+|[#*\s\-\d.]+$', '', summary_text).strip()

    return report_text, summary_text

def run_ai_analysis(file_path, patient_info=None):
    image_b64 = prepare_image(file_path)
    if not image_b64:
        return "Ошибка обработки картинки.", "Снимок не обработан."

    if not check_internet_connection(timeout=1.5):
        return "Сбой сети: Отсутствует подключение к интернету. Проверьте кабель или Wi-Fi.", "Сбой анализа."

    system_prompt = _load_prompt("dentalimage.md", "Опиши снимок зубов.")
    model_tier = config.get("model_tier", 2)
    models_with_providers = _get_models_for_tier(model_tier)

    first_report, first_model_idx, last_err = _execute_ai_cascade(
        models=models_with_providers,
        prompt=system_prompt,
        image_b64=image_b64,
        min_len=80,
        pass_name="AI Pass 1"
    )

    if not first_report or "Сбой" in first_report:
        return first_report or f"Сбой: все ключи и модели исчерпаны. Последняя ошибка: {last_err}", "Сбой анализа."

    default_critic = (
        "Ты — главный рентгенолог-редактор. Проверь черновой отчёт по снимку, исправь ошибки, "
        "удали иероглифы, улучши стиль. Ответ строго в тегах:\n"
        "<summary>[3+ предложения: тип снимка, ключевые находки, главный вывод и рекомендация]</summary>\n"
        "<report>[Полный отчёт Markdown]</report>"
    )
    critic_prompt = _load_prompt("dentalimage_critic.md", default_critic)

    if model_tier == 3:
        critic_models = [
            ("qwen/qwen3.6-27b", "groq"),
            (GROQ_VISION_MODEL, "groq")
        ]
    else:
        critic_models = models_with_providers[first_model_idx + 1:] + models_with_providers[:first_model_idx + 1]

    print(f"[AI Pass 2] Critic cascade: {[m[0] for m in critic_models]}")

    extra_messages = [{"type": "text", "text": f"Вот первоначальный отчет, который тебе нужно проверить и улучшить:\n\n{first_report}"}]

    final_output, _, _ = _execute_ai_cascade(
        models=critic_models,
        prompt=critic_prompt,
        image_b64=image_b64,
        min_len=100,
        pass_name="AI Pass 2",
        extra_messages=extra_messages
    )

    if not final_output:
        return first_report, "Анализ снимка выполнен. Резюме недоступно."

    return _parse_final_output(final_output, first_report)

def send_to_mqtt(image_path, report_text, filename, patient_name=None):
    import paho.mqtt.client as mqtt
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
        if MQTT_USER:
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
    stable_ticks = 0
    while time.time() - start_time < timeout:
        try:
            current_size = os.path.getsize(file_path)
            if current_size == last_size and current_size > 0:
                stable_ticks += 1
                if stable_ticks >= 3:
                    # Попробуем открыть для проверки доступности
                    with open(file_path, 'rb') as f:
                        pass
                    return True
            else:
                stable_ticks = 0
            last_size = current_size
        except OSError:
            stable_ticks = 0
            pass
        time.sleep(0.5)
    return False

def detect_gender_ru(name: str) -> str:
    words = name.lower().split()
    if not words:
        return "Не указан"
        
    points_m = 0
    points_f = 0
    
    male_names = ['никита', 'илья', 'данила', 'даниил', 'савва', 'миша', 'гриша', 'саша', 'петя', 'ваня', 'дима', 'леша', 'коля', 'юра', 'вова', 'толя', 'женя', 'сережа']
    female_names = ['маша', 'даша', 'лена', 'оля', 'света', 'наташа', 'катя', 'ира', 'таня', 'аня', 'юля', 'вера', 'надя', 'люба']
    
    for word in words:
        if word.endswith(('ович', 'евич', 'ич')):
            points_m += 5
        elif word.endswith(('овна', 'евна', 'ична')):
            points_f += 5
        elif word.endswith(('ова', 'ева', 'ина', 'ая')):
            points_f += 3
        elif word.endswith(('ов', 'ев', 'ин', 'ий', 'ый')):
            points_m += 3
        elif word in male_names:
            points_m += 4
        elif word in female_names:
            points_f += 4
        else:
            last = word[-1:]
            if last in ['а', 'я']:
                points_f += 1.5
            elif last in ['б', 'в', 'г', 'д', 'ж', 'з', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'й']:
                points_m += 1.5
                
    if points_m > points_f:
        return "Мужской"
    elif points_f > points_m:
        return "Женский"
    return "Не указан"

def parse_patient_from_filename(filename: str) -> dict:
    base = os.path.splitext(filename)[0]
    # Replace separators with spaces
    parts = re.split(r'[_\-\s]+', base)
    
    patient_name = ""
    patient_age = None
    patient_gender = "Не указан"
    
    name_parts = []
    
    for part in parts:
        part_clean = part.strip()
        if not part_clean:
            continue
            
        # Age
        if part_clean.isdigit():
            val = int(part_clean)
            if 0 < val < 120:
                patient_age = val
            continue
            
        # Gender
        part_upper = part_clean.upper()
        if part_upper in ['M', 'М', 'MALE', 'МУЖ']:
            patient_gender = "Мужской"
            continue
        elif part_upper in ['F', 'Ж', 'FEMALE', 'ЖЕН']:
            patient_gender = "Женский"
            continue
            
        # Name
        if part_clean.isalpha():
            name_parts.append(part_clean.capitalize())
            
    if len(name_parts) >= 2:
        p1, p2 = name_parts[0], name_parts[1]
        p1_lower = p1.lower()
        if p1_lower.endswith(('ов', 'ев', 'ин', 'ова', 'ева', 'ина', 'их', 'ых', 'ский', 'ская')):
            patient_name = f"{p2} {p1}"
        else:
            patient_name = f"{p1} {p2}"
    elif len(name_parts) == 1:
        patient_name = name_parts[0]
        
    if patient_gender == "Не указан" and patient_name:
        patient_gender = detect_gender_ru(patient_name)
        
    return {
        "patient_name": patient_name,
        "patient_age": patient_age,
        "patient_gender": patient_gender
    }

def parse_patient_from_file(file_path: str) -> dict:
    filename = os.path.basename(file_path)
    info = parse_patient_from_filename(filename)
    
    if file_path.lower().endswith('.dcm'):
        try:
            import pydicom
            import datetime
            import re
            ds = pydicom.dcmread(file_path, stop_before_pixels=True)
            dcm_name = str(getattr(ds, 'PatientName', '')).replace('^', ' ').strip()
            if dcm_name:
                info['patient_name'] = dcm_name
            dcm_gender = str(getattr(ds, 'PatientSex', '')).upper()
            if dcm_gender == 'M':
                info['patient_gender'] = 'Мужской'
            elif dcm_gender == 'F':
                info['patient_gender'] = 'Женский'
            dcm_age_raw = str(getattr(ds, 'PatientAge', ''))
            dcm_age = None
            if dcm_age_raw:
                match = re.match(r'(\d+)([YMD])', dcm_age_raw)
                if match:
                    val = int(match.group(1))
                    unit = match.group(2)
                    if unit == 'Y':
                        dcm_age = val
                    else:
                        dcm_age = 0
            if dcm_age is not None:
                info['patient_age'] = dcm_age
            else:
                dcm_birth = str(getattr(ds, 'PatientBirthDate', ''))
                if dcm_birth and len(dcm_birth) >= 4:
                    try:
                        birth_year = int(dcm_birth[:4])
                        current_year = datetime.datetime.now().year
                        info['patient_age'] = current_year - birth_year
                    except Exception:
                        pass
        except Exception as e:
            print(f"Error reading DICOM patient info: {e}")
            
    try:
        base_path = os.path.splitext(file_path)[0]
        for ext in ['.xml', '.ini', '.txt', '.json']:
            sidecar = base_path + ext
            if os.path.exists(sidecar):
                with open(sidecar, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                if ext == '.xml':
                    import xml.etree.ElementTree as ET
                    try:
                        root = ET.fromstring(content)
                        for elem in root.iter():
                            tag_lower = elem.tag.lower()
                            if 'name' in tag_lower or 'patient' in tag_lower:
                                if elem.text:
                                    info['patient_name'] = elem.text.strip()
                            elif 'age' in tag_lower:
                                if elem.text and elem.text.isdigit():
                                    info['patient_age'] = int(elem.text)
                            elif 'gender' in tag_lower or 'sex' in tag_lower:
                                if elem.text:
                                    g = elem.text.strip().lower()
                                    if g in ['m', 'male', 'муж', 'мужской']:
                                        info['patient_gender'] = 'Мужской'
                                    elif g in ['f', 'female', 'жен', 'женский']:
                                        info['patient_gender'] = 'Женский'
                    except Exception:
                        pass
                elif ext in ['.ini', '.txt']:
                    for line in content.splitlines():
                        if '=' in line:
                            parts = line.split('=', 1)
                            key = parts[0].strip().lower()
                            val = parts[1].strip()
                            if key in ['name', 'patient', 'patientname', 'fio', 'фио']:
                                info['patient_name'] = val
                            elif key in ['age', 'years', 'возраст']:
                                if val.isdigit():
                                    info['patient_age'] = int(val)
                            elif key in ['gender', 'sex', 'пол']:
                                if val.lower() in ['m', 'male', 'муж', 'мужской']:
                                    info['patient_gender'] = 'Мужской'
                                elif val.lower() in ['f', 'female', 'жен', 'женский']:
                                    info['patient_gender'] = 'Женский'
                elif ext == '.json':
                    try:
                        data = json.loads(content)
                        def check_dict(d):
                            for k, v in d.items():
                                k_lower = k.lower()
                                if k_lower in ['name', 'patient', 'patientname', 'fio', 'фио']:
                                    info['patient_name'] = str(v)
                                elif k_lower in ['age', 'years', 'возраст']:
                                    if str(v).isdigit():
                                        info['patient_age'] = int(v)
                                elif k_lower in ['gender', 'sex', 'пол']:
                                    if str(v).lower() in ['m', 'male', 'муж', 'мужской']:
                                        info['patient_gender'] = 'Мужской'
                                    elif str(v).lower() in ['f', 'female', 'жен', 'женский']:
                                        info['patient_gender'] = 'Женский'
                                elif isinstance(v, dict):
                                    check_dict(v)
                        check_dict(data)
                    except Exception:
                        pass
                break
    except Exception as se:
        print(f"Error checking sidecars: {se}")
        
    return info

def process_analysis_only(filename):
    app_state["is_processing"] = True
    app_state["processing_image"] = f"/static/uploads/{filename}"
    app_state["latest_report"] = ""
    app_state["latest_summary"] = ""
    
    orig_name = filename
    if filename.endswith('.jpg'):
        dcm_name = filename[:-4]
        dcm_path = os.path.join(WATCH_DIR, dcm_name)
        if os.path.exists(dcm_path):
            file_path = dcm_path
        else:
            file_path = os.path.join(STATIC_DIR, "uploads", filename)
    else:
        file_path = os.path.join(WATCH_DIR, filename)
        if not os.path.exists(file_path):
            file_path = os.path.join(STATIC_DIR, "uploads", filename)

    if not os.path.exists(file_path):
        app_state["latest_report"] = "Снимок не найден на диске для анализа."
        app_state["is_processing"] = False
        app_state["processing_image"] = None
        return

    patient_info = None

    base_name, ext = os.path.splitext(orig_name)
    enhanced_file_path = os.path.join(STATIC_DIR, "uploads", f"{base_name}_enhanced{ext}")
    if os.path.exists(enhanced_file_path):
        analysis_path = enhanced_file_path
    else:
        analysis_path = file_path

    report, summary = run_ai_analysis(analysis_path, patient_info)

    if summary == "Сбой анализа." or "Сбой:" in report:
        app_state["error_message"] = report

    pat_name = "Не указан"
    threading.Thread(target=send_to_mqtt, args=(file_path, report, orig_name, pat_name), daemon=True).start()

    # Automatically save scan into SQLite database
    ext = os.path.splitext(orig_name)[1]
    db_payload = {
        "patient_name": "Не указан",
        "patient_age": None,
        "patient_gender": "Не указан",
        "original_image": f"/static/uploads/{orig_name}",
        "enhanced_image": f"/static/uploads/{orig_name.replace(ext, '_enhanced' + ext)}",
        "ai_image": "",
        "brightness": 100,
        "contrast": 100,
        "inverted": False,
        "scale": 1.0,
        "translate_x": 0.0,
        "translate_y": 0.0,
        "slider_position": 50.0,
        "summary": summary,
        "report": report
    }
    
    if summary:
        import hashlib
        text_hash = hashlib.md5(summary.encode('utf-8')).hexdigest()
        db_payload["audio_url"] = f"/static/uploads/audio_{text_hash}.mp3"

    try:
        scan_id = database.save_scan(db_payload)
        app_state["current_scan_id"] = scan_id
        print(f"[DB] Automatically saved scan {orig_name} with ID {scan_id}")
    except Exception as dbe:
        print(f"[DB] Error auto-saving scan: {dbe}")

    app_state["latest_report"] = report
    app_state["latest_summary"] = summary
    app_state["latest_ai_image"] = ""
    app_state["is_processing"] = False
    app_state["processing_image"] = None
    
    # Update the item in recent_scans if it exists
    for s in app_state["recent_scans"]:
        if s.get("image") == f"/static/uploads/{orig_name}":
            s["summary"] = summary
            s["report"] = report
            break
            
    print("Analysis complete.")

def process_new_xray(file_path):
    filename = os.path.basename(file_path)
    if filename in processing_files:
        return
    
    processing_files.add(filename)
    app_state["is_processing"] = True
    try:
        print(f"Waiting for file to be ready: {file_path}")
        if not wait_for_file_ready(file_path):
            print(f"Timeout waiting for file {file_path}")
            return
            
        if global_window:
            global_window.restore()
            global_window.show()

        if file_path.lower().endswith('.dcm'):
            img_b64 = prepare_image(file_path)
            if img_b64:
                header, encoded = img_b64.split(",", 1)
                data = base64.b64decode(encoded)
                filename = filename + ".jpg"
                static_img_path = os.path.join(STATIC_DIR, "uploads", filename)
                with open(static_img_path, "wb") as f:
                    f.write(data)
            else:
                static_img_path = os.path.join(STATIC_DIR, "uploads", filename)
                shutil.copy2(file_path, static_img_path)
        else:
            static_img_path = os.path.join(STATIC_DIR, "uploads", filename)
            shutil.copy2(file_path, static_img_path)

        app_state["processing_image"] = f"/static/uploads/{filename}"

        # Always pre-generate CLAHE enhanced version so it's ready for instant comparison slider
        base, ext = os.path.splitext(filename)
        enhanced_filename = f"{base}_enhanced{ext}"
        enhanced_path = os.path.join(STATIC_DIR, "uploads", enhanced_filename)
        if not run_cv2_enhancement(static_img_path, enhanced_path):
            app_state["error_message"] = f"Не удалось прочитать или улучшить изображение: {filename}"
            app_state["is_processing"] = False
            app_state["processing_image"] = None
            return

        app_state["latest_image"] = f"/static/uploads/{filename}"
        app_state["latest_ai_image"] = ""
        app_state["latest_report"] = ""
        app_state["latest_summary"] = ""
        app_state["current_scan_id"] = None
        
        # Add to recent scans queue
        app_state["recent_scans"].append({
            "id": int(time.time() * 1000),
            "image": f"/static/uploads/{filename}",
            "original_filename": filename,
            "timestamp": time.time(),
            "summary": "",
            "report": ""
        })
        # Keep only the last 10
        if len(app_state["recent_scans"]) > 10:
            app_state["recent_scans"].pop(0)

        if app_state["auto_analyze"]:
            print("Auto-triggering AI analysis...")
            threading.Thread(target=process_analysis_only, args=(filename,), daemon=True).start()
        else:
            app_state["is_processing"] = False
            app_state["processing_image"] = None
            print("Auto-analyze disabled. Waiting for manual trigger.")
            
    finally:
        threading.Timer(10.0, lambda: processing_files.discard(filename)).start()

import queue
file_queue = queue.Queue()

def queue_worker():
    while True:
        try:
            app_state["queue_length"] = file_queue.qsize()
            file_path = file_queue.get()
            if file_path is None:
                break
            # Processing might take time, let UI know we started
            app_state["queue_length"] = file_queue.qsize()
            process_new_xray(file_path)
        except Exception as e:
            print(f"Queue worker error: {e}")
        finally:
            file_queue.task_done()
            app_state["queue_length"] = file_queue.qsize()

threading.Thread(target=queue_worker, daemon=True).start()

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
            
        # Bring window to front
        try:
            if 'global_window' in globals() and global_window:
                global_window.restore()
                global_window.show()
        except Exception:
            pass
        
        # Add to queue instead of spinning up parallel threads
        file_queue.put(event.src_path)
        app_state["queue_length"] = file_queue.qsize()

def auto_detect_dental_paths() -> list:
    detected = []
    candidates = [
        # XVSensor / XspectVision
        r"C:\Program Files (x86)\XspectVision\XVSensor\Image",
        r"C:\Program Files\XspectVision\XVSensor\Image",
        r"C:\XspectVision\XVSensor\Image",
        r"C:\Program Files (x86)\XspectVision\Image",
        r"C:\Program Files\XspectVision\Image",
        r"C:\XspectVision\Image",
        r"C:\Program Files (x86)\XVSensor\Image",
        r"C:\XVSensor\Image",
        
        # Romexis
        r"C:\romexis_images",
        
        # EZDent-i (Vatech)
        r"C:\Program Files (x86)\VATECH\Common\FM\FMdata",
        r"C:\VATECH\Common\FM\FMdata",
        
        # VixWin
        r"C:\VxImages",
        r"C:\VixWin\VxImages",
        
        # DEXIS
        r"C:\DEXIS\Data\Images",
        r"C:\DEXIS Imaging Suite\Data\Images",
        
        # Sidexis
        r"C:\Sidexis\PDATA",
        r"C:\PDATA",
        r"C:\ProgramData\Sirona\Sidexis\PDATA",
        
        # Carestream / RVG
        r"C:\ProgramData\Carestream\CSImaging\Database",
        
        # Digora / CliniView
        r"C:\CliniView\Images",
        r"C:\Digora\Images",
        
        # Owandy
        r"C:\Owandy\QuickVision\Images"
    ]
    drives = ["C", "D", "E"]
    for drive in drives:
        for c in candidates:
            if not c.startswith("C:"):
                continue
            path = drive + c[1:]
            if os.path.exists(path) and os.path.isdir(path):
                detected.append(path)
    return list(set(detected))

def start_watchdog():
    observer = Observer()
    try:
        observer.schedule(XRayHandler(), WATCH_DIR, recursive=True)
        print(f"[Watchdog] Monitoring primary watch directory: {WATCH_DIR}")
    except Exception as e:
        print(f"[Watchdog] Error scheduling primary watch directory: {e}")
        
    detected_paths = auto_detect_dental_paths()
    for path in detected_paths:
        try:
            observer.schedule(XRayHandler(), path, recursive=True)
            print(f"[Watchdog] Monitoring auto-detected directory (recursive): {path}")
        except Exception as e:
            print(f"[Watchdog] Error scheduling detected path {path}: {e}")
            
    observer.start()
    return observer

import socket
import requests

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def wait_for_server(url, timeout=10):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            r = requests.get(url, timeout=1)
            if r.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(0.5)
    return False

# Main
def start_server():
    try:
        uvicorn.run(api, host="127.0.0.1", port=8085, log_level="error")
    except Exception as e:
        print(f"Uvicorn error: {e}")

if __name__ == '__main__':
    database.init_db()
    
    server_url = "http://127.0.0.1:8085"
    
    if is_port_in_use(8085):
        print("Server is already running on port 8085. Skipping uvicorn startup.")
    else:
        # Start web server
        t = threading.Thread(target=start_server, daemon=True)
        t.start()
        
    # Wait for server to become responsive
    if not wait_for_server(f"{server_url}/api/status"):
        print("Warning: API server did not become responsive in time. UI might fail to load data.")

    # Start watcher
    observer_ref = start_watchdog()

    # Start connection monitoring thread
    threading.Thread(target=check_connection_loop, daemon=True).start()

    # Start PyWebView UI
    print("Starting Desktop App...")
    global_window = webview.create_window(
        'ShadowAnalyst', 
        server_url,
        width=1200, 
        height=800,
        min_size=(800, 600),
        frameless=False,
        background_color='#0a0e17',
        text_select=True
    )
    
    import pystray
    from PIL import Image

    def setup_tray(window):
        def on_show(icon, item):
            window.show()
        
        def on_exit(icon, item):
            icon.stop()
            window.destroy()
            os._exit(0)

        icon_image = Image.new('RGB', (64, 64), color = (10, 14, 23))
        # Use existing image if possible
        try:
            icon_path = os.path.join(STATIC_DIR, "logo.png")
            if os.path.exists(icon_path):
                icon_image = Image.open(icon_path)
        except:
            pass

        menu = pystray.Menu(
            pystray.MenuItem("Открыть", on_show, default=True),
            pystray.MenuItem("Выход", on_exit)
        )
        icon = pystray.Icon("ShadowAnalyst", icon_image, "ShadowAnalyst", menu)
        icon.run()

    def on_closing():
        global_window.hide()
        return False

    global_window.events.closing += on_closing
    threading.Thread(target=setup_tray, args=(global_window,), daemon=True).start()

    webview.start(debug=False, icon='icon.ico')
    
    # Cleanup
    if observer_ref:
        observer_ref.stop()
        observer_ref.join()
    stop_tunnel()
