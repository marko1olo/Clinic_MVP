import unittest
from unittest.mock import patch, MagicMock

class TestCheckServer(unittest.TestCase):
    @patch('paramiko.SSHClient')
    def test_ssh_connection_failure(self, mock_ssh_client):
        # Set up the mock to raise an exception when connect is called
        mock_instance = MagicMock()
        mock_instance.connect.side_effect = Exception("Connection refused")
        mock_ssh_client.return_value = mock_instance

        # Import the refactored script (now safe due to main() encapsulation)
        import Scripts.check_server

        # Call the main function explicitly to execute the logic
        with self.assertLogs('Scripts.check_server', level='ERROR') as cm:
            Scripts.check_server.main()

        # Assert the output contains the expected error message
        self.assertTrue(any("Failed to connect or execute: Connection refused" in msg for msg in cm.output))

if __name__ == '__main__':
    unittest.main()
