import unittest
from unittest.mock import MagicMock, patch
import sys
from utils import ssh

class TestUtilsSSH(unittest.TestCase):
    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_ssh_success_with_output(self, mock_flush, mock_write):
        client = MagicMock()
        stdin, stdout, stderr = MagicMock(), MagicMock(), MagicMock()
        stdout.read.return_value = b"success output\n"
        stderr.read.return_value = b""
        client.exec_command.return_value = (stdin, stdout, stderr)

        out, err = ssh(client, "ls -l")

        self.assertEqual(out, "success output")
        self.assertEqual(err, "")
        client.exec_command.assert_called_once_with("ls -l", timeout=60)

        # Checking if standard output was written
        mock_write.assert_any_call(b"\n>>> ls -l\n")
        mock_write.assert_any_call(b"success output\n")

    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_ssh_with_stderr(self, mock_flush, mock_write):
        client = MagicMock()
        stdin, stdout, stderr = MagicMock(), MagicMock(), MagicMock()
        stdout.read.return_value = b""
        stderr.read.return_value = b"error output\n"
        client.exec_command.return_value = (stdin, stdout, stderr)

        out, err = ssh(client, "bad_command", timeout=30)

        self.assertEqual(out, "")
        self.assertEqual(err, "error output")
        client.exec_command.assert_called_once_with("bad_command", timeout=30)

        # Checking if standard error was written
        mock_write.assert_any_call(b"STDERR: error output\n")

    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_ssh_custom_desc(self, mock_flush, mock_write):
        client = MagicMock()
        stdin, stdout, stderr = MagicMock(), MagicMock(), MagicMock()
        stdout.read.return_value = b""
        stderr.read.return_value = b""
        client.exec_command.return_value = (stdin, stdout, stderr)

        out, err = ssh(client, "long_command", desc="Custom Description")

        self.assertEqual(out, "")
        self.assertEqual(err, "")

        # Checking if custom description was written
        mock_write.assert_any_call(b"\n>>> Custom Description\n")

    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_ssh_decoding_errors_replaced(self, mock_flush, mock_write):
        client = MagicMock()
        stdin, stdout, stderr = MagicMock(), MagicMock(), MagicMock()

        # Invalid utf-8 sequence
        invalid_bytes = b"output \xff end"
        stdout.read.return_value = invalid_bytes
        stderr.read.return_value = b"err \xff"
        client.exec_command.return_value = (stdin, stdout, stderr)

        out, err = ssh(client, "test")

        self.assertEqual(out, "output \ufffd end")
        self.assertEqual(err, "err \ufffd")

if __name__ == '__main__':
    unittest.main()
