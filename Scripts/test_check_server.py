import unittest
from unittest.mock import patch, Mock
from Scripts.check_server import main

class TestCheckServer(unittest.TestCase):
    @patch('builtins.print')
    @patch('paramiko.SSHClient')
    def test_ssh_connection_failure(self, MockSSHClient, mock_print):
        mock_client = Mock()
        MockSSHClient.return_value = mock_client
        mock_client.connect.side_effect = Exception("Connection Refused")

        main()

        mock_print.assert_any_call("Failed to connect or execute: Connection Refused")

if __name__ == '__main__':
    unittest.main()
