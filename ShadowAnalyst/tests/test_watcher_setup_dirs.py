import os
import unittest
from unittest.mock import patch

# Import the module to be tested
from ShadowAnalyst import watcher

class TestWatcherSetupDirs(unittest.TestCase):
    @patch('ShadowAnalyst.watcher.os.makedirs')
    def test_setup_dirs_calls_makedirs(self, mock_makedirs):
        # Create dummy directories to mock the constants
        dummy_watch_dir = "/dummy/watch/dir"
        dummy_processed_dir = "/dummy/processed/dir"

        with patch('ShadowAnalyst.watcher.WATCH_DIR', dummy_watch_dir), \
             patch('ShadowAnalyst.watcher.PROCESSED_DIR', dummy_processed_dir):
            watcher.setup_dirs()

        # Check that makedirs was called for both WATCH_DIR and PROCESSED_DIR
        self.assertEqual(mock_makedirs.call_count, 2)
        mock_makedirs.assert_any_call(dummy_watch_dir, exist_ok=True)
        mock_makedirs.assert_any_call(dummy_processed_dir, exist_ok=True)

    @patch('ShadowAnalyst.watcher.os.makedirs')
    def test_setup_dirs_handles_oserror(self, mock_makedirs):
        # Make makedirs raise an OSError
        mock_makedirs.side_effect = OSError("Mocked permission denied")

        # Create dummy directories to mock the constants
        dummy_watch_dir = "/dummy/watch/dir"
        dummy_processed_dir = "/dummy/processed/dir"

        with patch('ShadowAnalyst.watcher.WATCH_DIR', dummy_watch_dir), \
             patch('ShadowAnalyst.watcher.PROCESSED_DIR', dummy_processed_dir):
            # The exception should propagate up
            with self.assertRaises(OSError) as context:
                watcher.setup_dirs()

            self.assertIn("Mocked permission denied", str(context.exception))

if __name__ == '__main__':
    unittest.main()
