import unittest
from unittest.mock import Mock
import sys
import os

# Add parent directory to path so gui can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import gui.app as app

class TestStopTunnel(unittest.TestCase):
    def setUp(self):
        # Reset globals before each test
        app._tunnel_proc = None
        app._tunnel_active = True

    def test_stop_tunnel_when_proc_is_none(self):
        app._tunnel_proc = None
        app._tunnel_active = True

        app.stop_tunnel()

        # Test just to ensure no exception is raised

    def test_stop_tunnel_when_proc_is_running(self):
        mock_proc = Mock()
        mock_proc.poll.return_value = None
        app._tunnel_proc = mock_proc
        app._tunnel_active = True

        app.stop_tunnel()

        mock_proc.terminate.assert_called_once()

    def test_stop_tunnel_when_proc_is_stopped(self):
        mock_proc = Mock()
        mock_proc.poll.return_value = 0
        app._tunnel_proc = mock_proc
        app._tunnel_active = True

        app.stop_tunnel()

        mock_proc.terminate.assert_not_called()

if __name__ == '__main__':
    unittest.main()
