import unittest
from unittest.mock import patch, mock_open
import sys
import os
import json
import tempfile

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from unittest.mock import MagicMock
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import save_config

class TestSaveConfig(unittest.TestCase):
    def test_save_config_success(self):
        # Create a temp file to use as CONFIG_FILE
        fd, test_config_file = tempfile.mkstemp()
        os.close(fd)

        try:
            with patch('gui.app.CONFIG_FILE', test_config_file):
                test_cfg = {"key": "value", "russian": "тест"}
                save_config(test_cfg)

                with open(test_config_file, "r", encoding="utf-8") as f:
                    saved_cfg = json.load(f)

                self.assertEqual(saved_cfg, test_cfg)
        finally:
            if os.path.exists(test_config_file):
                os.remove(test_config_file)
            tmp_file = test_config_file + ".tmp"
            if os.path.exists(tmp_file):
                os.remove(tmp_file)

    @patch('gui.app.os.replace')
    @patch('builtins.open', new_callable=mock_open)
    def test_save_config_error(self, mock_file, mock_replace):
        mock_replace.side_effect = Exception("Test Exception")
        with patch('builtins.print') as mock_print:
            with patch('gui.app.CONFIG_FILE', 'dummy_config.json'):
                # Should not raise exception
                save_config({"key": "value"})

                # Should print error
                mock_print.assert_called_with("Error saving config atomically: Test Exception")

if __name__ == '__main__':
    unittest.main()
