import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import json
import types

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

sys.modules['PIL'] = MagicMock()
sys.modules['openai'] = MagicMock()
sys.modules['watchdog'] = MagicMock()
sys.modules['watchdog.observers'] = MagicMock()
sys.modules['watchdog.events'] = MagicMock()

paho_mock = types.ModuleType('paho')
paho_mqtt_mock = types.ModuleType('paho.mqtt')
paho_mqtt_client_mock = types.ModuleType('paho.mqtt.client')
sys.modules['paho'] = paho_mock
sys.modules['paho.mqtt'] = paho_mqtt_mock
sys.modules['paho.mqtt.client'] = paho_mqtt_client_mock

import watcher

class TestPublishResult(unittest.TestCase):
    def setUp(self):
        self.mock_client_instance = MagicMock()
        self.patcher = patch('mqtt_utils.create_mqtt_client', return_value=self.mock_client_instance, create=True)
        self.mock_create_mqtt_client = self.patcher.start()

    def tearDown(self):
        self.patcher.stop()

    @patch('builtins.print')
    def test_publish_result_happy_path(self, mock_print):
        watcher.publish_result('test.jpg', 'findings string')

        self.mock_client_instance.connect.assert_called_once_with(watcher.MQTT_HOST, watcher.MQTT_PORT, 5)
        expected_payload = {
            "file": 'test.jpg',
            "findings": 'findings string'
        }
        self.mock_client_instance.publish.assert_called_once_with(
            watcher.TOPIC_XRAY_RESULT,
            json.dumps(expected_payload, ensure_ascii=False)
        )
        self.mock_client_instance.disconnect.assert_called_once()
        mock_print.assert_called_with("-> Опубликовано в MQTT: test.jpg")

    @patch('builtins.print')
    @patch('watcher.MQTT_USER', 'test_user')
    @patch('watcher.MQTT_PASS', 'test_pass')
    def test_publish_result_with_auth(self, mock_print):
        watcher.publish_result('test_auth.jpg', 'findings with auth')
        self.mock_client_instance.username_pw_set.assert_called_once_with('test_user', 'test_pass')
        self.mock_client_instance.connect.assert_called_once_with(watcher.MQTT_HOST, watcher.MQTT_PORT, 5)

    @patch('builtins.print')
    def test_publish_result_exception(self, mock_print):
        self.mock_client_instance.connect.side_effect = Exception("Connection failed")

        watcher.publish_result('test.jpg', 'findings string')

        mock_print.assert_called_with("Ошибка отправки MQTT: Connection failed")

if __name__ == '__main__':
    unittest.main()
