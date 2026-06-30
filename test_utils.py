from unittest.mock import MagicMock, patch, call
from utils import scp_file, ssh
import pytest

def test_scp_file():
    # Arrange
    client = MagicMock()
    sftp_mock = MagicMock()
    client.open_sftp.return_value = sftp_mock
    local_path = "local_file.txt"
    remote_path = "/remote/dir/file.txt"

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:

        # Act
        scp_file(client, local_path, remote_path)

        # Assert
        client.open_sftp.assert_called_once()
        sftp_mock.put.assert_called_once_with(local_path, remote_path)
        sftp_mock.close.assert_called_once()

        mock_write.assert_called_once_with(b"SCP: local_file.txt -> /remote/dir/file.txt\n")
        mock_flush.assert_called_once()

def test_ssh_timeout():
    client = MagicMock()
    client.exec_command.side_effect = TimeoutError("Connection timed out")

    with patch("sys.stdout.buffer.write"), patch("sys.stdout.flush"):
        with pytest.raises(TimeoutError):
            ssh(client, "sleep 10", timeout=10)
        client.exec_command.assert_called_once_with("sleep 10", timeout=10)

def test_ssh_decode_error():
    client = MagicMock()
    mock_stdin, mock_stdout, mock_stderr = MagicMock(), MagicMock(), MagicMock()
    mock_stdout.read.return_value = b"bad \xff data"
    mock_stderr.read.return_value = b"bad \xff err"
    client.exec_command.return_value = (mock_stdin, mock_stdout, mock_stderr)

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush"):

        # Test should not crash on invalid UTF-8 decode
        ssh(client, "echo bad", desc="")

        # Ensure that out is printed correctly with replacement characters
        mock_write.assert_any_call("bad \ufffd data\n".encode('utf-8', errors='replace'))
