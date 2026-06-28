import unittest
from unittest.mock import patch, mock_open
import importlib
import os
import sys

# Add parent directory to path so we can import doctor_popup
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import doctor_popup

class TestDoctorPopupConfig(unittest.TestCase):
    def setUp(self):
        # Save original values
        self.orig_env_user = os.environ.get("MQTT_USER")
        self.orig_env_pass = os.environ.get("MQTT_PASS")
        os.environ["MQTT_USER"] = "env_user"
        os.environ["MQTT_PASS"] = "env_pass"

    def tearDown(self):
        # Restore original values
        if self.orig_env_user is not None:
            os.environ["MQTT_USER"] = self.orig_env_user
        else:
            os.environ.pop("MQTT_USER", None)

        if self.orig_env_pass is not None:
            os.environ["MQTT_PASS"] = self.orig_env_pass
        else:
            os.environ.pop("MQTT_PASS", None)

    @patch('os.path.exists')
    def test_config_file_not_exists(self, mock_exists):
        mock_exists.return_value = False
        importlib.reload(doctor_popup)

        self.assertEqual(doctor_popup.MQTT_HOST, "62.84.100.97")
        self.assertEqual(doctor_popup.MQTT_PORT, 1883)
        self.assertEqual(doctor_popup.MQTT_USER, "env_user")
        self.assertEqual(doctor_popup.MQTT_PASS, "env_pass")
        self.assertEqual(doctor_popup.TOPIC_XRAY_RESULT, "clinic/xray/result")

    @patch('os.path.exists')
    @patch('builtins.open', new_callable=mock_open, read_data='{"mqtt_host": "127.0.0.1", "mqtt_port": 1884, "mqtt_user": "cfg_user", "mqtt_pass": "cfg_pass", "mqtt_topic_xray": "test/topic"}')
    def test_config_file_exists_and_valid(self, mock_file, mock_exists):
        mock_exists.return_value = True
        importlib.reload(doctor_popup)

        self.assertEqual(doctor_popup.MQTT_HOST, "127.0.0.1")
        self.assertEqual(doctor_popup.MQTT_PORT, 1884)
        self.assertEqual(doctor_popup.MQTT_USER, "cfg_user")
        self.assertEqual(doctor_popup.MQTT_PASS, "cfg_pass")
        self.assertEqual(doctor_popup.TOPIC_XRAY_RESULT, "test/topic")

    @patch('os.path.exists')
    @patch('builtins.open', new_callable=mock_open, read_data='invalid json')
    def test_config_file_invalid_json(self, mock_file, mock_exists):
        mock_exists.return_value = True
        importlib.reload(doctor_popup)

        self.assertEqual(doctor_popup.MQTT_HOST, "62.84.100.97")
        self.assertEqual(doctor_popup.MQTT_PORT, 1883)
        self.assertEqual(doctor_popup.MQTT_USER, "env_user")
        self.assertEqual(doctor_popup.MQTT_PASS, "env_pass")
        self.assertEqual(doctor_popup.TOPIC_XRAY_RESULT, "clinic/xray/result")

    @patch('os.path.exists')
    @patch('builtins.open', side_effect=PermissionError("Access denied"))
    def test_config_file_open_exception(self, mock_file, mock_exists):
        mock_exists.return_value = True
        importlib.reload(doctor_popup)

        self.assertEqual(doctor_popup.MQTT_HOST, "62.84.100.97")
        self.assertEqual(doctor_popup.MQTT_PORT, 1883)
        self.assertEqual(doctor_popup.MQTT_USER, "env_user")
        self.assertEqual(doctor_popup.MQTT_PASS, "env_pass")
        self.assertEqual(doctor_popup.TOPIC_XRAY_RESULT, "clinic/xray/result")

if __name__ == '__main__':
    unittest.main()
