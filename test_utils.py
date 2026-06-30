from unittest.mock import MagicMock, patch
from utils import scp_file, ssh
import socket
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


def test_ssh_basic_success():
    client = MagicMock()
    stdin_mock, stdout_mock, stderr_mock = MagicMock(), MagicMock(), MagicMock()
    client.exec_command.return_value = (stdin_mock, stdout_mock, stderr_mock)

    stdout_mock.read.return_value = b"success output\n"
    stderr_mock.read.return_value = b""

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:

        out, err = ssh(client, "echo 'hello'", desc="greeting", timeout=30)

        client.exec_command.assert_called_once_with("echo 'hello'", timeout=30)
        assert out == "success output"
        assert err == ""

        assert mock_write.call_count == 2
        mock_write.assert_any_call(b"\n>>> greeting\n")
        mock_write.assert_any_call(b"success output\n")


def test_ssh_fallback_label():
    client = MagicMock()
    stdin_mock, stdout_mock, stderr_mock = MagicMock(), MagicMock(), MagicMock()
    client.exec_command.return_value = (stdin_mock, stdout_mock, stderr_mock)

    stdout_mock.read.return_value = b""
    stderr_mock.read.return_value = b""

    long_cmd = "a" * 100

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush"):

        ssh(client, long_cmd)

        expected_label = (long_cmd[:60]).encode()
        mock_write.assert_any_call(b"\n>>> " + expected_label + b"\n")


def test_ssh_timeout():
    client = MagicMock()
    client.exec_command.side_effect = socket.timeout("timed out")

    with patch("sys.stdout.buffer.write"), patch("sys.stdout.flush"):
        with pytest.raises(socket.timeout):
            ssh(client, "sleep 100", timeout=1)


def test_ssh_decoding_error():
    client = MagicMock()
    stdin_mock, stdout_mock, stderr_mock = MagicMock(), MagicMock(), MagicMock()
    client.exec_command.return_value = (stdin_mock, stdout_mock, stderr_mock)

    stdout_mock.read.return_value = b"good \xff bad"
    stderr_mock.read.return_value = b"err \xfe bad"

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush"):

        out, err = ssh(client, "cmd")

        assert out == "good \ufffd bad"
        assert err == "err \ufffd bad"
