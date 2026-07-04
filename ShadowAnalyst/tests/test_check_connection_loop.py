import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Mock dependencies
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from gui import app

class StopLoopException(Exception):
    pass

class TestCheckConnectionLoop(unittest.TestCase):
    def setUp(self):
        # Reset globals before each test
        app.gemini_use_proxy = False
        app.groq_use_proxy = False

    @patch('gui.app.time.sleep')
    @patch('gui.app.socket.socket')
    def test_direct_connection_success(self, mock_socket, mock_sleep):
        """Test that proxy is turned off if direct connection succeeds"""
        app.gemini_use_proxy = True
        app.groq_use_proxy = True

        # Stop loop after first iteration
        def side_effect(seconds):
            if seconds == 60:
                raise StopLoopException()
        mock_sleep.side_effect = side_effect

        # Direct connection succeeds (connect doesn't raise exception)
        mock_socket_instance = MagicMock()
        mock_socket.return_value = mock_socket_instance

        try:
            app.check_connection_loop()
        except StopLoopException:
            pass

        self.assertFalse(app.gemini_use_proxy)
        self.assertFalse(app.groq_use_proxy)
        self.assertEqual(mock_socket_instance.connect.call_count, 2)

    @patch('gui.app.time.sleep')
    @patch('gui.app.socket.socket')
    @patch('gui.app.ensure_tunnel')
    @patch('gui.app.check_tcp_socks5')
    def test_direct_connection_failure_proxy_success(self, mock_check_socks, mock_ensure_tunnel, mock_socket, mock_sleep):
        """Test that proxy is turned on if direct fails but proxy succeeds"""
        app.gemini_use_proxy = False
        app.groq_use_proxy = False

        # Stop loop after first iteration
        def side_effect(seconds):
            if seconds == 60:
                raise StopLoopException()
        mock_sleep.side_effect = side_effect

        # Direct connection fails
        mock_socket_instance = MagicMock()
        mock_socket_instance.connect.side_effect = Exception("Connection failed")
        mock_socket.return_value = mock_socket_instance

        # Proxy connection succeeds
        mock_ensure_tunnel.return_value = True
        mock_check_socks.return_value = True

        try:
            app.check_connection_loop()
        except StopLoopException:
            pass

        self.assertTrue(app.gemini_use_proxy)
        self.assertTrue(app.groq_use_proxy)
        self.assertEqual(mock_check_socks.call_count, 2)

    @patch('gui.app.time.sleep')
    @patch('gui.app.socket.socket')
    @patch('gui.app.ensure_tunnel')
    def test_both_connections_fail(self, mock_ensure_tunnel, mock_socket, mock_sleep):
        """Test that proxy flag remains unchanged if both connections fail"""
        app.gemini_use_proxy = False
        app.groq_use_proxy = False

        # Stop loop after first iteration
        def side_effect(seconds):
            if seconds == 60:
                raise StopLoopException()
        mock_sleep.side_effect = side_effect

        # Direct connection fails
        mock_socket_instance = MagicMock()
        mock_socket_instance.connect.side_effect = Exception("Connection failed")
        mock_socket.return_value = mock_socket_instance

        # Proxy connection fails
        mock_ensure_tunnel.return_value = False

        try:
            app.check_connection_loop()
        except StopLoopException:
            pass

        # Should remain unchanged (False)
        self.assertFalse(app.gemini_use_proxy)
        self.assertFalse(app.groq_use_proxy)

if __name__ == '__main__':
    unittest.main()
