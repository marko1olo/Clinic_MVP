import sys
from unittest.mock import MagicMock
import pytest

from utils import ssh, scp_file

def test_ssh_success():
    client = MagicMock()
    stdin = MagicMock()
    stdout = MagicMock()
    stderr = MagicMock()

    stdout.read.return_value = b"success output\n"
    stderr.read.return_value = b""
    client.exec_command.return_value = (stdin, stdout, stderr)

    out, err = ssh(client, "echo test", desc="test cmd", timeout=30)

    client.exec_command.assert_called_once_with("echo test", timeout=30)
    assert out == "success output"
    assert err == ""

def test_ssh_stderr():
    client = MagicMock()
    stdin = MagicMock()
    stdout = MagicMock()
    stderr = MagicMock()

    stdout.read.return_value = b""
    stderr.read.return_value = b"error occurred\n"
    client.exec_command.return_value = (stdin, stdout, stderr)

    out, err = ssh(client, "fail_cmd", desc="failing cmd")

    assert out == ""
    assert err == "error occurred"

def test_ssh_missing_desc(monkeypatch):
    client = MagicMock()
    stdin = MagicMock()
    stdout = MagicMock()
    stderr = MagicMock()

    stdout.read.return_value = b"output"
    stderr.read.return_value = b""
    client.exec_command.return_value = (stdin, stdout, stderr)

    writes = []
    class DummyStdout:
        class DummyBuffer:
            def write(self, data):
                writes.append(data)
        buffer = DummyBuffer()
        def flush(self):
            pass

    monkeypatch.setattr(sys, "stdout", DummyStdout())

    long_cmd = "a" * 100
    ssh(client, long_cmd)

    expected_label = long_cmd[:60]
    assert f"\n>>> {expected_label}\n".encode() in writes

def test_ssh_invalid_utf8():
    client = MagicMock()
    stdin = MagicMock()
    stdout = MagicMock()
    stderr = MagicMock()

    stdout.read.return_value = b"bad \xff output"
    stderr.read.return_value = b"bad \xff err"
    client.exec_command.return_value = (stdin, stdout, stderr)

    out, err = ssh(client, "cmd")

    assert out == "bad \ufffd output"
    assert err == "bad \ufffd err"

def test_ssh_timeout_passed():
    client = MagicMock()
    stdin = MagicMock()
    stdout = MagicMock()
    stderr = MagicMock()

    stdout.read.return_value = b""
    stderr.read.return_value = b""
    client.exec_command.return_value = (stdin, stdout, stderr)

    ssh(client, "cmd", timeout=120)

    client.exec_command.assert_called_once_with("cmd", timeout=120)
