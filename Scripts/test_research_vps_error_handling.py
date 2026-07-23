import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
import os
import sys

# Ensure root directory and Scripts are in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import research_vps

class TestResearchVPSErrorHandling(unittest.TestCase):
    @patch('paramiko.SSHClient')
    @patch('sys.stdout', new_callable=StringIO)
    def test_ssh_connection_failure(self, mock_stdout, mock_ssh_client):
        mock_instance = MagicMock()
        mock_instance.connect.side_effect = Exception("Connection refused")
        mock_ssh_client.return_value = mock_instance

        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy_password'}):
            research_vps.main()

        output = mock_stdout.getvalue()
        self.assertIn("Error: Connection refused", output)

if __name__ == '__main__':
    unittest.main()
