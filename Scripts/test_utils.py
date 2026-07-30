import sys
import unittest
from unittest.mock import MagicMock, patch
from utils import ssh, scp_file

class TestUtils(unittest.TestCase):
    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_success(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdin = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b"success output\n"
        mock_stderr.read.return_value = b""

        mock_client.exec_command.return_value = (mock_stdin, mock_stdout, mock_stderr)

        out, err = ssh(mock_client, "ls -la", desc="List files", timeout=30)

        self.assertEqual(out, "success output")
        self.assertEqual(err, "")
        mock_client.exec_command.assert_called_once_with("ls -la", timeout=30)

        # Verify writing to stdout
        mock_write.assert_any_call(b"\n>>> List files\n")
        mock_write.assert_any_call(b"success output\n")
        self.assertEqual(mock_flush.call_count, 2)

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_error(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdin = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b""
        mock_stderr.read.return_value = b"error message\n"

        mock_client.exec_command.return_value = (mock_stdin, mock_stdout, mock_stderr)

        out, err = ssh(mock_client, "invalid_command")

        self.assertEqual(out, "")
        self.assertEqual(err, "error message")
        mock_client.exec_command.assert_called_once_with("invalid_command", timeout=60)

        # Verify writing to stdout
        mock_write.assert_any_call(b"\n>>> invalid_command\n")
        mock_write.assert_any_call(b"STDERR: error message\n")

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_no_desc_long_cmd(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdin = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b"out"
        mock_stderr.read.return_value = b"err"
        mock_client.exec_command.return_value = (mock_stdin, mock_stdout, mock_stderr)

        long_cmd = "a" * 100
        out, err = ssh(mock_client, long_cmd)

        self.assertEqual(out, "out")
        self.assertEqual(err, "err")

        # Check label truncation
        expected_label = long_cmd[:60]
        mock_write.assert_any_call(f"\n>>> {expected_label}\n".encode())

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_decoding_error(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdin = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        # Invalid UTF-8 sequence
        mock_stdout.read.return_value = b"bad \xff byte"
        mock_stderr.read.return_value = b""

        mock_client.exec_command.return_value = (mock_stdin, mock_stdout, mock_stderr)

        out, err = ssh(mock_client, "cmd")

        # errors='replace' should replace with  (U+FFFD)
        self.assertEqual(out, "bad \ufffd byte")
        self.assertEqual(err, "")


    def test_scp_file(self):
        mock_client = MagicMock()
        mock_sftp = MagicMock()
        mock_client.open_sftp.return_value = mock_sftp

        local_path = "local/file.txt"
        remote_path = "remote/file.txt"

        with patch('sys.stdout.buffer.write') as mock_write, patch('sys.stdout.flush') as mock_flush:
            scp_file(mock_client, local_path, remote_path)

            expected_output = f"SCP: {local_path} -> {remote_path}\n".encode()
            mock_write.assert_called_once_with(expected_output)
            mock_flush.assert_called_once()

        mock_client.open_sftp.assert_called_once()
        mock_sftp.put.assert_called_once_with(local_path, remote_path)
        mock_sftp.close.assert_called_once()

if __name__ == '__main__':
    unittest.main()
