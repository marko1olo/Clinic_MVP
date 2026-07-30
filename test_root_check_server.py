import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
import os
import sys

# Import the script
import check_server

class TestCheckServerEnv(unittest.TestCase):
    @patch('sys.exit', side_effect=SystemExit)
    def test_missing_vps_host(self, mock_sys_exit):
        with patch.dict('os.environ', {}, clear=True):
            with self.assertRaises(SystemExit):
                check_server.main()
            mock_sys_exit.assert_called_once_with('ERROR: VPS_HOST environment variable is not set.')

    @patch('sys.exit', side_effect=SystemExit)
    def test_missing_vps_password(self, mock_sys_exit):
        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1'}, clear=True):
            with self.assertRaises(SystemExit):
                check_server.main()
            mock_sys_exit.assert_called_once_with('ERROR: VPS_PASSWORD environment variable is not set.')

    @patch('paramiko.SSHClient')
    @patch('sys.stdout', new_callable=StringIO)
    def test_ssh_connection_failure(self, mock_stdout, mock_ssh_client):
        mock_instance = MagicMock()
        mock_instance.connect.side_effect = Exception("Connection refused")
        mock_ssh_client.return_value = mock_instance

        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy_password'}):
            check_server.main()

        output = mock_stdout.getvalue()
        self.assertIn("Failed to connect or execute: Connection refused", output)

    @patch('paramiko.SSHClient')
    @patch('sys.stdout', new_callable=StringIO)
    def test_successful_execution(self, mock_stdout, mock_ssh_client):
        mock_instance = MagicMock()
        mock_ssh_client.return_value = mock_instance

        # Mock exec_command to return stdout and stderr
        mock_stdout_read = MagicMock()
        mock_stdout_read.read.return_value = b'test output'
        mock_stderr_read = MagicMock()
        mock_stderr_read.read.return_value = b''
        mock_instance.exec_command.return_value = (MagicMock(), mock_stdout_read, mock_stderr_read)

        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy_password'}):
            check_server.main()

        output = mock_stdout.getvalue()
        self.assertIn("Connecting to root@127.0.0.1...", output)
        self.assertIn("[Run] lsb_release -a", output)
        self.assertIn("test output", output)
        self.assertIn("Connection closed.", output)
        self.assertEqual(mock_instance.exec_command.call_count, 5)

    @patch('paramiko.SSHClient')
    @patch('sys.stdout', new_callable=StringIO)
    def test_execution_with_stderr(self, mock_stdout, mock_ssh_client):
        mock_instance = MagicMock()
        mock_ssh_client.return_value = mock_instance

        mock_stdout_read = MagicMock()
        mock_stdout_read.read.return_value = b'test output'
        mock_stderr_read = MagicMock()
        mock_stderr_read.read.return_value = b'test error'

        # Only return stderr for the first command to test the stderr block once
        def side_effect(cmd):
            if cmd == "lsb_release -a":
                return (MagicMock(), mock_stdout_read, mock_stderr_read)
            return (MagicMock(), mock_stdout_read, MagicMock(read=lambda: b''))

        mock_instance.exec_command.side_effect = side_effect

        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy_password'}):
            check_server.main()

        output = mock_stdout.getvalue()
        self.assertIn("Stderr: test error", output)

if __name__ == '__main__':
    unittest.main()
