import unittest
from unittest.mock import patch
import os

# Import the script
import check_server

class TestCheckServerEnv(unittest.TestCase):
    @patch('sys.exit', side_effect=SystemExit)
    def test_missing_vps_host(self, mock_sys_exit):
        # Use patch.dict to safely simulate missing VPS_HOST without test pollution
        with patch.dict('os.environ', {}, clear=True):
            with self.assertRaises(SystemExit):
                check_server.main()
            mock_sys_exit.assert_called_once_with('ERROR: VPS_HOST environment variable is not set.')

    @patch('sys.exit', side_effect=SystemExit)
    def test_missing_vps_password(self, mock_sys_exit):
        # Use patch.dict to simulate VPS_HOST exists but VPS_PASSWORD is missing
        with patch.dict('os.environ', {'VPS_HOST': '127.0.0.1'}, clear=True):
            with self.assertRaises(SystemExit):
                check_server.main()
            mock_sys_exit.assert_called_once_with('ERROR: VPS_PASSWORD environment variable is not set.')

if __name__ == '__main__':
    unittest.main()
