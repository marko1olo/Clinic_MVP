import unittest
from unittest.mock import patch, MagicMock
import sys
import types

# Mock required dependencies
sys.modules['PIL'] = MagicMock()
sys.modules['watchdog'] = MagicMock()
sys.modules['watchdog.events'] = MagicMock()
sys.modules['watchdog.observers'] = MagicMock()
sys.modules['openai'] = MagicMock()
sys.modules['paho'] = types.ModuleType('paho')
sys.modules['paho.mqtt'] = types.ModuleType('paho.mqtt')
sys.modules['paho.mqtt.client'] = MagicMock()

from ShadowAnalyst import watcher

class TestProcessSingleFile(unittest.TestCase):
    def setUp(self):
        # Clear the global state before each test
        watcher.processing_files.clear()
        watcher.pending_files.clear()

    @patch('ShadowAnalyst.watcher.os.path.getsize')
    def test_in_processing_files(self, mock_getsize):
        file_path = "test.jpg"
        watcher.processing_files.add(file_path)

        watcher.process_single_file(file_path)

        self.assertNotIn(file_path, watcher.pending_files)
        mock_getsize.assert_not_called()

    @patch('ShadowAnalyst.watcher.os.path.getsize')
    def test_already_in_pending_files(self, mock_getsize):
        file_path = "test.jpg"
        watcher.pending_files[file_path] = (100, 123456.0)

        watcher.process_single_file(file_path)

        self.assertEqual(watcher.pending_files[file_path], (100, 123456.0))
        mock_getsize.assert_not_called()

    @patch('ShadowAnalyst.watcher.os.path.getsize')
    @patch('time.time')
    def test_new_file(self, mock_time, mock_getsize):
        file_path = "test.jpg"
        mock_getsize.return_value = 1024
        mock_time.return_value = 98765.0

        watcher.process_single_file(file_path)

        self.assertIn(file_path, watcher.pending_files)
        self.assertEqual(watcher.pending_files[file_path], (1024, 98765.0))
        mock_getsize.assert_called_once_with(file_path)

    @patch('ShadowAnalyst.watcher.os.path.getsize')
    def test_oserror_handling(self, mock_getsize):
        file_path = "test.jpg"
        mock_getsize.side_effect = OSError("File not found")

        watcher.process_single_file(file_path)

        self.assertNotIn(file_path, watcher.pending_files)
        mock_getsize.assert_called_once_with(file_path)

if __name__ == '__main__':
    unittest.main()
