import os

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN environment variable is required")

BOT_USERNAME = os.environ.get("BOT_USERNAME", "dentaliya2_bot")

# MQTT - сервак по WireGuard (локально пока 127.0.0.1 для разработки)
MQTT_HOST = os.environ.get("MQTT_HOST", "62.84.100.97")
MQTT_PORT = int(os.environ.get("MQTT_PORT", 1883))
MQTT_USER = os.environ.get("MQTT_USER", "clinic")
MQTT_PASS = os.environ.get("MQTT_PASS", "clinic2024")

# Telegram chat IDs (заполним после /start)
# ADMIN_CHAT_ID   = главврач / владелец
# DOCTORS_CHAT_ID = общий чат врачей (если нужен)
# Оба твоих аккаунта получают все алерты
ADMIN_CHAT_IDS = [8721416291, 7716348189]

# MQTT Topics
TOPIC_XRAY_RESULT    = "clinic/xray/result"      # результат анализа снимка
TOPIC_ALERT_ADMIN    = "clinic/alerts/admin"      # срочный алерт владельцу
TOPIC_REVIEW_NEG     = "clinic/reviews/negative"  # негативный отзыв
TOPIC_MARKETING_SEND = "clinic/marketing/send"    # задание маркетологу
