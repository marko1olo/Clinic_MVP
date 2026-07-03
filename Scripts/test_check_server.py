import os
from unittest.mock import patch, MagicMock
import runpy

@patch.dict(os.environ, {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy'})
@patch('paramiko.SSHClient')
def test_check_server_success(mock_ssh_client_class, capsys):
    mock_ssh_client_instance = mock_ssh_client_class.return_value

    # Mocking stdout for commands
    mock_stdout = MagicMock()
    mock_stdout.read.return_value = b"success output"
    mock_stderr = MagicMock()
    mock_stderr.read.return_value = b""
    mock_ssh_client_instance.exec_command.return_value = (MagicMock(), mock_stdout, mock_stderr)

    runpy.run_path('check_server.py')

    captured = capsys.readouterr()
    assert "Connecting to root@127.0.0.1..." in captured.out
    assert "success output" in captured.out
    assert "Connection closed." in captured.out

@patch.dict(os.environ, {'VPS_HOST': '127.0.0.1', 'VPS_PASSWORD': 'dummy'})
@patch('paramiko.SSHClient')
def test_check_server_error(mock_ssh_client_class, capsys):
    mock_ssh_client_instance = mock_ssh_client_class.return_value
    mock_ssh_client_instance.connect.side_effect = Exception("Test connection failure")

    runpy.run_path('check_server.py')

    captured = capsys.readouterr()
    assert "Failed to connect or execute: Test connection failure" in captured.out
