import sys
import types
import unittest
from unittest.mock import patch, MagicMock

# Mock third-party GUI/AI dependencies via sys.modules to prevent ImportErrors
sys.modules['PIL'] = types.ModuleType('PIL')
sys.modules['PIL.Image'] = types.ModuleType('PIL.Image')
sys.modules['watchdog'] = types.ModuleType('watchdog')
sys.modules['watchdog.events'] = types.ModuleType('watchdog.events')
sys.modules['watchdog.observers'] = types.ModuleType('watchdog.observers')
sys.modules['watchdog.observers'].Observer = MagicMock()
sys.modules['watchdog.events'].FileSystemEventHandler = MagicMock

sys.modules['paho'] = types.ModuleType('paho')
sys.modules['paho.mqtt'] = types.ModuleType('paho.mqtt')
sys.modules['paho.mqtt.client'] = types.ModuleType('paho.mqtt.client')
sys.modules['openai'] = types.ModuleType('openai')
sys.modules['openai'].OpenAI = MagicMock()

import watcher

class TestWorkerLoop(unittest.TestCase):
    def setUp(self):
        # Clear global state before each test
        watcher.pending_files.clear()
        watcher.processing_files.clear()

    @patch('time.sleep')
    @patch('time.time')
    @patch('os.path.exists')
    def test_file_already_processing(self, mock_exists, mock_time, mock_sleep):
        """Test that a file already in processing_files is removed from pending_files."""
        watcher.pending_files['test.jpg'] = (100, 0)
        watcher.processing_files.add('test.jpg')

        # Raise KeyboardInterrupt after the first iteration to break the infinite loop
        mock_sleep.side_effect = [None, KeyboardInterrupt()]
        mock_time.return_value = 1.0

        with self.assertRaises(KeyboardInterrupt):
            watcher._worker_loop()

        self.assertNotIn('test.jpg', watcher.pending_files)
        mock_exists.assert_not_called()

    @patch('time.sleep')
    @patch('time.time')
    @patch('os.path.exists')
    def test_file_not_exists(self, mock_exists, mock_time, mock_sleep):
        """Test that a file that no longer exists is removed from pending_files."""
        watcher.pending_files['test.jpg'] = (100, 0)
        mock_exists.return_value = False

        mock_sleep.side_effect = [None, KeyboardInterrupt()]
        mock_time.return_value = 1.0

        with self.assertRaises(KeyboardInterrupt):
            watcher._worker_loop()

        self.assertNotIn('test.jpg', watcher.pending_files)
        mock_exists.assert_called_once_with('test.jpg')

    @patch('time.sleep')
    @patch('time.time')
    @patch('os.path.exists')
    @patch('os.path.getsize')
    def test_file_size_changed(self, mock_getsize, mock_exists, mock_time, mock_sleep):
        """Test that the stability timer is reset when file size changes."""
        watcher.pending_files['test.jpg'] = (100, 0) # last_size=100
        mock_exists.return_value = True
        mock_getsize.return_value = 200 # current_size=200

        mock_sleep.side_effect = [None, KeyboardInterrupt()]
        mock_time.return_value = 1.5

        with self.assertRaises(KeyboardInterrupt):
            watcher._worker_loop()

        # Timer should be reset to current time (1.5) and new size (200)
        self.assertIn('test.jpg', watcher.pending_files)
        self.assertEqual(watcher.pending_files['test.jpg'], (200, 1.5))

    @patch('time.sleep')
    @patch('time.time')
    @patch('os.path.exists')
    @patch('os.path.getsize')
    def test_file_size_zero(self, mock_getsize, mock_exists, mock_time, mock_sleep):
        """Test that the stability timer is reset when file size is zero."""
        watcher.pending_files['test.jpg'] = (0, 0)
        mock_exists.return_value = True
        mock_getsize.return_value = 0

        mock_sleep.side_effect = [None, KeyboardInterrupt()]
        mock_time.return_value = 2.0

        with self.assertRaises(KeyboardInterrupt):
            watcher._worker_loop()

        # Timer should be reset
        self.assertIn('test.jpg', watcher.pending_files)
        self.assertEqual(watcher.pending_files['test.jpg'], (0, 2.0))

    @patch('time.sleep')
    @patch('time.time')
    @patch('os.path.exists')
    @patch('os.path.getsize')
    @patch('threading.Thread')
    def test_file_stable(self, mock_thread, mock_getsize, mock_exists, mock_time, mock_sleep):
        """Test that a stable file is processed."""
        watcher.pending_files['test.jpg'] = (100, 0.0) # stable_start_time=0.0
        mock_exists.return_value = True
        mock_getsize.return_value = 100 # size unchanged

        mock_sleep.side_effect = [None, KeyboardInterrupt()]
        mock_time.return_value = 1.0 # exactly 1.0 second has passed

        with self.assertRaises(KeyboardInterrupt):
            watcher._worker_loop()

        self.assertNotIn('test.jpg', watcher.pending_files)
        self.assertIn('test.jpg', watcher.processing_files)
        mock_thread.assert_called_once_with(target=watcher._do_process, args=('test.jpg',), daemon=True)
        mock_thread.return_value.start.assert_called_once()

    @patch('time.sleep')
    @patch('time.time')
    @patch('os.path.exists')
    @patch('os.path.getsize')
    def test_oserror_handling(self, mock_getsize, mock_exists, mock_time, mock_sleep):
        """Test that OSError during file stat is caught and ignored."""
        watcher.pending_files['test.jpg'] = (100, 0)
        mock_exists.return_value = True
        mock_getsize.side_effect = OSError("File is busy")

        mock_sleep.side_effect = [None, KeyboardInterrupt()]
        mock_time.return_value = 1.0

        with self.assertRaises(KeyboardInterrupt):
            watcher._worker_loop()

        # Exception should be caught, file should remain in pending state unaltered
        self.assertIn('test.jpg', watcher.pending_files)
        self.assertEqual(watcher.pending_files['test.jpg'], (100, 0))

if __name__ == '__main__':
    unittest.main()
