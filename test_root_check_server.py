import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
import sys

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

    @patch('paramiko.SSHClient')
    @patch('sys.stdout', new_callable=StringIO)
    def test_successful_execution(self, mock_stdout, mock_ssh_client):
        # Mock SSH Client instance
        mock_instance = MagicMock()
        mock_ssh_client.return_value = mock_instance

        # Mock exec_command behavior
        def mock_exec_command(command):
            mock_stdin = MagicMock()
            mock_stdout_stream = MagicMock()
            mock_stderr_stream = MagicMock()

            mock_stdout_stream.read.return_value = b'mock stdout'
            mock_stderr_stream.read.return_value = b''

            return mock_stdin, mock_stdout_stream, mock_stderr_stream

        mock_instance.exec_command.side_effect = mock_exec_command

        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'password'}, clear=True):
            check_server.main()

        mock_instance.connect.assert_called_once_with(hostname='127.0.0.1', username='root', password='password', timeout=10)
        self.assertEqual(mock_instance.exec_command.call_count, 5)

        output = mock_stdout.getvalue()
        self.assertIn("Connecting to root@127.0.0.1...", output)
        self.assertIn("[Run] lsb_release -a", output)
        self.assertIn("mock stdout", output)
        self.assertIn("Connection closed.", output)

if __name__ == '__main__':
    unittest.main()
