import unittest
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui before importing to avoid tkinter and other errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

import gui.app

class TestEnsureTunnel(unittest.TestCase):
    def setUp(self):
        gui.app._tunnel_proc = None
        gui.app._tunnel_active = False

    @patch('gui.app._is_tunnel_up')
    def test_ensure_tunnel_already_up(self, mock_is_tunnel_up):
        mock_is_tunnel_up.return_value = True
        result = gui.app.ensure_tunnel()
        self.assertTrue(result)

    @patch('gui.app.time.sleep')
    @patch('gui.app.subprocess.Popen')
    @patch('gui.app._is_tunnel_up')
    def test_ensure_tunnel_success(self, mock_is_tunnel_up, mock_popen, mock_sleep):
        # First call False, second call True
        mock_is_tunnel_up.side_effect = [False, True]

        mock_proc = MagicMock()
        mock_proc.pid = 1234
        mock_popen.return_value = mock_proc

        result = gui.app.ensure_tunnel()
        self.assertTrue(result)
        self.assertTrue(gui.app._tunnel_active)
        self.assertEqual(gui.app._tunnel_proc, mock_proc)

    @patch('gui.app.time.sleep')
    @patch('gui.app.subprocess.Popen')
    @patch('gui.app._is_tunnel_up')
    def test_ensure_tunnel_fails_to_start(self, mock_is_tunnel_up, mock_popen, mock_sleep):
        # Both calls False
        mock_is_tunnel_up.side_effect = [False, False]

        mock_proc = MagicMock()
        mock_popen.return_value = mock_proc

        result = gui.app.ensure_tunnel()
        self.assertFalse(result)

    @patch('gui.app._is_tunnel_up')
    @patch('gui.app.subprocess.Popen')
    def test_ensure_tunnel_exception(self, mock_popen, mock_is_tunnel_up):
        mock_is_tunnel_up.return_value = False
        mock_popen.side_effect = Exception("Failed to popen")

        result = gui.app.ensure_tunnel()
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
