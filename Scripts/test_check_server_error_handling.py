import unittest
from unittest.mock import patch, MagicMock
import os
import sys

# Ensure root directory and Scripts are in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import check_server

class TestCheckServerErrorHandling(unittest.TestCase):
    @patch('paramiko.SSHClient')
    def test_ssh_connection_failure(self, mock_ssh_client):
        mock_instance = MagicMock()
        mock_instance.connect.side_effect = Exception("Connection refused")
        mock_ssh_client.return_value = mock_instance

        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy_password'}):
            with self.assertLogs('check_server', level='ERROR') as cm:
                check_server.main()

        self.assertTrue(any("Failed to connect or execute: Connection refused" in msg for msg in cm.output))

if __name__ == '__main__':
    unittest.main()
