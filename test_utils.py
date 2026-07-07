<<<<<<< HEAD
from unittest.mock import MagicMock, patch
from utils import scp_file, ssh
=======
import sys
from unittest.mock import MagicMock, patch
from utils import scp_file
>>>>>>> gitlab/main

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
<<<<<<< HEAD


def test_ssh_with_output_and_desc():
    # Arrange
    client = MagicMock()
    stdin_mock = MagicMock()
    stdout_mock = MagicMock()
    stderr_mock = MagicMock()

    stdout_mock.read.return_value = b"test output\n"
    stderr_mock.read.return_value = b"test error\n"

    client.exec_command.return_value = (stdin_mock, stdout_mock, stderr_mock)

    cmd = "echo test"
    desc = "test command"

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:

        # Act
        out, err = ssh(client, cmd, desc=desc, timeout=30)

        # Assert
        client.exec_command.assert_called_once_with(cmd, timeout=30)
        assert out == "test output"
        assert err == "test error"

        mock_write.assert_any_call(b"\n>>> test command\n")
        mock_write.assert_any_call(b"test output\n")
        mock_write.assert_any_call(b"STDERR: test error\n")
        assert mock_write.call_count == 3

        assert mock_flush.call_count == 2


def test_ssh_empty_output_and_no_desc():
    # Arrange
    client = MagicMock()
    stdin_mock = MagicMock()
    stdout_mock = MagicMock()
    stderr_mock = MagicMock()

    stdout_mock.read.return_value = b""
    stderr_mock.read.return_value = b""

    client.exec_command.return_value = (stdin_mock, stdout_mock, stderr_mock)

    cmd = "this is a very long command that is definitely longer than sixty characters to test truncation"

    with patch("sys.stdout.buffer.write") as mock_write, \
         patch("sys.stdout.flush") as mock_flush:

        # Act
        out, err = ssh(client, cmd)

        # Assert
        client.exec_command.assert_called_once_with(cmd, timeout=60)
        assert out == ""
        assert err == ""

        mock_write.assert_any_call(f"\n>>> {cmd[:60]}\n".encode())
        assert mock_write.call_count == 1

        assert mock_flush.call_count == 2
=======
>>>>>>> gitlab/main
