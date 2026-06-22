import unittest
from unittest.mock import MagicMock, patch
import sys
import io

from setup_backups import ssh

class TestSetupBackups(unittest.TestCase):
    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_ssh_success(self, mock_flush, mock_write):
        client = MagicMock()
        client.exec_command.return_value = (None, MagicMock(read=lambda: b"out"), MagicMock(read=lambda: b"err"))
        out, err = ssh(client, "echo test", "desc")
        self.assertEqual(out, "out")
        self.assertEqual(err, "err")
        mock_write.assert_any_call(b"\n>>> desc\n")

    @patch('sys.stdout.buffer.write')
    @patch('sys.stdout.flush')
    def test_ssh_exception(self, mock_flush, mock_write):
        client = MagicMock()
        client.exec_command.side_effect = Exception("ssh failed")

        out, err = ssh(client, "echo test", "desc")

        self.assertEqual(out, "")
        self.assertEqual(err, "ssh failed")

        mock_write.assert_any_call(b"Exception: ssh failed\n")

if __name__ == '__main__':
    unittest.main()
