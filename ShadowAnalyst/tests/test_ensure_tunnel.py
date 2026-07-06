import pytest
from unittest.mock import patch, MagicMock

@patch("gui.app._is_tunnel_up")
@patch("gui.app.subprocess.Popen")
def test_ensure_tunnel_already_up(mock_popen, mock_is_tunnel_up):
    mock_is_tunnel_up.return_value = True

    from gui.app import ensure_tunnel
    result = ensure_tunnel()

    assert result is True
    mock_popen.assert_not_called()

@patch("gui.app._is_tunnel_up")
@patch("gui.app.subprocess.Popen")
@patch("gui.app.time.sleep")
def test_ensure_tunnel_success(mock_sleep, mock_popen, mock_is_tunnel_up):
    mock_is_tunnel_up.side_effect = [False, True]

    mock_proc = MagicMock()
    mock_proc.pid = 1234
    mock_popen.return_value = mock_proc

    from gui.app import ensure_tunnel, _tunnel_active
    result = ensure_tunnel()

    assert result is True
    mock_popen.assert_called_once()
    mock_sleep.assert_called_once_with(1.5)

    import gui.app
    assert gui.app._tunnel_active is True

@patch("gui.app._is_tunnel_up")
@patch("gui.app.subprocess.Popen")
@patch("gui.app.time.sleep")
def test_ensure_tunnel_starts_but_fails(mock_sleep, mock_popen, mock_is_tunnel_up):
    mock_is_tunnel_up.side_effect = [False, False]

    mock_proc = MagicMock()
    mock_popen.return_value = mock_proc

    from gui.app import ensure_tunnel
    result = ensure_tunnel()

    assert result is False
    mock_popen.assert_called_once()
    mock_sleep.assert_called_once_with(1.5)

@patch("gui.app._is_tunnel_up")
@patch("gui.app.subprocess.Popen")
def test_ensure_tunnel_exception(mock_popen, mock_is_tunnel_up):
    mock_is_tunnel_up.return_value = False
    mock_popen.side_effect = Exception("Test Exception")

    from gui.app import ensure_tunnel
    result = ensure_tunnel()

    assert result is False
    mock_popen.assert_called_once()
