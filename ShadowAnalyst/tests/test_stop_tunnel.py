import unittest
from unittest.mock import MagicMock
import sys
import os

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui before importing to avoid tkinter and other errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

import gui.app

class TestStopTunnel(unittest.TestCase):
    def setUp(self):
        # Reset globals before each test
        gui.app._tunnel_proc = None
        gui.app._tunnel_active = False

    def test_stop_tunnel_active(self):
        mock_proc = MagicMock()
        mock_proc.poll.return_value = None
        gui.app._tunnel_proc = mock_proc
        gui.app._tunnel_active = True

        gui.app.stop_tunnel()

        mock_proc.terminate.assert_called_once()

    def test_stop_tunnel_finished(self):
        mock_proc = MagicMock()
        mock_proc.poll.return_value = 0
        gui.app._tunnel_proc = mock_proc
        gui.app._tunnel_active = True

        gui.app.stop_tunnel()

        mock_proc.terminate.assert_not_called()

    def test_stop_tunnel_none(self):
        gui.app._tunnel_proc = None
        gui.app._tunnel_active = True

        gui.app.stop_tunnel()

        # Should not raise exception
        self.assertIsNone(gui.app._tunnel_proc)

if __name__ == '__main__':
    unittest.main()
