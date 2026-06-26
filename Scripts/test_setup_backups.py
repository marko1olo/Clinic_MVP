import unittest
from unittest.mock import Mock, patch, call
from Scripts.setup_backups import ssh

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

if __name__ == '__main__':
    unittest.main()
