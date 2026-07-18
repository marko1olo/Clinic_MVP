from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'gui')))
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

import app

def test_stop_tunnel_success():
    mock_proc = MagicMock()
    mock_proc.poll.return_value = None
    with patch('app._tunnel_proc', mock_proc):
        with patch('builtins.print') as mock_print:
            app.stop_tunnel()
            mock_proc.terminate.assert_called_once()
            mock_print.assert_called_once_with("[VPN] Туннель остановлен")
            assert app._tunnel_proc is None
            assert app._tunnel_active is False

def test_stop_tunnel_exception():
    mock_proc = MagicMock()
    mock_proc.poll.return_value = None
    mock_proc.terminate.side_effect = Exception("Mocked termination error")
    with patch('app._tunnel_proc', mock_proc):
        with patch('builtins.print') as mock_print:
            app.stop_tunnel()
            mock_proc.terminate.assert_called_once()
            mock_print.assert_called_with("[VPN] Ошибка остановки туннеля: Mocked termination error")
            assert app._tunnel_proc is None
            assert app._tunnel_active is False
