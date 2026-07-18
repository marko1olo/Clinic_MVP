import unittest
from unittest.mock import patch, MagicMock
import socket
from gui import app

class TestCheckTcpSocks5(unittest.TestCase):
    @patch('socket.socket')
    def test_success(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        # First recv(2) is for greeting, second recv(10) is for connect request
        mock_socket.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x01\x00\x00\x00\x00\x00\x00"]

        result = app.check_tcp_socks5("example.com", 80, timeout=1.0)

        self.assertTrue(result)
        mock_socket.connect.assert_called_once_with(("127.0.0.1", app.SOCKS_PORT))
        mock_socket.settimeout.assert_called_once_with(1.0)

        self.assertEqual(mock_socket.sendall.call_count, 2)

        # Check SOCKS5 connect request structure
        host_bytes = b"example.com"
        expected_request = b"\x05\x01\x00\x03" + bytes([len(host_bytes)]) + host_bytes + (80).to_bytes(2, 'big')
        mock_socket.sendall.assert_any_call(expected_request)

        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_greeting_failure_short_read(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        mock_socket.recv.return_value = b"\x05" # short read

        result = app.check_tcp_socks5("example.com", 80)

        self.assertFalse(result)
        self.assertEqual(mock_socket.sendall.call_count, 1)
        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_greeting_failure_wrong_response(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        mock_socket.recv.return_value = b"\x05\x01" # failed auth

        result = app.check_tcp_socks5("example.com", 80)

        self.assertFalse(result)
        self.assertEqual(mock_socket.sendall.call_count, 1)
        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_connect_failure(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        # Greeting ok, connect failure (e.g. host unreachable = 0x04)
        mock_socket.recv.side_effect = [b"\x05\x00", b"\x05\x04\x00\x01\x00\x00\x00\x00\x00\x00"]

        result = app.check_tcp_socks5("example.com", 80)

        self.assertFalse(result)
        self.assertEqual(mock_socket.sendall.call_count, 2)
        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_connect_failure_short_read(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        # Greeting ok, connect short response
        mock_socket.recv.side_effect = [b"\x05\x00", b"\x05"]

        result = app.check_tcp_socks5("example.com", 80)

        self.assertFalse(result)
        self.assertEqual(mock_socket.sendall.call_count, 2)
        mock_socket.close.assert_called_once()

    @patch('socket.socket')
    def test_exception_handling(self, mock_socket_class):
        mock_socket = MagicMock()
        mock_socket_class.return_value = mock_socket

        mock_socket.connect.side_effect = socket.timeout("timed out")

        result = app.check_tcp_socks5("example.com", 80)

        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
