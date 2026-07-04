import pytest
from unittest.mock import patch, MagicMock
import sys
import os

# Add gui to sys.path to resolve 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'gui')))
import app

# Inherit from BaseException so generic try-except blocks don't swallow it and cause infinite loops
class StopLoopException(BaseException):
    pass

def mock_sleep(seconds):
    if seconds == 60:
        raise StopLoopException("Break infinite loop")

@pytest.fixture(autouse=True)
def reset_globals():
    # Store original values
    orig_gemini = getattr(app, 'gemini_use_proxy', False)
    orig_groq = getattr(app, 'groq_use_proxy', False)

    # Initialize for tests
    app.gemini_use_proxy = True
    app.groq_use_proxy = True
    yield
    # Restore
    app.gemini_use_proxy = orig_gemini
    app.groq_use_proxy = orig_groq

@patch('app.time.sleep', side_effect=mock_sleep)
@patch('socket.socket')
def test_direct_connection_success(mock_socket, mock_sleep_patch):
    app.gemini_use_proxy = True
    app.groq_use_proxy = True

    mock_s = MagicMock()
    mock_socket.return_value = mock_s

    with pytest.raises(StopLoopException):
        app.check_connection_loop()

    assert app.gemini_use_proxy is False
    assert app.groq_use_proxy is False
    assert mock_s.connect.call_count == 2
    assert mock_s.close.call_count == 2

@patch('app.time.sleep', side_effect=mock_sleep)
@patch('socket.socket')
@patch('app.ensure_tunnel')
@patch('app.check_tcp_socks5')
def test_direct_connection_fails_proxy_success(mock_check_tcp, mock_ensure_tunnel, mock_socket, mock_sleep_patch):
    app.gemini_use_proxy = False
    app.groq_use_proxy = False

    # Force direct connection to fail
    mock_socket.side_effect = Exception("Direct connection failed")

    # Mock SSH tunnel and SOCKS5 success
    mock_ensure_tunnel.return_value = True
    mock_check_tcp.return_value = True

    with pytest.raises(StopLoopException):
        app.check_connection_loop()

    assert app.gemini_use_proxy is True
    assert app.groq_use_proxy is True
    assert mock_ensure_tunnel.call_count == 2
    assert mock_check_tcp.call_count == 2

@patch('app.time.sleep', side_effect=mock_sleep)
@patch('socket.socket')
@patch('app.ensure_tunnel')
@patch('app.check_tcp_socks5')
def test_both_fail(mock_check_tcp, mock_ensure_tunnel, mock_socket, mock_sleep_patch):
    app.gemini_use_proxy = False
    app.groq_use_proxy = False

    # Force direct connection to fail
    mock_socket.side_effect = Exception("Direct connection failed")

    # Mock proxy failure as well
    mock_ensure_tunnel.return_value = True
    mock_check_tcp.return_value = False

    with pytest.raises(StopLoopException):
        app.check_connection_loop()

    # State should remain False because both failed
    assert app.gemini_use_proxy is False
    assert app.groq_use_proxy is False
