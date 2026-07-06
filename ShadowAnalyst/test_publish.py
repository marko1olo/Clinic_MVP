import os
import json
import os
import paho.mqtt.client as mqtt

MQTT_HOST = "10.77.0.1"
MQTT_PORT = 1883
MQTT_USER = os.getenv("MQTT_USER", "")
MQTT_PASS = os.getenv("MQTT_PASS", "")
MQTT_HOST = os.environ.get("MQTT_HOST", "10.77.0.1")
MQTT_PORT = int(os.environ.get("MQTT_PORT", 1883))
MQTT_USER = os.environ.get("MQTT_USER", "clinic")
MQTT_PASS = os.environ.get("MQTT_PASS", "")
MQTT_PASS = os.environ.get("MQTT_PASS")
MQTT_USER = os.environ.get("MQTT_USER", "")

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
if MQTT_USER:
    client.username_pw_set(MQTT_USER, MQTT_PASS)
if __name__ == "__main__":
    client.connect(MQTT_HOST, MQTT_PORT, 60)

    payload = {
        "file": "Ivanov_XRAY_46.jpg",
        "findings": "Подозрение на глубокий кариес (зуб 4.6) - 92%\nРекомендуется детальный осмотр и, возможно, ЭОД."
    }

    client.publish("clinic/xray/result", json.dumps(payload))
    print("Test payload sent to clinic/xray/result")
    client.disconnect()
