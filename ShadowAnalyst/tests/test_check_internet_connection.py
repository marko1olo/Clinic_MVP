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
    def test_connection_success(self, mock_socket_class):
        mock_socket_instance = MagicMock()
        mock_socket_class.return_value = mock_socket_instance

        # connect does not raise exception, meaning success
        mock_socket_instance.connect.return_value = None

        result = check_internet_connection()

        self.assertTrue(result)
        mock_socket_instance.connect.assert_called_once_with(("8.8.8.8", 53))

    @patch('socket.socket')
    def test_connection_failure(self, mock_socket_class):
        mock_socket_instance = MagicMock()
        mock_socket_class.return_value = mock_socket_instance

        # connect raises exception, meaning failure
        mock_socket_instance.connect.side_effect = socket.timeout("Connection timed out")

        result = check_internet_connection(timeout=2)

        self.assertFalse(result)
        mock_socket_instance.connect.assert_called_once_with(("8.8.8.8", 53))

if __name__ == '__main__':
    unittest.main()
