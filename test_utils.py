import pytest
from unittest.mock import MagicMock, patch
import sys
from utils import ssh, scp_file

@patch('utils.sys.stdout')
def test_ssh(mock_stdout):
    mock_client = MagicMock()
    mock_channel = MagicMock()
    mock_client_stdout = MagicMock()
    mock_client_stderr = MagicMock()

    mock_client_stdout.read.return_value = b'test output\n'
    mock_client_stderr.read.return_value = b'test error\n'

    mock_client.exec_command.return_value = (mock_channel, mock_client_stdout, mock_client_stderr)

    out, err = ssh(mock_client, 'ls -la', desc='List files', timeout=30)

    assert out == 'test output'
    assert err == 'test error'

    mock_client.exec_command.assert_called_once_with('ls -la', timeout=30)

    # Check writes to buffer
    mock_stdout.buffer.write.assert_any_call(b'\n>>> List files\n')
    mock_stdout.buffer.write.assert_any_call(b'test output\n')
    mock_stdout.buffer.write.assert_any_call(b'STDERR: test error\n')

    assert mock_stdout.flush.called

@patch('utils.sys.stdout')
def test_ssh_no_desc(mock_stdout):
    mock_client = MagicMock()
    mock_channel = MagicMock()
    mock_client_stdout = MagicMock()
    mock_client_stderr = MagicMock()

    mock_client_stdout.read.return_value = b''
    mock_client_stderr.read.return_value = b''

    mock_client.exec_command.return_value = (mock_channel, mock_client_stdout, mock_client_stderr)

    long_cmd = 'a' * 100
    out, err = ssh(mock_client, long_cmd)

    assert out == ''
    assert err == ''

    mock_client.exec_command.assert_called_once_with(long_cmd, timeout=60)

    expected_label = long_cmd[:60]
    mock_stdout.buffer.write.assert_any_call(f'\n>>> {expected_label}\n'.encode())

@patch('utils.sys.stdout')
def test_ssh_encoding_errors(mock_stdout):
    mock_client = MagicMock()
    mock_channel = MagicMock()
    mock_client_stdout = MagicMock()
    mock_client_stderr = MagicMock()

    # Invalid utf-8 sequence
    mock_client_stdout.read.return_value = b'\xff invalid\n'
    mock_client_stderr.read.return_value = b'\xff invalid err\n'

    mock_client.exec_command.return_value = (mock_channel, mock_client_stdout, mock_client_stderr)

    out, err = ssh(mock_client, 'cmd')

    assert '\ufffd invalid' in out
    assert '\ufffd invalid err' in err
