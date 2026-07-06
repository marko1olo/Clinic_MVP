from unittest.mock import MagicMock, Mock, patch, call
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

@patch('sys.stdout')
def test_ssh_success(mock_stdout):
    mock_client = Mock()
    mock_stdin = Mock()
    mock_stdout_ssh = Mock()
    mock_stderr_ssh = Mock()

    mock_stdout_ssh.read.return_value = b"success output\n"
    mock_stderr_ssh.read.return_value = b""

    mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

    out, err = ssh(mock_client, "echo test", desc="test desc")

    assert out == "success output"
    assert err == ""
    mock_client.exec_command.assert_called_once_with("echo test", timeout=60)

    mock_stdout.buffer.write.assert_has_calls([
        call(b'\n>>> test desc\n'),
        call(b'success output\n')
    ])

@patch('sys.stdout')
def test_ssh_error(mock_stdout):
    mock_client = Mock()
    mock_stdin = Mock()
    mock_stdout_ssh = Mock()
    mock_stderr_ssh = Mock()

    mock_stdout_ssh.read.return_value = b""
    mock_stderr_ssh.read.return_value = b"error output\n"

    mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

    out, err = ssh(mock_client, "false", desc="")

    assert out == ""
    assert err == "error output"
    mock_client.exec_command.assert_called_once_with("false", timeout=60)

    mock_stdout.buffer.write.assert_has_calls([
        call(b'\n>>> false\n'),
        call(b'STDERR: error output\n')
    ])

@patch('sys.stdout')
def test_ssh_decode_error(mock_stdout):
    mock_client = Mock()
    mock_stdin = Mock()
    mock_stdout_ssh = Mock()
    mock_stderr_ssh = Mock()

    mock_stdout_ssh.read.return_value = b"bad \xff data"
    mock_stderr_ssh.read.return_value = b"bad \xff err"

    mock_client.exec_command.return_value = (mock_stdin, mock_stdout_ssh, mock_stderr_ssh)

    out, err = ssh(mock_client, "echo bad", desc="")

    assert out == "bad \ufffd data"
    assert err == "bad \ufffd err"
