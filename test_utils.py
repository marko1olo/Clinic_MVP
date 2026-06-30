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

def test_ssh_timeout():
    client = MagicMock()
    mock_stdin = MagicMock()
    mock_stdout_ssh = MagicMock()
    mock_stderr_ssh = MagicMock()

    mock_stdout_ssh.read.return_value = b"out\n"
    mock_stderr_ssh.read.return_value = b""

    client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        out, err = ssh(client, "sleep 10", timeout=15)

    client.exec_command.assert_called_once_with("sleep 10", timeout=15)
    assert out == "out"
    assert err == ""

def test_ssh_decode_error():
    client = MagicMock()
    mock_stdin = MagicMock()
    mock_stdout_ssh = MagicMock()
    mock_stderr_ssh = MagicMock()

    mock_stdout_ssh.read.return_value = b"bad \xff data\n"
    mock_stderr_ssh.read.return_value = b"bad \xff err\n"

    client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        out, err = ssh(client, "echo bad")

    assert out == "bad \ufffd data"
    assert err == "bad \ufffd err"

    mock_write.assert_has_calls([
        call(b'\n>>> echo bad\n'),
        call(b'bad \xef\xbf\xbd data\n'),
        call(b'STDERR: bad \xef\xbf\xbd err\n')
    ])

def test_ssh_long_command_and_custom_desc():
    client = MagicMock()
    mock_stdin = MagicMock()
    mock_stdout_ssh = MagicMock()
    mock_stderr_ssh = MagicMock()

    mock_stdout_ssh.read.return_value = b""
    mock_stderr_ssh.read.return_value = b""

    client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

    long_cmd = "a" * 100
    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        ssh(client, long_cmd)
        mock_write.assert_any_call(f"\n>>> {'a' * 60}\n".encode())

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        ssh(client, long_cmd, desc="custom description")
        mock_write.assert_any_call(b"\n>>> custom description\n")
