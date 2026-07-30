import unittest
from unittest.mock import MagicMock, patch
import sys

import utils

class TestUtils(unittest.TestCase):
    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_scp_file(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_sftp = MagicMock()
        mock_client.open_sftp.return_value = mock_sftp

        local_path = "local/file.txt"
        remote_path = "remote/file.txt"

        utils.scp_file(mock_client, local_path, remote_path)

        mock_client.open_sftp.assert_called_once()
        mock_sftp.put.assert_called_once_with(local_path, remote_path)
        mock_sftp.close.assert_called_once()

        expected_output = f"SCP: {local_path} -> {remote_path}\n".encode()
        mock_write.assert_called_once_with(expected_output)
        mock_flush.assert_called_once()


    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_basic_stdout(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stdout.read.return_value = b"success output\n"
        mock_stderr = MagicMock()
        mock_stderr.read.return_value = b""

        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        cmd = "ls -l"
        out, err = utils.ssh(mock_client, cmd)

        mock_client.exec_command.assert_called_once_with(cmd, timeout=60)
        self.assertEqual(out, "success output")
        self.assertEqual(err, "")

        mock_write.assert_any_call(b"\n>>> ls -l\n")
        mock_write.assert_any_call(b"success output\n")

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_with_stderr(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stdout.read.return_value = b"success output\n"
        mock_stderr = MagicMock()
        mock_stderr.read.return_value = b"error output\n"

        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        cmd = "ls -l"
        out, err = utils.ssh(mock_client, cmd)

        self.assertEqual(out, "success output")
        self.assertEqual(err, "error output")

        mock_write.assert_any_call(b"\n>>> ls -l\n")
        mock_write.assert_any_call(b"success output\n")
        mock_write.assert_any_call(b"STDERR: error output\n")

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_with_desc(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stdout.read.return_value = b""
        mock_stderr = MagicMock()
        mock_stderr.read.return_value = b""

        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        cmd = "ls -l"
        desc = "listing files"
        out, err = utils.ssh(mock_client, cmd, desc=desc)

        self.assertEqual(out, "")
        self.assertEqual(err, "")

        mock_write.assert_called_once_with(b"\n>>> listing files\n")

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_empty_output(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stdout.read.return_value = b""
        mock_stderr = MagicMock()
        mock_stderr.read.return_value = b""

        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        cmd = "pwd"
        out, err = utils.ssh(mock_client, cmd)

        self.assertEqual(out, "")
        self.assertEqual(err, "")

        mock_write.assert_called_once_with(b"\n>>> pwd\n")

if __name__ == '__main__':
    unittest.main()
