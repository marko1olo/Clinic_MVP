import unittest
from unittest.mock import Mock, patch, call
from Scripts.setup_backups import ssh, main
import Scripts.setup_backups

class TestSetupBackups(unittest.TestCase):
    @patch('sys.stdout')
    def test_ssh_success(self, mock_stdout):
        mock_client = Mock()
        mock_stdin = Mock()
        mock_stdout_ssh = Mock()
        mock_stderr_ssh = Mock()

        mock_stdout_ssh.read.return_value = b"success output\n"
        mock_stderr_ssh.read.return_value = b""

        mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

        out, err = ssh(mock_client, "echo test", desc="test desc")

        self.assertEqual(out, "success output")
        self.assertEqual(err, "")
        mock_client.exec_command.assert_called_once_with("echo test", timeout=60)

        mock_stdout.buffer.write.assert_has_calls([
            call(b'\n>>> test desc\n'),
            call(b'success output\n')
        ])

    @patch('sys.stdout')
    def test_ssh_error(self, mock_stdout):
        mock_client = Mock()
        mock_stdin = Mock()
        mock_stdout_ssh = Mock()
        mock_stderr_ssh = Mock()

        mock_stdout_ssh.read.return_value = b""
        mock_stderr_ssh.read.return_value = b"error output\n"

        mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

        out, err = ssh(mock_client, "false", desc="")

        self.assertEqual(out, "")
        self.assertEqual(err, "error output")
        mock_client.exec_command.assert_called_once_with("false", timeout=60)

        mock_stdout.buffer.write.assert_has_calls([
            call(b'\n>>> false\n'),
            call(b'STDERR: error output\n')
        ])

    @patch('sys.stdout')
    def test_ssh_decode_error(self, mock_stdout):
        mock_client = Mock()
        mock_stdin = Mock()
        mock_stdout_ssh = Mock()
        mock_stderr_ssh = Mock()

        mock_stdout_ssh.read.return_value = b"bad \xff data"
        mock_stderr_ssh.read.return_value = b"bad \xff err"

        mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

        out, err = ssh(mock_client, "echo bad", desc="")

        self.assertEqual(out, "bad \ufffd data")
        self.assertEqual(err, "bad \ufffd err")

    @patch('Scripts.setup_backups.paramiko.SSHClient')
    @patch('Scripts.setup_backups.ssh')
    @patch('sys.stdout')
    @patch('Scripts.setup_backups.paramiko.RejectPolicy')
    def test_main(self, mock_reject_policy, mock_stdout, mock_ssh, mock_sshclient):
        mock_client = Mock()
        mock_sshclient.return_value = mock_client
        mock_reject_policy_instance = Mock()
        mock_reject_policy.return_value = mock_reject_policy_instance

        main()

        mock_sshclient.assert_called_once()
        mock_client.load_system_host_keys.assert_called_once()
        mock_client.set_missing_host_key_policy.assert_called_once_with(mock_reject_policy_instance)

        mock_client.connect.assert_called_once_with(
            hostname=Scripts.setup_backups.host,
            username=Scripts.setup_backups.user,
            password=Scripts.setup_backups.password,
            timeout=10
        )

        self.assertEqual(mock_ssh.call_count, 4)
        mock_client.close.assert_called_once()

        mock_stdout.buffer.write.assert_has_calls([
            call(b"Connected.\n"),
            call(b"\nDone.\n")
        ])


if __name__ == '__main__':
    unittest.main()
