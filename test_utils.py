import unittest
from unittest.mock import MagicMock, patch
import sys
from utils import scp_file

class TestUtils(unittest.TestCase):
    @patch('sys.stdout')
    def test_scp_file(self, mock_stdout):
        mock_client = MagicMock()
        mock_sftp = MagicMock()
        mock_client.open_sftp.return_value = mock_sftp

        local_path = "local.txt"
        remote_path = "/remote/remote.txt"

        scp_file(mock_client, local_path, remote_path)

        mock_client.open_sftp.assert_called_once()
        mock_sftp.put.assert_called_once_with(local_path, remote_path)
        mock_sftp.close.assert_called_once()

        mock_stdout.buffer.write.assert_called_once_with(f"SCP: {local_path} -> {remote_path}\n".encode())
        mock_stdout.flush.assert_called()

if __name__ == '__main__':
    unittest.main()
