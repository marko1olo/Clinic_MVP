import os
import sys

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
if not BOT_TOKEN:
    sys.exit("ERROR: BOT_TOKEN environment variable is not set.")
BOT_USERNAME = os.environ.get("BOT_USERNAME", "dentaliya2_bot")

# MQTT - сервак по WireGuard (локально пока 127.0.0.1 для разработки)
MQTT_HOST = os.environ.get("MQTT_HOST", "62.84.100.97")
MQTT_PORT = int(os.environ.get("MQTT_PORT", "1883"))
MQTT_USER = os.environ.get("MQTT_USER", "")
MQTT_PASS = os.environ.get("MQTT_PASS", "")

# Telegram chat IDs (заполним после /start)
# ADMIN_CHAT_ID   = главврач / владелец
# DOCTORS_CHAT_ID = общий чат врачей (если нужен)
# Оба твоих аккаунта получают все алерты
admin_chat_ids_env = os.environ.get("ADMIN_CHAT_IDS", "")
ADMIN_CHAT_IDS = [int(cid.strip()) for cid in admin_chat_ids_env.split(",") if cid.strip().isdigit()]

# MQTT Topics
TOPIC_XRAY_RESULT    = "clinic/xray/result"      # результат анализа снимка
TOPIC_ALERT_ADMIN    = "clinic/alerts/admin"      # срочный алерт владельцу
TOPIC_REVIEW_NEG     = "clinic/reviews/negative"  # негативный отзыв
TOPIC_MARKETING_SEND = "clinic/marketing/send"    # задание маркетологу
