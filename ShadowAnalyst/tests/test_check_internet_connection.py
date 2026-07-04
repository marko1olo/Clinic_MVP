import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import socket

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui before importing to avoid tkinter and other errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import check_internet_connection

class TestCheckInternetConnection(unittest.TestCase):
    @patch('socket.socket')
    def test_check_internet_connection_success(self, mock_socket):
        mock_socket_instance = MagicMock()
        mock_socket.return_value = mock_socket_instance

        result = check_internet_connection(timeout=1)

        self.assertTrue(result)
        mock_socket.assert_called_with(socket.AF_INET, socket.SOCK_STREAM)
        mock_socket_instance.connect.assert_called_with(("8.8.8.8", 53))

    @patch('socket.socket')
    def test_check_internet_connection_failure(self, mock_socket):
        mock_socket_instance = MagicMock()
        mock_socket_instance.connect.side_effect = Exception("Connection failed")
        mock_socket.return_value = mock_socket_instance

        result = check_internet_connection(timeout=1)

        self.assertFalse(result)
        mock_socket.assert_called_with(socket.AF_INET, socket.SOCK_STREAM)
        mock_socket_instance.connect.assert_called_with(("8.8.8.8", 53))

if __name__ == '__main__':
    unittest.main()
