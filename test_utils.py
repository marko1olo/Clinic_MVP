from unittest.mock import MagicMock, patch
from utils import scp_file

def test_scp_file():
    # Arrange
    client = MagicMock()
    sftp_mock = MagicMock()
    client.open_sftp.return_value = sftp_mock
    local_path = "local_file.txt"
    remote_path = "/remote/dir/file.txt"

    with patch("builtins.print") as mock_print:
        # Act
        scp_file(client, local_path, remote_path)

        # Assert
        client.open_sftp.assert_called_once()
        sftp_mock.put.assert_called_once_with(local_path, remote_path)
        sftp_mock.close.assert_called_once()

        mock_print.assert_called_once_with("SCP: local_file.txt -> /remote/dir/file.txt", flush=True)
