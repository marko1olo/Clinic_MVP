import os
import sys
import unittest
from unittest.mock import patch, MagicMock, call
import check_server

class TestCheckServer(unittest.TestCase):

    @patch('os.environ.get')
    def test_missing_host_env(self, mock_env_get):
        # Setup: Return None for VPS_HOST
        def env_side_effect(key):
            if key == 'VPS_HOST':
                return None
            return 'some_password'
        mock_env_get.side_effect = env_side_effect

        # Test & Assert
        with self.assertRaises(SystemExit) as cm:
            check_server.main()

        self.assertEqual(cm.exception.code, 'ERROR: VPS_HOST environment variable is not set.')

    @patch('os.environ.get')
    def test_missing_password_env(self, mock_env_get):
        # Setup: Return None for VPS_PASSWORD
        def env_side_effect(key):
            if key == 'VPS_HOST':
                return '127.0.0.1'
            if key == 'VPS_PASSWORD':
                return None
            return None
        mock_env_get.side_effect = env_side_effect

        # Test & Assert
        with self.assertRaises(SystemExit) as cm:
            check_server.main()

        self.assertEqual(cm.exception.code, 'ERROR: VPS_PASSWORD environment variable is not set.')

    @patch('os.environ.get')
    @patch('paramiko.SSHClient')
    @patch('builtins.print')
    def test_successful_ssh_connection(self, mock_print, mock_ssh_client_cls, mock_env_get):
        # Setup environment variables
        mock_env_get.side_effect = lambda k: '127.0.0.1' if k == 'VPS_HOST' else 'secret'

        # Setup SSH Client Mock
        mock_ssh_client = MagicMock()
        mock_ssh_client_cls.return_value = mock_ssh_client

        # Setup exec_command mock responses
        mock_stdin = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b'test output'
        mock_stderr.read.return_value = b''

        mock_ssh_client.exec_command.return_value = (mock_stdin, mock_stdout, mock_stderr)

        # Execute
        check_server.main()

        # Assertions
        mock_ssh_client.load_system_host_keys.assert_called_once()
        mock_ssh_client.set_missing_host_key_policy.assert_called_once()
        mock_ssh_client.connect.assert_called_once_with(
            hostname='127.0.0.1', username='root', password='secret', timeout=10
        )

        commands = [
            "lsb_release -a",
            "uptime",
            "free -m",
            "df -h /",
            "top -b -n 1 | head -n 12"
        ]

        # Verify exec_command was called for each command
        calls = [call(cmd) for cmd in commands]
        mock_ssh_client.exec_command.assert_has_calls(calls, any_order=False)
        self.assertEqual(mock_ssh_client.exec_command.call_count, len(commands))

        mock_ssh_client.close.assert_called_once()

    @patch('os.environ.get')
    @patch('paramiko.SSHClient')
    @patch('builtins.print')
    def test_stderr_output(self, mock_print, mock_ssh_client_cls, mock_env_get):
        # Setup environment variables
        mock_env_get.side_effect = lambda k: '127.0.0.1' if k == 'VPS_HOST' else 'secret'

        # Setup SSH Client Mock
        mock_ssh_client = MagicMock()
        mock_ssh_client_cls.return_value = mock_ssh_client

        # Setup exec_command to return an error on the first command, then exit early or just process all
        mock_stdin = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b'standard out'
        mock_stderr.read.return_value = b'standard error occurred'

        mock_ssh_client.exec_command.return_value = (mock_stdin, mock_stdout, mock_stderr)

        # Execute
        check_server.main()

        # Assertion
        # We check if print was called with the stderr output
        mock_print.assert_any_call("Stderr: standard error occurred")

    @patch('os.environ.get')
    @patch('paramiko.SSHClient')
    @patch('builtins.print')
    def test_connection_exception(self, mock_print, mock_ssh_client_cls, mock_env_get):
        # Setup environment variables
        mock_env_get.side_effect = lambda k: '127.0.0.1' if k == 'VPS_HOST' else 'secret'

        # Setup SSH Client Mock to raise Exception on connect
        mock_ssh_client = MagicMock()
        mock_ssh_client_cls.return_value = mock_ssh_client

        test_exception = Exception("Connection Refused")
        mock_ssh_client.connect.side_effect = test_exception

        # Execute
        check_server.main()

        # Assertion
        # Should catch the exception and print a failure message
        mock_print.assert_any_call(f"Failed to connect or execute: {test_exception}")

if __name__ == '__main__':
    unittest.main()
