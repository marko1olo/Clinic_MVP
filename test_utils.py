import unittest
from unittest.mock import MagicMock, patch
import sys

import utils

class TestUtils(unittest.TestCase):
    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_success_with_output(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b'command output'
        mock_stderr.read.return_value = b'command error'
        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        out, err = utils.ssh(mock_client, 'ls -l', desc='listing files', timeout=30)

        self.assertEqual(out, 'command output')
        self.assertEqual(err, 'command error')

        mock_client.exec_command.assert_called_once_with('ls -l', timeout=30)

        # Verify stdout writes
        self.assertEqual(mock_write.call_count, 3)
        mock_write.assert_any_call(b'\n>>> listing files\n')
        mock_write.assert_any_call(b'command output\n')
        mock_write.assert_any_call(b'STDERR: command error\n')
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

        out, err = utils.ssh(mock_client, 'pwd')

        self.assertEqual(out, '')
        self.assertEqual(err, '')

        mock_client.exec_command.assert_called_once_with('pwd', timeout=60)

        # Verify stdout writes
        self.assertEqual(mock_write.call_count, 1)
        mock_write.assert_called_once_with(b'\n>>> pwd\n')
        self.assertEqual(mock_flush.call_count, 2)

    @patch('sys.stdout.flush')
    @patch('sys.stdout.buffer.write')
    def test_ssh_long_cmd_no_desc(self, mock_write, mock_flush):
        mock_client = MagicMock()
        mock_stdout = MagicMock()
        mock_stderr = MagicMock()

        mock_stdout.read.return_value = b'done'
        mock_stderr.read.return_value = b''
        mock_client.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

        long_cmd = 'a' * 100
        out, err = utils.ssh(mock_client, long_cmd)

        self.assertEqual(out, 'done')
        self.assertEqual(err, '')

        mock_client.exec_command.assert_called_once_with(long_cmd, timeout=60)

        # Verify label truncation
        expected_label = (long_cmd[:60]).encode()
        mock_write.assert_any_call(b'\n>>> ' + expected_label + b'\n')

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

if __name__ == '__main__':
    unittest.main()
