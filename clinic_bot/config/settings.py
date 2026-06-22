import os
import json

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
BOT_USERNAME = os.getenv("BOT_USERNAME", "")

# MQTT - сервак по WireGuard (локально пока 127.0.0.1 для разработки)
MQTT_HOST = os.getenv("MQTT_HOST", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_USER = os.getenv("MQTT_USER", "")
MQTT_PASS = os.getenv("MQTT_PASS", "")

# Telegram chat IDs (заполним после /start)
# ADMIN_CHAT_ID   = главврач / владелец
# DOCTORS_CHAT_ID = общий чат врачей (если нужен)
# Оба твоих аккаунта получают все алерты
_admin_chat_ids_str = os.getenv("ADMIN_CHAT_IDS", "[8721416291, 7716348189]")
try:
    ADMIN_CHAT_IDS = json.loads(_admin_chat_ids_str)
except json.JSONDecodeError:
    ADMIN_CHAT_IDS = []

# MQTT Topics
TOPIC_XRAY_RESULT    = "clinic/xray/result"      # результат анализа снимка
TOPIC_ALERT_ADMIN    = "clinic/alerts/admin"      # срочный алерт владельцу
TOPIC_REVIEW_NEG     = "clinic/reviews/negative"  # негативный отзыв
TOPIC_MARKETING_SEND = "clinic/marketing/send"    # задание маркетологу
