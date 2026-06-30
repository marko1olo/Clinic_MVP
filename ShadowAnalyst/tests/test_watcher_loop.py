import unittest
from unittest.mock import patch, MagicMock

import sys
sys.path.append('.')
from ShadowAnalyst.watcher import watch_loop

class TestWatcherLoop(unittest.TestCase):
    @patch('ShadowAnalyst.watcher.setup_dirs')
    @patch('ShadowAnalyst.watcher.os.listdir')
    @patch('ShadowAnalyst.watcher.Observer')
    @patch('ShadowAnalyst.watcher.time.sleep')
    def test_watch_loop_keyboard_interrupt(self, mock_sleep, mock_observer_class, mock_listdir, mock_setup_dirs):
        # Arrange
        mock_sleep.side_effect = KeyboardInterrupt("Ctrl+C")
        mock_listdir.return_value = []
        mock_observer = MagicMock()
        mock_observer_class.return_value = mock_observer

        # Act
        watch_loop()

        # Assert
        mock_observer.stop.assert_called_once()
        mock_observer.join.assert_called_once()

    @patch('ShadowAnalyst.watcher.setup_dirs')
    @patch('ShadowAnalyst.watcher.os.listdir')
    @patch('ShadowAnalyst.watcher.Observer')
    @patch('ShadowAnalyst.watcher.time.sleep')
    def test_watch_loop_general_exception(self, mock_sleep, mock_observer_class, mock_listdir, mock_setup_dirs):
        # Arrange
        mock_sleep.side_effect = Exception("General error")
        mock_listdir.return_value = []
        mock_observer = MagicMock()
        mock_observer_class.return_value = mock_observer

        # Act
        watch_loop()

        # Assert
        mock_observer.stop.assert_called_once()
        mock_observer.join.assert_called_once()

if __name__ == '__main__':
    unittest.main()
