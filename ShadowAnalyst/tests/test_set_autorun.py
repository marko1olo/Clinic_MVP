import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui before importing to avoid tkinter and other errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import set_autorun
import gui.app

class TestSetAutorun(unittest.TestCase):
    def setUp(self):
        # Create a mock for winreg
        self.mock_winreg = MagicMock()
        # Mock the OpenKey context manager
        self.mock_key = MagicMock()
        self.mock_winreg.OpenKey.return_value.__enter__.return_value = self.mock_key

        # We need to mock gui.app.winreg
        self.winreg_patcher = patch('gui.app.winreg', self.mock_winreg)
        self.winreg_patcher.start()

    def tearDown(self):
        self.winreg_patcher.stop()

    def test_set_autorun_enable_true(self):
        set_autorun(True)
        self.mock_winreg.OpenKey.assert_called_once_with(
            self.mock_winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            self.mock_winreg.KEY_ALL_ACCESS
        )
        self.mock_winreg.SetValueEx.assert_called_once()
        self.mock_winreg.DeleteValue.assert_not_called()

    def test_set_autorun_enable_false(self):
        set_autorun(False)
        self.mock_winreg.OpenKey.assert_called_once()
        self.mock_winreg.SetValueEx.assert_not_called()
        self.mock_winreg.DeleteValue.assert_called_once_with(
            self.mock_key, "ShadowAnalyst"
        )

    def test_set_autorun_enable_false_file_not_found(self):
        self.mock_winreg.DeleteValue.side_effect = FileNotFoundError()
        # Should not raise exception
        set_autorun(False)
        self.mock_winreg.DeleteValue.assert_called_once()

    @patch('sys.frozen', True, create=True)
    def test_set_autorun_frozen(self):
        # When sys.frozen is True, it uses sys.executable without __file__
        with patch('sys.executable', 'test_exe.exe'):
            set_autorun(True)
            self.mock_winreg.SetValueEx.assert_called_once_with(
                self.mock_key, "ShadowAnalyst", 0, self.mock_winreg.REG_SZ, 'test_exe.exe'
            )

    def test_set_autorun_not_frozen(self):
        # Ensure sys.frozen is False or not present
        if hasattr(sys, 'frozen'):
            del sys.frozen

        with patch('sys.executable', 'test_exe.exe'):
            with patch('os.path.abspath') as mock_abspath:
                mock_abspath.return_value = 'test_file.py'
                set_autorun(True)
                self.mock_winreg.SetValueEx.assert_called_once_with(
                    self.mock_key, "ShadowAnalyst", 0, self.mock_winreg.REG_SZ, '"test_exe.exe" "test_file.py"'
                )

    @patch('builtins.print')
    def test_set_autorun_exception(self, mock_print):
        self.mock_winreg.OpenKey.side_effect = Exception("test error")
        set_autorun(True)
        mock_print.assert_called_once_with("Autorun error: test error")

if __name__ == '__main__':
    unittest.main()
