import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
import os

class TestCheckServerErrorHandling(unittest.TestCase):
    @patch('paramiko.SSHClient')
    @patch('sys.stdout', new_callable=StringIO)
    def test_ssh_connection_failure(self, mock_stdout, mock_ssh_client):
        # Set up the mock to raise an exception when connect is called
        mock_instance = MagicMock()
        mock_instance.connect.side_effect = Exception("Connection refused")
        mock_ssh_client.return_value = mock_instance

        # Import the script
        import check_server

        # Patch environment variables to avoid sys.exit for missing vars
        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy_password'}):
            # Call the main function explicitly to execute the logic
            check_server.main()

        # Assert the output contains the expected error message
        output = mock_stdout.getvalue()
        self.assertIn("Failed to connect or execute: Connection refused", output)

if __name__ == '__main__':
    unittest.main()
