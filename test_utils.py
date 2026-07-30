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
    def test_ssh_success(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b'test output'
        mock_stderr.read.return_value = b'test error'

        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        cmd = "echo 'test output'"
        out, err = utils.ssh(mock_client, cmd)

        self.assertEqual(out, "test output")
        self.assertEqual(err, "test error")
        mock_client.exec_command.assert_called_once_with(cmd, timeout=60)

        # Verify sys.stdout writes
        mock_write.assert_any_call(f"\n>>> {cmd}\n".encode())
        mock_write.assert_any_call(b"test output\n")
        mock_write.assert_any_call(b"STDERR: test error\n")
        self.assertEqual(mock_flush.call_count, 2)

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_no_output(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b''
        mock_stderr.read.return_value = b''

        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        cmd = "true"
        out, err = utils.ssh(mock_client, cmd)

        self.assertEqual(out, "")
        self.assertEqual(err, "")
        mock_client.exec_command.assert_called_once_with(cmd, timeout=60)

        # Verify sys.stdout writes
        mock_write.assert_called_once_with(f"\n>>> {cmd}\n".encode())
        self.assertEqual(mock_flush.call_count, 2)

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_timeout_error(self, mock_write, mock_flush):
        mock_client = MagicMock()

        # Simulate TimeoutError during exec_command
        mock_client.exec_command.side_effect = TimeoutError("Command timed out")

        cmd = "sleep 100"
        with self.assertRaises(TimeoutError):
            utils.ssh(mock_client, cmd, timeout=1)

        mock_client.exec_command.assert_called_once_with(cmd, timeout=1)
        mock_write.assert_called_once_with(f"\n>>> {cmd}\n".encode())
        mock_flush.assert_called_once()


if __name__ == '__main__':
    unittest.main()
