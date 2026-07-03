import unittest
from unittest.mock import patch, MagicMock

import gui.app

class TestRestartWatchdog(unittest.TestCase):

    def setUp(self):
        # Save original state to restore later
        self.original_watch_dir = gui.app.WATCH_DIR
        self.original_observer_ref = gui.app.observer_ref
        self.original_config = gui.app.config.copy()
        self.original_app_state = gui.app.app_state.copy()

    def tearDown(self):
        # Restore original state
        gui.app.WATCH_DIR = self.original_watch_dir
        gui.app.observer_ref = self.original_observer_ref
        gui.app.config.clear()
        gui.app.config.update(self.original_config)
        gui.app.app_state.clear()
        gui.app.app_state.update(self.original_app_state)

    @patch('builtins.print')
    @patch('gui.app.start_watchdog')
    @patch('gui.app.save_config')
    @patch('os.makedirs')
    def test_restart_watchdog_same_dir(self, mock_makedirs, mock_save_config, mock_start_watchdog, mock_print):
        gui.app.WATCH_DIR = "/old/dir"
        gui.app.restart_watchdog("/old/dir")

        mock_print.assert_not_called()
        mock_makedirs.assert_not_called()
        mock_save_config.assert_not_called()
        mock_start_watchdog.assert_not_called()

    @patch('builtins.print')
    @patch('gui.app.start_watchdog')
    @patch('gui.app.save_config')
    @patch('os.makedirs')
    def test_restart_watchdog_new_dir(self, mock_makedirs, mock_save_config, mock_start_watchdog, mock_print):
        gui.app.WATCH_DIR = "/old/dir"
        gui.app.config = {"watch_dir": "/old/dir"}
        gui.app.app_state = {"watch_dir": "/old/dir"}

        mock_observer = MagicMock()
        gui.app.observer_ref = mock_observer

        new_mock_observer = MagicMock()
        mock_start_watchdog.return_value = new_mock_observer

        gui.app.restart_watchdog("/new/dir")

        mock_observer.stop.assert_called_once()
        mock_observer.join.assert_called_once()

        self.assertEqual(gui.app.WATCH_DIR, "/new/dir")
        mock_makedirs.assert_called_once_with("/new/dir", exist_ok=True)
        self.assertEqual(gui.app.config["watch_dir"], "/new/dir")
        mock_save_config.assert_called_once_with(gui.app.config)
        mock_start_watchdog.assert_called_once()
        self.assertEqual(gui.app.observer_ref, new_mock_observer)
        self.assertEqual(gui.app.app_state["watch_dir"], "/new/dir")
        mock_print.assert_called_with("Restarting Watchdog on new folder: /new/dir")

    @patch('builtins.print')
    @patch('os.makedirs')
    def test_restart_watchdog_exception(self, mock_makedirs, mock_print):
        gui.app.WATCH_DIR = "/old/dir"
        mock_makedirs.side_effect = Exception("Test Exception")

        gui.app.restart_watchdog("/new/dir")

        mock_print.assert_any_call("Error restarting watchdog: Test Exception")

if __name__ == '__main__':
    unittest.main()
