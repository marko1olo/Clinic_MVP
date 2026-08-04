import unittest
from unittest.mock import patch, call
from ShadowAnalyst import watcher

class TestSetupDirs(unittest.TestCase):
    @patch('ShadowAnalyst.watcher.os.makedirs')
    def test_setup_dirs(self, mock_makedirs):
        # Call the function
        watcher.setup_dirs()

        # Verify os.makedirs was called with the expected arguments
        expected_calls = [
            call(watcher.WATCH_DIR, exist_ok=True),
            call(watcher.PROCESSED_DIR, exist_ok=True)
        ]
        mock_makedirs.assert_has_calls(expected_calls, any_order=True)
        self.assertEqual(mock_makedirs.call_count, 2)

    @patch('ShadowAnalyst.watcher.os.makedirs')
    def test_setup_dirs_error(self, mock_makedirs):
        # Simulate an OSError during directory creation
        mock_makedirs.side_effect = OSError("Permission denied")

        # The exception should propagate up
        with self.assertRaises(OSError) as context:
            watcher.setup_dirs()

        self.assertIn("Permission denied", str(context.exception))
