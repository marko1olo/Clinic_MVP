import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui before importing to avoid tkinter and other errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import check_tcp_socks5

class TestCheckTcpSocks5(unittest.TestCase):
    @patch('socket.socket')
    def test_check_tcp_socks5_success(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        # Mock recv to return success for both greeting and connect
        mock_socket.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x01\x00\x00\x00\x00\x00\x00"]

        result = check_tcp_socks5("example.com", 80)

        self.assertTrue(result)
        mock_socket.connect.assert_called_once()
        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_check_tcp_socks5_greeting_failure(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        # Mock recv to return failure for greeting
        mock_socket.recv.side_effect = [b"\x05\xff"]

        result = check_tcp_socks5("example.com", 80)

        self.assertFalse(result)
        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_check_tcp_socks5_connect_failure(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        # Mock recv to return success for greeting but failure for connect
        mock_socket.recv.side_effect = [b"\x05\x00", b"\x05\x01\x00\x01\x00\x00\x00\x00\x00\x00"]

        result = check_tcp_socks5("example.com", 80)

        self.assertFalse(result)
        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_check_tcp_socks5_exception(self, mock_socket_class):
        # Simulate a socket exception (e.g. ConnectionRefusedError)
        mock_socket_class.side_effect = Exception("Connection refused")

        result = check_tcp_socks5("example.com", 80)

        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
