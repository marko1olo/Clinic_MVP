import unittest
from unittest.mock import patch, MagicMock
import json
import paho.mqtt.client as mqtt
import watcher

class TestWatcherPublishResult(unittest.TestCase):

    @patch('watcher.MQTT_USER', 'test_user')
    @patch('watcher.MQTT_PASS', 'test_pass')
    @patch('watcher.MQTT_HOST', 'localhost')
    @patch('watcher.MQTT_PORT', 1883)
    @patch('watcher.TOPIC_XRAY_RESULT', 'test/topic')
    @patch('watcher.print')
    @patch('paho.mqtt.client.Client')
    def test_publish_result_happy_path(self, mock_mqtt_client_class, mock_print):
        mock_client = MagicMock()
        mock_mqtt_client_class.return_value = mock_client

        filename = "test_image.jpg"
        findings = "No issues found."

        watcher.publish_result(filename, findings)

        mock_mqtt_client_class.assert_called_once_with(mqtt.CallbackAPIVersion.VERSION2)
        mock_client.username_pw_set.assert_called_once_with('test_user', 'test_pass')
        mock_client.connect.assert_called_once_with('localhost', 1883, 5)

        expected_payload = {
            "file": filename,
            "findings": findings
        }
        mock_client.publish.assert_called_once_with('test/topic', json.dumps(expected_payload, ensure_ascii=False))
        mock_client.disconnect.assert_called_once()
        mock_print.assert_called_with(f"-> Опубликовано в MQTT: {filename}")

    @patch('watcher.MQTT_USER', '')
    @patch('watcher.MQTT_HOST', 'localhost')
    @patch('watcher.MQTT_PORT', 1883)
    @patch('watcher.print')
    @patch('paho.mqtt.client.Client')
    def test_publish_result_no_user(self, mock_mqtt_client_class, mock_print):
        mock_client = MagicMock()
        mock_mqtt_client_class.return_value = mock_client

        watcher.publish_result("file.jpg", "findings")

        mock_client.username_pw_set.assert_not_called()
        mock_client.connect.assert_called_once_with('localhost', 1883, 5)

    @patch('watcher.MQTT_USER', 'test_user')
    @patch('watcher.MQTT_PASS', 'test_pass')
    @patch('watcher.MQTT_HOST', 'localhost')
    @patch('watcher.MQTT_PORT', 1883)
    @patch('watcher.print')
    @patch('paho.mqtt.client.Client')
    def test_publish_result_exception(self, mock_mqtt_client_class, mock_print):
        mock_client = MagicMock()
        mock_mqtt_client_class.return_value = mock_client
        mock_client.connect.side_effect = Exception("Connection Refused")

        watcher.publish_result("test.jpg", "findings")

        mock_print.assert_called_with("Ошибка отправки MQTT: Connection Refused")
        mock_client.publish.assert_not_called()

if __name__ == '__main__':
    unittest.main()
