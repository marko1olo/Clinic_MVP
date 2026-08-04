import unittest
from unittest.mock import patch, MagicMock
from utils import ssh, scp_file

class TestUtils(unittest.TestCase):
    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_ssh(self, mock_flush, mock_write):
        client = MagicMock()
        mock_stdout = MagicMock()
        mock_stdout.read.return_value = b'test output'
        mock_stderr = MagicMock()
        mock_stderr.read.return_value = b'test error'
        client.exec_command.return_value = (None, mock_stdout, mock_stderr)

        out, err = ssh(client, 'ls', desc="List files")

        self.assertEqual(out, 'test output')
        self.assertEqual(err, 'test error')
        client.exec_command.assert_called_once_with('ls', timeout=60)

        mock_write.assert_any_call(b'\n>>> List files\n')
        mock_write.assert_any_call(b'test output\n')
        mock_write.assert_any_call(b'STDERR: test error\n')
        self.assertEqual(mock_flush.call_count, 2)

    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_scp_file(self, mock_flush, mock_write):
        client = MagicMock()
        sftp = MagicMock()
        client.open_sftp.return_value = sftp

        scp_file(client, 'local.txt', 'remote.txt')

        sftp.put.assert_called_once_with('local.txt', 'remote.txt')
        sftp.close.assert_called_once()
        mock_write.assert_called_once_with(b'SCP: local.txt -> remote.txt\n')
        mock_flush.assert_called_once()

if __name__ == '__main__':
    unittest.main()
