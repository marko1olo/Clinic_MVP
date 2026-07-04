import unittest
from unittest.mock import patch, mock_open, MagicMock
import sys
import os

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui and platform-specific modules before importing
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()
sys.modules['winreg'] = MagicMock()
sys.modules['pystray'] = MagicMock()
sys.modules['win32clipboard'] = MagicMock()
sys.modules['win32con'] = MagicMock()
sys.modules['win32gui'] = MagicMock()

from gui.app import save_config

class TestSaveConfig(unittest.TestCase):
    @patch('gui.app.CONFIG_FILE', 'test_config.json')
    @patch('gui.app.os.replace')
    @patch('gui.app.json.dump')
    @patch('builtins.open', new_callable=mock_open)
    def test_save_config_success(self, mock_file, mock_json_dump, mock_os_replace):
        cfg = {"key": "value"}
        save_config(cfg)

        mock_file.assert_called_once_with('test_config.json.tmp', 'w', encoding='utf-8')
        mock_json_dump.assert_called_once_with(cfg, mock_file(), indent=4, ensure_ascii=False)
        mock_os_replace.assert_called_once_with('test_config.json.tmp', 'test_config.json')


    @patch('gui.app.CONFIG_FILE', 'test_config.json')
    @patch('builtins.print')
    @patch('gui.app.os.replace')
    @patch('gui.app.json.dump')
    @patch('builtins.open', new_callable=mock_open)
    def test_save_config_exception(self, mock_file, mock_json_dump, mock_os_replace, mock_print):
        cfg = {"key": "value"}
        mock_os_replace.side_effect = Exception("Permission denied")
        save_config(cfg)

        mock_print.assert_called_once_with("Error saving config atomically: Permission denied")

if __name__ == '__main__':
    unittest.main()
