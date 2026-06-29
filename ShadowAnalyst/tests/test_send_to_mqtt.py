import unittest
from unittest.mock import patch, mock_open
import json
import base64
import paho.mqtt.client as mqtt

from gui.app import send_to_mqtt, MQTT_HOST, MQTT_PORT, TOPIC_XRAY_RESULT, MQTT_USER, MQTT_PASS

class TestSendToMqtt(unittest.TestCase):

    @patch('builtins.print')
    @patch('paho.mqtt.client.Client')
    @patch('builtins.open', new_callable=mock_open, read_data=b'test image data')
    def test_send_to_mqtt_happy_path(self, mock_file, mock_mqtt_client, mock_print):
        mock_client_instance = mock_mqtt_client.return_value

        send_to_mqtt("dummy.jpg", "Test report", "dummy.jpg", "John Doe")

        mock_file.assert_called_with("dummy.jpg", "rb")

        mock_mqtt_client.assert_called_once_with(mqtt.CallbackAPIVersion.VERSION2)
        mock_client_instance.connect.assert_called_once_with(MQTT_HOST, MQTT_PORT, 60)

        if MQTT_USER:
            mock_client_instance.username_pw_set.assert_called_once_with(MQTT_USER, MQTT_PASS)

        expected_encoded = base64.b64encode(b'test image data').decode('utf-8')
        expected_payload = {
            "file": "dummy.jpg",
            "report": "Test report",
            "image_b64": expected_encoded,
            "patient_name": "John Doe"
        }

        mock_client_instance.publish.assert_called_once_with(
            TOPIC_XRAY_RESULT,
            json.dumps(expected_payload),
            qos=1
        )
        mock_client_instance.disconnect.assert_called_once()
        mock_print.assert_called_with(f"MQTT: Successfully published dummy.jpg to {TOPIC_XRAY_RESULT}")

    @patch('builtins.print')
    @patch('paho.mqtt.client.Client')
    @patch('builtins.open', new_callable=mock_open, read_data=b'test image data')
    def test_send_to_mqtt_no_patient_name(self, mock_file, mock_mqtt_client, mock_print):
        mock_client_instance = mock_mqtt_client.return_value

        send_to_mqtt("dummy.jpg", "Test report", "dummy.jpg")

        expected_encoded = base64.b64encode(b'test image data').decode('utf-8')
        expected_payload = {
            "file": "dummy.jpg",
            "report": "Test report",
            "image_b64": expected_encoded,
            "patient_name": None
        }

        mock_client_instance.publish.assert_called_once_with(
            TOPIC_XRAY_RESULT,
            json.dumps(expected_payload),
            qos=1
        )

    @patch('builtins.print')
    @patch('paho.mqtt.client.Client')
    @patch('builtins.open', new_callable=mock_open)
    def test_send_to_mqtt_file_error(self, mock_file, mock_mqtt_client, mock_print):
        mock_file.side_effect = IOError("File not found")

        send_to_mqtt("dummy.jpg", "Test report", "dummy.jpg")

        mock_mqtt_client.assert_not_called()
        mock_print.assert_called_with("MQTT Publish error: File not found")

    @patch('builtins.print')
    @patch('paho.mqtt.client.Client')
    @patch('builtins.open', new_callable=mock_open, read_data=b'test image data')
    def test_send_to_mqtt_publish_error(self, mock_file, mock_mqtt_client, mock_print):
        mock_client_instance = mock_mqtt_client.return_value
        mock_client_instance.publish.side_effect = Exception("Publish failed")

        send_to_mqtt("dummy.jpg", "Test report", "dummy.jpg")

        mock_print.assert_called_with("MQTT Publish error: Publish failed")

if __name__ == '__main__':
    unittest.main()
