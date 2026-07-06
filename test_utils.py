from unittest.mock import MagicMock, patch, call
from utils import scp_file, ssh

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

def test_ssh_success_output():
    client = MagicMock()
    mock_stdout = MagicMock()
    mock_stdout.read.return_value = b"success output\n"
    mock_stderr = MagicMock()
    mock_stderr.read.return_value = b""
    client.exec_command.return_value = (None, mock_stdout, mock_stderr)

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:
        out, err = ssh(client, "ls -la")

        client.exec_command.assert_called_once_with("ls -la", timeout=60)
        assert out == "success output"
        assert err == ""

        mock_write.assert_has_calls([
            call(b"\n>>> ls -la\n"),
            call(b"success output\n")
        ])
        assert mock_flush.call_count == 2

def test_ssh_error_output():
    client = MagicMock()
    mock_stdout = MagicMock()
    mock_stdout.read.return_value = b""
    mock_stderr = MagicMock()
    mock_stderr.read.return_value = b"error output\n"
    client.exec_command.return_value = (None, mock_stdout, mock_stderr)

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:
        out, err = ssh(client, "cat non_existent_file")

        client.exec_command.assert_called_once_with("cat non_existent_file", timeout=60)
        assert out == ""
        assert err == "error output"

        mock_write.assert_has_calls([
            call(b"\n>>> cat non_existent_file\n"),
            call(b"STDERR: error output\n")
        ])
        assert mock_flush.call_count == 2

def test_ssh_both_output():
    client = MagicMock()
    mock_stdout = MagicMock()
    mock_stdout.read.return_value = b"some output\n"
    mock_stderr = MagicMock()
    mock_stderr.read.return_value = b"some warning\n"
    client.exec_command.return_value = (None, mock_stdout, mock_stderr)

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:
        out, err = ssh(client, "command with warning")

        assert out == "some output"
        assert err == "some warning"

        mock_write.assert_has_calls([
            call(b"\n>>> command with warning\n"),
            call(b"some output\n"),
            call(b"STDERR: some warning\n")
        ])

def test_ssh_custom_desc():
    client = MagicMock()
    mock_stdout = MagicMock()
    mock_stdout.read.return_value = b"done\n"
    mock_stderr = MagicMock()
    mock_stderr.read.return_value = b""
    client.exec_command.return_value = (None, mock_stdout, mock_stderr)

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:
        out, err = ssh(client, "long command that does something", desc="Short Desc", timeout=30)

        client.exec_command.assert_called_once_with("long command that does something", timeout=30)
        mock_write.assert_has_calls([
            call(b"\n>>> Short Desc\n"),
            call(b"done\n")
        ])
