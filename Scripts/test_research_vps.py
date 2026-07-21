import unittest
from unittest.mock import patch, MagicMock
from io import StringIO

class TestResearchVPS(unittest.TestCase):
    @patch('sys.stderr', new_callable=StringIO)
    def test_missing_env_vars(self, mock_stderr):
        with patch.dict('os.environ', {}, clear=True):
            with self.assertRaises(SystemExit) as cm:
                from Scripts.research_vps import main
                main()
            self.assertEqual(cm.exception.code, 1)
            self.assertIn("Error: VPS_HOST and either VPS_PASSWORD or VPS_KEY_PATH environment variables must be set.", mock_stderr.getvalue())

    @patch('sys.stdout', new_callable=StringIO)
    @patch('paramiko.SSHClient')
    def test_successful_execution(self, MockSSHClient, mock_stdout):
        mock_client = MagicMock()
        MockSSHClient.return_value = mock_client

        mock_stdin = MagicMock()
        mock_stdout_ssh = MagicMock()
        mock_stderr_ssh = MagicMock()
        mock_stdout_ssh.read.return_value = b"mock output\n"
        mock_stderr_ssh.read.return_value = b""
        mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

        env_vars = {
            'VPS_HOST': '127.0.0.1',
            'VPS_USER': 'testuser',
            'VPS_PASSWORD': 'testpassword'
        }
        with patch.dict('os.environ', env_vars, clear=True):
            from Scripts.research_vps import main
            main()

        MockSSHClient.assert_called_once()
        mock_client.load_system_host_keys.assert_called_once()
        mock_client.set_missing_host_key_policy.assert_called_once()
        mock_client.connect.assert_called_once_with(
            hostname='127.0.0.1',
            username='testuser',
            password='testpassword',
            key_filename=None,
            timeout=10
        )
        self.assertEqual(mock_client.exec_command.call_count, 5)
        mock_client.close.assert_called_once()
        self.assertIn("mock output", mock_stdout.getvalue())

    @patch('sys.stdout', new_callable=StringIO)
    @patch('paramiko.SSHClient')
    def test_execution_with_stderr(self, MockSSHClient, mock_stdout):
        mock_client = MagicMock()
        MockSSHClient.return_value = mock_client

        mock_stdin = MagicMock()
        mock_stdout_ssh = MagicMock()
        mock_stderr_ssh = MagicMock()
        mock_stdout_ssh.read.return_value = b""
        mock_stderr_ssh.read.return_value = b"mock error\n"
        mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

        env_vars = {
            'VPS_HOST': '127.0.0.1',
            'VPS_KEY_PATH': '/path/to/key'
        }
        with patch.dict('os.environ', env_vars, clear=True):
            from Scripts.research_vps import main
            main()

        self.assertIn("STDERR: mock error", mock_stdout.getvalue())

    @patch('sys.stdout', new_callable=StringIO)
    @patch('paramiko.SSHClient')
    def test_exception_handling(self, MockSSHClient, mock_stdout):
        mock_client = MagicMock()
        MockSSHClient.return_value = mock_client
        mock_client.connect.side_effect = Exception("Connection timed out")

        env_vars = {
            'VPS_HOST': '127.0.0.1',
            'VPS_PASSWORD': 'testpassword'
        }
        with patch.dict('os.environ', env_vars, clear=True):
            from Scripts.research_vps import main
            main()

        self.assertIn("Error: Connection timed out", mock_stdout.getvalue())

if __name__ == '__main__':
    unittest.main()
