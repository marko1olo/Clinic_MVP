import unittest
from unittest.mock import patch

# Import the script
import check_server

class TestCheckServerEnv(unittest.TestCase):
    @patch('sys.exit', side_effect=SystemExit)
    def test_missing_vps_host(self, mock_sys_exit):
        # Use patch.dict to safely simulate missing VPS_HOST without test pollution
        with patch.dict('os.environ', {}, clear=True):
            with self.assertRaises(SystemExit):
                check_server.main()
            mock_sys_exit.assert_called_once_with('ERROR: VPS_HOST environment variable is not set.')

    @patch('sys.exit', side_effect=SystemExit)
    def test_missing_vps_password(self, mock_sys_exit):
        # Use patch.dict to simulate VPS_HOST exists but VPS_PASSWORD is missing
        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1'}, clear=True):
            with self.assertRaises(SystemExit):
                check_server.main()
            mock_sys_exit.assert_called_once_with('ERROR: VPS_PASSWORD environment variable is not set.')


    @patch('check_server.paramiko.SSHClient')
    @patch('check_server.logger.error')
    def test_ssh_exception(self, mock_logger_error, mock_ssh_client):
        # Configure the mock to raise SSHException on connect
        mock_instance = mock_ssh_client.return_value
        import paramiko
        test_exception = paramiko.SSHException("Connection failed")
        mock_instance.connect.side_effect = test_exception

        # Set required environment variables
        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'test_password'}, clear=True):
            check_server.main()

        mock_logger_error.assert_any_call(f"Failed to connect or execute: {test_exception}")

if __name__ == '__main__':
    unittest.main()
