import unittest
from unittest.mock import Mock, patch, call
from Scripts.setup_backups import ssh


class TestSetupBackups(unittest.TestCase):
    def setUp(self):
        self.mock_client = Mock()
        self.mock_stdin = Mock()
        self.mock_stdout_ssh = Mock()
        self.mock_stderr_ssh = Mock()
        self.mock_client.exec_command.return_value = (
            self.mock_stdin, self.mock_stdout_ssh, self.mock_stderr_ssh)

    @patch('sys.stdout')
    def test_ssh_success(self, mock_stdout):
        self.mock_stdout_ssh.read.return_value = b"success output\n"
        self.mock_stderr_ssh.read.return_value = b""

        out, err = ssh(self.mock_client, "echo test", desc="test desc")

        self.assertEqual(out, "success output")
        self.assertEqual(err, "")
        self.mock_client.exec_command.assert_called_once_with(
            "echo test", timeout=60)

        mock_stdout.buffer.write.assert_has_calls([
            call(b'\n>>> test desc\n'),
            call(b'success output\n')
        ])
        self.mock_stdin.close.assert_called_once()
        self.mock_stdout_ssh.close.assert_called_once()
        self.mock_stderr_ssh.close.assert_called_once()

    @patch('sys.stdout')
    def test_ssh_error(self, mock_stdout):
        self.mock_stdout_ssh.read.return_value = b""
        self.mock_stderr_ssh.read.return_value = b"error output\n"

        out, err = ssh(self.mock_client, "false", desc="")

        self.assertEqual(out, "")
        self.assertEqual(err, "error output")
        self.mock_client.exec_command.assert_called_once_with("false", timeout=60)

        mock_stdout.buffer.write.assert_has_calls([
            call(b'\n>>> false\n'),
            call(b'STDERR: error output\n')
        ])
        self.mock_stdin.close.assert_called_once()
        self.mock_stdout_ssh.close.assert_called_once()
        self.mock_stderr_ssh.close.assert_called_once()

    @patch('sys.stdout')
    def test_ssh_decode_error(self, mock_stdout):
        self.mock_stdout_ssh.read.return_value = b"bad \xff data"
        self.mock_stderr_ssh.read.return_value = b"bad \xff err"

        out, err = ssh(self.mock_client, "echo bad", desc="")

        self.assertEqual(out, "bad \ufffd data")
        self.assertEqual(err, "bad \ufffd err")

    @patch('sys.stdout')
    def test_ssh_timeout(self, mock_stdout):
        self.mock_stdout_ssh.read.return_value = b"timeout test\n"
        self.mock_stderr_ssh.read.return_value = b""

        out, err = ssh(self.mock_client, "sleep 1", desc="timeout desc", timeout=120)

        self.assertEqual(out, "timeout test")
        self.assertEqual(err, "")
        self.mock_client.exec_command.assert_called_once_with("sleep 1", timeout=120)

        mock_stdout.buffer.write.assert_has_calls([
            call(b'\n>>> timeout desc\n'),
            call(b'timeout test\n')
        ])


    @patch('sys.stdout')
    def test_ssh_very_long_command(self, mock_stdout):
        self.mock_stdout_ssh.read.return_value = b""
        self.mock_stderr_ssh.read.return_value = b""

        long_cmd = "a" * 100
        out, err = ssh(self.mock_client, long_cmd, desc="")

        self.assertEqual(out, "")
        self.assertEqual(err, "")
        self.mock_client.exec_command.assert_called_once_with(long_cmd, timeout=60)
        mock_stdout.buffer.write.assert_called_once_with(f'\n>>> {"a"*60}\n'.encode())


    @patch('sys.stdout')
    def test_ssh_output_flush(self, mock_stdout):
        self.mock_stdout_ssh.read.return_value = b""
        self.mock_stderr_ssh.read.return_value = b""

        ssh(self.mock_client, "echo test", desc="")

        self.assertEqual(mock_stdout.flush.call_count, 2)

    @patch('sys.stdout')
    @patch('paramiko.SSHClient')
    @patch('Scripts.setup_backups.ssh')
    def test_main_execution(self, mock_ssh, MockSSHClient, mock_stdout):
        mock_client = Mock()
        MockSSHClient.return_value = mock_client

        env_vars = {
            'VPS_HOST': '127.0.0.1',
            'VPS_USER': 'testuser',
            'VPS_PASSWORD': 'testpassword'
        }

        with patch.dict('os.environ', env_vars, clear=True):
            from Scripts.setup_backups import main
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

        mock_stdout.buffer.write.assert_has_calls([
            call(b"Connected.\n"),
            call(b"\nDone.\n")
        ])

        self.assertEqual(mock_ssh.call_count, 4)
        mock_client.close.assert_called_once()

    @patch('sys.stdout')
    @patch('paramiko.SSHClient')
    @patch('Scripts.setup_backups.ssh')
    def test_main_execution_with_key_file(self, mock_ssh, MockSSHClient, mock_stdout):
        mock_client = Mock()
        MockSSHClient.return_value = mock_client

        env_vars = {
            'VPS_HOST': '127.0.0.1',
            'VPS_USER': 'testuser',
            'VPS_KEY_PATH': '/path/to/key'
        }

        with patch.dict('os.environ', env_vars, clear=True):
            from Scripts.setup_backups import main
            main()

        MockSSHClient.assert_called_once()
        mock_client.load_system_host_keys.assert_called_once()
        mock_client.set_missing_host_key_policy.assert_called_once()

        mock_client.connect.assert_called_once_with(
            hostname='127.0.0.1',
            username='testuser',
            password=None,
            key_filename='/path/to/key',
            timeout=10
        )

        mock_stdout.buffer.write.assert_has_calls([
            call(b"Connected.\n"),
            call(b"\nDone.\n")
        ])

        self.assertEqual(mock_ssh.call_count, 4)
        mock_client.close.assert_called_once()

    @patch('sys.exit')
    @patch('paramiko.SSHClient')
    def test_main_execution_missing_host(self, MockSSHClient, mock_exit):
        # We want to make sure it exits immediately, so we mock sys.exit to raise an exception
        # to stop execution, otherwise main() continues and fails because mock client isn't fully mocked
        mock_exit.side_effect = SystemExit
        env_vars = {
            'VPS_USER': 'testuser',
            'VPS_PASSWORD': 'testpassword'
        }

        with patch.dict('os.environ', env_vars, clear=True):
            from Scripts.setup_backups import main
            with self.assertRaises(SystemExit):
                main()

        mock_exit.assert_called_once_with('ERROR: VPS_HOST environment variable is not set.')

    @patch('sys.exit')
    @patch('paramiko.SSHClient')
    def test_main_execution_missing_auth(self, MockSSHClient, mock_exit):
        mock_exit.side_effect = SystemExit
        env_vars = {
            'VPS_HOST': '127.0.0.1',
            'VPS_USER': 'testuser'
        }

        with patch.dict('os.environ', env_vars, clear=True):
            from Scripts.setup_backups import main
            with self.assertRaises(SystemExit):
                main()

        mock_exit.assert_called_once_with('ERROR: VPS_PASSWORD or VPS_KEY_PATH environment variable is required.')

if __name__ == '__main__':
    unittest.main()
