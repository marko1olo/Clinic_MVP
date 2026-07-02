from unittest.mock import MagicMock
from utils import scp_file

def test_scp_file(capfd):
    # Arrange
    client = MagicMock()
    sftp_mock = MagicMock()
    client.open_sftp.return_value = sftp_mock
    local_path = "local_file.txt"
    remote_path = "/remote/dir/file.txt"

    # Act
    scp_file(client, local_path, remote_path)

    # Assert
    client.open_sftp.assert_called_once()
    sftp_mock.put.assert_called_once_with(local_path, remote_path)
    sftp_mock.close.assert_called_once()

    out, err = capfd.readouterr()
    assert out == "SCP: local_file.txt -> /remote/dir/file.txt\n"
