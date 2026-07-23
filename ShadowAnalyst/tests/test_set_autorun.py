import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Mock gui components to prevent execution errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from gui.app import set_autorun

class TestSetAutorun(unittest.TestCase):

    @patch('gui.app.winreg')
    @patch('gui.app.sys')
    def test_enable_autorun_frozen(self, mock_sys, mock_winreg):
        # Setup mocks
        mock_sys.frozen = True
        mock_sys.executable = "C:\\path\\to\\app.exe"

        # Call the function
        set_autorun(True)

        # Verify
        mock_winreg.OpenKey.assert_called_once_with(
            mock_winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            mock_winreg.KEY_ALL_ACCESS
        )
        # Because we use 'with winreg.OpenKey(...) as key:', mock_winreg.OpenKey.return_value.__enter__.return_value is the key object
        mock_key = mock_winreg.OpenKey.return_value.__enter__.return_value
        mock_winreg.SetValueEx.assert_called_once_with(
            mock_key,
            "ShadowAnalyst",
            0,
            mock_winreg.REG_SZ,
            "C:\\path\\to\\app.exe"
        )

    @patch('gui.app.os.path.abspath')
    @patch('gui.app.winreg')
    @patch('gui.app.sys')
    def test_enable_autorun_not_frozen(self, mock_sys, mock_winreg, mock_abspath):
        # Setup mocks to simulate not frozen
        mock_sys.frozen = False
        mock_sys.executable = "C:\\path\\to\\python.exe"
        mock_abspath.return_value = "C:\\path\\to\\app.py"

        # Call the function
        set_autorun(True)

        # Verify
        expected_exe_path = f'"C:\\path\\to\\python.exe" "C:\\path\\to\\app.py"'
        mock_key = mock_winreg.OpenKey.return_value.__enter__.return_value
        mock_winreg.SetValueEx.assert_called_once_with(
            mock_key,
            "ShadowAnalyst",
            0,
            mock_winreg.REG_SZ,
            expected_exe_path
        )

    @patch('gui.app.winreg')
    def test_disable_autorun(self, mock_winreg):
        # Call the function
        set_autorun(False)

        # Verify
        mock_key = mock_winreg.OpenKey.return_value.__enter__.return_value
        mock_winreg.DeleteValue.assert_called_once_with(mock_key, "ShadowAnalyst")

    @patch('gui.app.winreg')
    def test_disable_autorun_not_found(self, mock_winreg):
        # Setup mock to throw FileNotFoundError
        mock_winreg.DeleteValue.side_effect = FileNotFoundError()

        # Call the function (should not raise an exception)
        set_autorun(False)

        # Verify
        mock_key = mock_winreg.OpenKey.return_value.__enter__.return_value
        mock_winreg.DeleteValue.assert_called_once_with(mock_key, "ShadowAnalyst")

    @patch('builtins.print')
    @patch('gui.app.winreg')
    def test_autorun_exception(self, mock_winreg, mock_print):
        # Setup mock to throw a general Exception on OpenKey
        mock_winreg.OpenKey.side_effect = Exception("Registry Error")

        # Call the function (should catch and print the error)
        set_autorun(True)

        # Verify
        mock_print.assert_called_once_with("Autorun error: Registry Error")

if __name__ == '__main__':
    unittest.main()
