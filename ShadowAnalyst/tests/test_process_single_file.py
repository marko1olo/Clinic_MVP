import unittest
from unittest.mock import patch, MagicMock, call
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from watcher import process_single_file, processing_files, processing_lock, WATCH_DIR, PROCESSED_DIR

class TestProcessSingleFile(unittest.TestCase):
    def setUp(self):
        processing_files.clear()

    def tearDown(self):
        processing_files.clear()

    @patch('watcher.os.path.getsize')
    @patch('watcher.time.sleep')
    def test_already_processing(self, mock_sleep, mock_getsize):
        file_path = "dummy.jpg"
        processing_files.add(file_path)

        process_single_file(file_path)

        # Function should return immediately, sleep and getsize shouldn't be called
        mock_sleep.assert_not_called()
        mock_getsize.assert_not_called()

    @patch('watcher.os.path.getsize')
    @patch('watcher.time.sleep')
    @patch('watcher.threading.Timer')
    def test_file_disappears_before_getsize(self, mock_timer, mock_sleep, mock_getsize):
        # File is deleted exactly before the first getsize
        file_path = "dummy.jpg"
        mock_getsize.side_effect = FileNotFoundError()

        process_single_file(file_path)

        # Test that it gracefully handles the exception and eventually removes from processing_files via timer
        mock_timer.assert_called_once()

    @patch('watcher.os.path.exists')
    @patch('watcher.os.path.getsize')
    @patch('watcher.time.sleep')
    @patch('watcher.threading.Timer')
    def test_file_incomplete_size_changes(self, mock_timer, mock_sleep, mock_getsize, mock_exists):
        file_path = "dummy.jpg"
        mock_exists.return_value = True
        # First call size 100, second call size 150 (file is still being written)
        mock_getsize.side_effect = [100, 150]

        process_single_file(file_path)

        self.assertEqual(mock_getsize.call_count, 2)
        mock_timer.assert_called_once()
        # Ensure it doesn't crash and exits gracefully

    @patch('watcher.os.path.exists')
    @patch('watcher.os.path.getsize')
    @patch('watcher.time.sleep')
    @patch('watcher.threading.Timer')
    def test_file_size_is_zero(self, mock_timer, mock_sleep, mock_getsize, mock_exists):
        file_path = "dummy.jpg"
        mock_exists.return_value = True
        # Size is 0 for both checks
        mock_getsize.side_effect = [0, 0]

        process_single_file(file_path)

        self.assertEqual(mock_getsize.call_count, 2)
        mock_timer.assert_called_once()
        # Should not crash

    @patch('watcher.os.replace')
    @patch('watcher.publish_result')
    @patch('watcher.analyze_image')
    @patch('watcher.os.path.exists')
    @patch('watcher.os.path.getsize')
    @patch('watcher.time.sleep')
    @patch('watcher.threading.Timer')
    def test_successful_processing_no_marked_file(self, mock_timer, mock_sleep, mock_getsize, mock_exists, mock_analyze, mock_publish, mock_replace):
        file_path = "dummy.jpg"
        mock_exists.return_value = True
        mock_getsize.return_value = 1000
        # analyze_image returns (marked_path, findings)
        mock_analyze.return_value = (None, "Some findings")

        process_single_file(file_path)

        # Should call analyze
        mock_analyze.assert_called_once_with(file_path)
        # Should publish
        mock_publish.assert_called_once_with("dummy.jpg", "Some findings")
        # Should replace original file
        mock_replace.assert_called_once_with(file_path, os.path.join(PROCESSED_DIR, "dummy.jpg"))
        mock_timer.assert_called_once()

    @patch('watcher.os.replace')
    @patch('watcher.publish_result')
    @patch('watcher.analyze_image')
    @patch('watcher.os.path.exists')
    @patch('watcher.os.path.getsize')
    @patch('watcher.time.sleep')
    @patch('watcher.threading.Timer')
    def test_successful_processing_with_marked_file(self, mock_timer, mock_sleep, mock_getsize, mock_exists, mock_analyze, mock_publish, mock_replace):
        file_path = "dummy.jpg"
        marked_path = "marked_dummy.jpg"

        # For exists: first check is for original file, second check is for marked file
        mock_exists.side_effect = lambda path: True
        mock_getsize.return_value = 1000
        mock_analyze.return_value = (marked_path, "Some findings")

        process_single_file(file_path)

        mock_analyze.assert_called_once_with(file_path)
        mock_publish.assert_called_once_with("marked_dummy.jpg", "Some findings")

        # Should replace original file AND marked file
        expected_calls = [
            call(file_path, os.path.join(PROCESSED_DIR, "dummy.jpg")),
            call(marked_path, os.path.join(PROCESSED_DIR, "marked_dummy.jpg"))
        ]
        mock_replace.assert_has_calls(expected_calls, any_order=True)
        self.assertEqual(mock_replace.call_count, 2)
        mock_timer.assert_called_once()

    @patch('watcher.os.replace')
    @patch('watcher.publish_result')
    @patch('watcher.analyze_image')
    @patch('watcher.os.path.exists')
    @patch('watcher.os.path.getsize')
    @patch('watcher.time.sleep')
    @patch('watcher.threading.Timer')
    def test_permission_error_on_replace_retry(self, mock_timer, mock_sleep, mock_getsize, mock_exists, mock_analyze, mock_publish, mock_replace):
        file_path = "dummy.jpg"
        mock_exists.return_value = True
        mock_getsize.return_value = 1000
        mock_analyze.return_value = (None, "Findings")

        # os.replace raises PermissionError on first call, succeeds on second
        mock_replace.side_effect = [PermissionError(), None]

        process_single_file(file_path)

        # It should retry once
        self.assertEqual(mock_replace.call_count, 2)
        # Verify sleep was called for the retry (time.sleep(2))
        mock_sleep.assert_any_call(2)
        mock_timer.assert_called_once()

if __name__ == '__main__':
    unittest.main()
