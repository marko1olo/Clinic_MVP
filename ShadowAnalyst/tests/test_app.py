import unittest
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestApp(unittest.TestCase):
    def setUp(self):
        # Setup specific mocks for this test to avoid polluting other tests
        self.mock_tkinter = MagicMock()
        self.mock_webview = MagicMock()
        self.modules_patcher = patch.dict('sys.modules', {'tkinter': self.mock_tkinter, 'webview': self.mock_webview})
        self.modules_patcher.start()

        # Now import app module
        import gui.app as app_module
        self.app_module = app_module
        self.is_port_in_use = app_module.is_port_in_use
        self.wait_for_server = app_module.wait_for_server
        self.auto_detect_dental_paths = app_module.auto_detect_dental_paths
        self.merge_unique_keys = app_module.merge_unique_keys
        self.app_state = app_module.app_state
        self.get_status = app_module.get_status
        self.clear_error = app_module.clear_error
        self.get_logs = app_module.get_logs
        self.log_buffer = app_module.log_buffer
        self.prepare_image = app_module.prepare_image

    def tearDown(self):
        self.modules_patcher.stop()

    @patch('gui.app.socket.socket')
    def test_is_port_in_use(self, mock_socket):
        mock_instance = mock_socket.return_value.__enter__.return_value

        # Test port in use
        mock_instance.connect_ex.return_value = 0
        self.assertTrue(self.is_port_in_use(8080))

        # Test port free
        mock_instance.connect_ex.return_value = 1
        self.assertFalse(self.is_port_in_use(8080))

    @patch('gui.app.requests.get')
    @patch('gui.app.time.time')
    @patch('gui.app.time.sleep')
    def test_wait_for_server(self, mock_sleep, mock_time, mock_get):
        # Scenario 1: Server immediately responds
        mock_time.side_effect = [0, 1]
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        self.assertTrue(self.wait_for_server("http://localhost"))

        # Scenario 2: Timeout
        mock_get.reset_mock()
        mock_time.side_effect = [0, 11]
        self.assertFalse(self.wait_for_server("http://localhost", timeout=10))

    @patch('gui.app.os.path.exists')
    @patch('gui.app.os.path.isdir')
    def test_auto_detect_dental_paths(self, mock_isdir, mock_exists):
        # Only true for one specific path
        def exists_side_effect(path):
            return "VixWin" in path and path.startswith("C:")

        def isdir_side_effect(path):
            return "VixWin" in path and path.startswith("C:")

        mock_exists.side_effect = exists_side_effect
        mock_isdir.side_effect = isdir_side_effect

        paths = self.auto_detect_dental_paths()
        self.assertIn(r"C:\VixWin\VxImages", paths)

    def test_merge_unique_keys(self):
        config_keys = ["key1", "key2"]
        env_keys = ["key2", "key3"]
        merged = self.merge_unique_keys(config_keys, env_keys)
        self.assertEqual(sorted(merged), ["key1", "key2", "key3"])

    def test_get_status(self):
        self.assertEqual(self.get_status(), self.app_state)

    def test_clear_error(self):
        self.app_state["error_message"] = "Some error"
        self.clear_error()
        self.assertIsNone(self.app_state["error_message"])

    def test_get_logs(self):
        self.log_buffer.clear()
        self.log_buffer.append("Test log 1")
        self.log_buffer.append("Test log 2")
        logs = self.get_logs()
        self.assertEqual(logs, {"logs": ["Test log 1", "Test log 2"]})

if __name__ == '__main__':
    unittest.main()
