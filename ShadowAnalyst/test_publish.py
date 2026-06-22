import json
import paho.mqtt.client as mqtt

def test_publish(mocker):
    # Mock the MQTT client
    mock_client = mocker.patch('paho.mqtt.client.Client')
    mock_instance = mock_client.return_value

    MQTT_HOST = "10.77.0.1"
    MQTT_PORT = 1883
    MQTT_USER = "clinic"
    MQTT_PASS = "clinic2024"

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_USER, MQTT_PASS)
    client.connect(MQTT_HOST, MQTT_PORT, 60)

    payload = {
        "file": "Ivanov_XRAY_46.jpg",
        "findings": "Подозрение на глубокий кариес (зуб 4.6) - 92\nРекомендуется детальный осмотр и, возможно, ЭОД."
    }

    client.publish("clinic/xray/result", json.dumps(payload))
    client.disconnect()

    mock_instance.connect.assert_called_once_with(MQTT_HOST, MQTT_PORT, 60)
    mock_instance.publish.assert_called_once()
