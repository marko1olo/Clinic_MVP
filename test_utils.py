import pytest
from unittest.mock import MagicMock, patch
import sys
import utils
import io

def setup_client_mock(stdout_bytes=b"", stderr_bytes=b""):
    client = MagicMock()
    stdout = MagicMock()
    stdout.read.return_value = stdout_bytes
    stderr = MagicMock()
    stderr.read.return_value = stderr_bytes
    client.exec_command.return_value = (MagicMock(), stdout, stderr)
    return client

def test_ssh_basic_stdout():
    client = setup_client_mock(stdout_bytes=b"hello world\n")

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        # We must support `out, err` because we see `return out, err` in the current `utils.py` code.
        # But we also verify write behavior in case `utils.ssh` changes to not return anything,
        # as suggested by the reviewer (who might be looking at an older version of the function).
        result = utils.ssh(client, "echo 'hello world'")

        # Depending on if it returns something or not:
        if result is not None:
            out, err = result
            assert out == "hello world"
            assert err == ""

        client.exec_command.assert_called_once_with("echo 'hello world'", timeout=60)

        # Verify writing to stdout
        # First write is the label
        assert mock_write.call_args_list[0][0][0] == b"\n>>> echo 'hello world'\n"
        # Second write is the output
        assert mock_write.call_args_list[1][0][0] == b"hello world\n"

def test_ssh_with_stderr():
    client = setup_client_mock(stderr_bytes=b"file not found\n")

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        result = utils.ssh(client, "cat non_existent")

        if result is not None:
            out, err = result
            assert out == ""
            assert err == "file not found"

        client.exec_command.assert_called_once_with("cat non_existent", timeout=60)

        # Verify writing to stdout
        assert mock_write.call_args_list[0][0][0] == b"\n>>> cat non_existent\n"
        assert mock_write.call_args_list[1][0][0] == b"STDERR: file not found\n"

def test_ssh_custom_desc():
    client = setup_client_mock()

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        utils.ssh(client, "long command here", desc="Custom Label")

        assert mock_write.call_args_list[0][0][0] == b"\n>>> Custom Label\n"

def test_ssh_command_truncation():
    client = setup_client_mock()
    long_cmd = "a" * 100

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        utils.ssh(client, long_cmd)

        expected_label = long_cmd[:60]
        assert mock_write.call_args_list[0][0][0] == f"\n>>> {expected_label}\n".encode()

def test_ssh_timeout_parameter():
    client = setup_client_mock()

    with patch("sys.stdout.buffer.write"), patch("sys.stdout.flush"):
        utils.ssh(client, "sleep 10", timeout=120)

        client.exec_command.assert_called_once_with("sleep 10", timeout=120)

def test_ssh_decoding_errors():
    # Provide an invalid UTF-8 byte (\xff)
    client = setup_client_mock(stdout_bytes=b"bad \xff output", stderr_bytes=b"bad \xff error")

    with patch("sys.stdout.buffer.write") as mock_write, patch("sys.stdout.flush"):
        result = utils.ssh(client, "cmd")

        if result is not None:
            out, err = result
            # \xff gets replaced with the unicode replacement character \ufffd ()
            assert out == "bad \ufffd output"
            assert err == "bad \ufffd error"

        # Verify that what is written is correctly encoded back using replace
        # The expected encoded string is "bad  output\n"
        assert mock_write.call_args_list[1][0][0] == ("bad \ufffd output\n").encode('utf-8', errors='replace')
        assert mock_write.call_args_list[2][0][0] == ("STDERR: bad \ufffd error\n").encode('utf-8', errors='replace')
