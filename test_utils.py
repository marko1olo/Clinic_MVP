import unittest
from unittest.mock import MagicMock, patch
from utils import ssh

class TestUtilsSSH(unittest.TestCase):
    def setUp(self):
        self.mock_client = MagicMock()
        self.mock_stdin = MagicMock()
        self.mock_stdout = MagicMock()
        self.mock_stderr = MagicMock()

        self.mock_client.exec_command.return_value = (
            self.mock_stdin,
            self.mock_stdout,
            self.mock_stderr
        )

    @patch('sys.stdout')
    def test_ssh_happy_path(self, mock_sys_stdout):
        self.mock_stdout.read.return_value = b'standard output'
        self.mock_stderr.read.return_value = b''

        out, err = ssh(self.mock_client, 'ls -la', desc='List files')

        self.assertEqual(out, 'standard output')
        self.assertEqual(err, '')

        mock_sys_stdout.buffer.write.assert_any_call(b'\n>>> List files\n')
        mock_sys_stdout.buffer.write.assert_any_call(b'standard output\n')
        mock_sys_stdout.flush.assert_called()

    @patch('sys.stdout')
    def test_ssh_error_path(self, mock_sys_stdout):
        self.mock_stdout.read.return_value = b''
        self.mock_stderr.read.return_value = b'error message'

        out, err = ssh(self.mock_client, 'ls -la', desc='List files')

        self.assertEqual(out, '')
        self.assertEqual(err, 'error message')

        mock_sys_stdout.buffer.write.assert_any_call(b'\n>>> List files\n')
        mock_sys_stdout.buffer.write.assert_any_call(b'STDERR: error message\n')

    @patch('sys.stdout')
    def test_ssh_mixed_output(self, mock_sys_stdout):
        self.mock_stdout.read.return_value = b'standard output'
        self.mock_stderr.read.return_value = b'error message'

        out, err = ssh(self.mock_client, 'ls -la', desc='List files')

        self.assertEqual(out, 'standard output')
        self.assertEqual(err, 'error message')

        mock_sys_stdout.buffer.write.assert_any_call(b'\n>>> List files\n')
        mock_sys_stdout.buffer.write.assert_any_call(b'standard output\n')
        mock_sys_stdout.buffer.write.assert_any_call(b'STDERR: error message\n')

    @patch('sys.stdout')
    def test_ssh_empty_output(self, mock_sys_stdout):
        self.mock_stdout.read.return_value = b''
        self.mock_stderr.read.return_value = b''

        out, err = ssh(self.mock_client, 'ls -la', desc='List files')

        self.assertEqual(out, '')
        self.assertEqual(err, '')

        mock_sys_stdout.buffer.write.assert_called_once_with(b'\n>>> List files\n')

    @patch('sys.stdout')
    def test_ssh_label_assignment(self, mock_sys_stdout):
        self.mock_stdout.read.return_value = b''
        self.mock_stderr.read.return_value = b''

        long_cmd = 'a' * 100
        out, err = ssh(self.mock_client, long_cmd)

        expected_label = (long_cmd[:60])
        expected_write = f"\n>>> {expected_label}\n".encode()

        mock_sys_stdout.buffer.write.assert_called_once_with(expected_write)

if __name__ == '__main__':
    unittest.main()
