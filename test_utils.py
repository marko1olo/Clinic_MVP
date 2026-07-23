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

if __name__ == '__main__':
    unittest.main()
