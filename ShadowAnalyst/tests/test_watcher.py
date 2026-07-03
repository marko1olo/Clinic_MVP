import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Ensure ShadowAnalyst can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from watcher import watch_loop

class TestWatchLoop(unittest.TestCase):
    @patch('watcher.setup_dirs')
    @patch('watcher.os.listdir')
    @patch('watcher.threading.Thread')
    @patch('watcher.Observer')
    @patch('watcher.time.sleep')
    def test_watch_loop_happy_path(self, mock_sleep, mock_observer_class, mock_thread_class, mock_listdir, mock_setup_dirs):
        # Setup mocks
        mock_listdir.return_value = ['image1.jpg', 'doc.txt', 'image2.PNG']

        # Stop the infinite loop
        mock_sleep.side_effect = KeyboardInterrupt()

        mock_observer = MagicMock()
        mock_observer_class.return_value = mock_observer

        # Run function
        watch_loop()

        # Asserts
        mock_setup_dirs.assert_called_once()
        mock_listdir.assert_called_once()

        # Check that thread was started for images only
        self.assertEqual(mock_thread_class.call_count, 2)

        mock_observer.schedule.assert_called_once()
        mock_observer.start.assert_called_once()
        mock_observer.stop.assert_called_once()
        mock_observer.join.assert_called_once()

    @patch('watcher.setup_dirs')
    @patch('watcher.os.listdir')
    @patch('watcher.Observer')
    @patch('watcher.time.sleep')
    def test_watch_loop_generic_exception(self, mock_sleep, mock_observer_class, mock_listdir, mock_setup_dirs):
        mock_listdir.return_value = []
        mock_sleep.side_effect = Exception("Test Exception")

        mock_observer = MagicMock()
        mock_observer_class.return_value = mock_observer

        watch_loop()

        mock_observer.start.assert_called_once()
        mock_observer.stop.assert_called_once()
        mock_observer.join.assert_called_once()

    @patch('watcher.setup_dirs')
    @patch('watcher.os.listdir')
    @patch('watcher.Observer')
    @patch('watcher.time.sleep')
    def test_watch_loop_existing_files_exception(self, mock_sleep, mock_observer_class, mock_listdir, mock_setup_dirs):
        # os.listdir raises exception, shouldn't crash watcher startup
        mock_listdir.side_effect = Exception("Listdir error")
        mock_sleep.side_effect = KeyboardInterrupt()

        mock_observer = MagicMock()
        mock_observer_class.return_value = mock_observer

        watch_loop()

        mock_setup_dirs.assert_called_once()
        mock_observer.start.assert_called_once()
        mock_observer.stop.assert_called_once()
        mock_observer.join.assert_called_once()

if __name__ == '__main__':
    unittest.main()
