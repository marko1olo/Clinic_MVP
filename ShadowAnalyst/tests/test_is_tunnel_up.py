import pytest
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'gui')))
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

import app

def test_is_tunnel_up_no_proc():
    with patch('app._tunnel_proc', None):
        assert app._is_tunnel_up() == False

def test_is_tunnel_up_proc_running():
    mock_proc = MagicMock()
    mock_proc.poll.return_value = None
    with patch('app._tunnel_proc', mock_proc):
        assert app._is_tunnel_up() == True

def test_is_tunnel_up_proc_terminated():
    mock_proc = MagicMock()
    mock_proc.poll.return_value = 0
    with patch('app._tunnel_proc', mock_proc):
        assert app._is_tunnel_up() == False
