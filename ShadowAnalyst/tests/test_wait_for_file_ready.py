import unittest
from unittest.mock import patch, mock_open

from gui.app import wait_for_file_ready

class TestWaitForFileReady(unittest.TestCase):

    @patch('gui.app.time.sleep')
    @patch('gui.app.time.time')
    @patch('gui.app.os.path.getsize')
    @patch('builtins.open', new_callable=mock_open)
    def test_file_ready_immediately(self, mock_open_func, mock_getsize, mock_time, mock_sleep):
        # Setup mock to return a constant positive size
        mock_getsize.return_value = 100

        # time.time() is called once for start_time, then once per loop check.
        mock_time.side_effect = [0, 1, 2, 3, 4, 5]

        result = wait_for_file_ready("dummy.txt", timeout=30)

        self.assertTrue(result)
        # Needs 4 getsize calls to get 3 stable ticks (ticks: 0, 1, 2, 3)
        self.assertEqual(mock_getsize.call_count, 4)
        mock_open_func.assert_called_with("dummy.txt", 'rb')
        self.assertEqual(mock_sleep.call_count, 3)

    @patch('gui.app.time.sleep')
    @patch('gui.app.time.time')
    @patch('gui.app.os.path.getsize')
    @patch('builtins.open', new_callable=mock_open)
    def test_file_growing_then_ready(self, mock_open_func, mock_getsize, mock_time, mock_sleep):
        # File size: 50 -> 100 -> 100 -> 100 -> 100 (ready)
        mock_getsize.side_effect = [50, 100, 100, 100, 100]

        mock_time.side_effect = [0, 1, 2, 3, 4, 5, 6]

        result = wait_for_file_ready("dummy.txt", timeout=30)

        self.assertTrue(result)
        self.assertEqual(mock_getsize.call_count, 5)
        mock_open_func.assert_called_with("dummy.txt", 'rb')
        self.assertEqual(mock_sleep.call_count, 4)

    @patch('gui.app.time.sleep')
    @patch('gui.app.time.time')
    @patch('gui.app.os.path.getsize')
    def test_timeout(self, mock_getsize, mock_time, mock_sleep):
        # Setup mock to return an ever-changing size
        mock_getsize.side_effect = [10, 20, 30, 40]

        # First call is start_time, then subsequent calls are inside the while loop
        mock_time.side_effect = [0, 10, 20, 31]

        result = wait_for_file_ready("dummy.txt", timeout=30)

        self.assertFalse(result)

    @patch('gui.app.time.sleep')
    @patch('gui.app.time.time')
    @patch('gui.app.os.path.getsize')
    @patch('builtins.open', new_callable=mock_open)
    def test_file_oserror_then_ready(self, mock_open_func, mock_getsize, mock_time, mock_sleep):
        # OSError raised on first call, then gets size 100, then gets size 100 again (ready)
        mock_getsize.side_effect = [OSError("File not found"), 100, 100, 100, 100]

        mock_time.side_effect = [0, 1, 2, 3, 4, 5, 6]

        result = wait_for_file_ready("dummy.txt", timeout=30)

        self.assertTrue(result)
        self.assertEqual(mock_getsize.call_count, 5)
        mock_open_func.assert_called_with("dummy.txt", 'rb')
        self.assertEqual(mock_sleep.call_count, 4)

    @patch('gui.app.time.sleep')
    @patch('gui.app.time.time')
    @patch('gui.app.os.path.getsize')
    @patch('builtins.open', new_callable=mock_open)
    def test_file_ready_but_open_fails(self, mock_open_func, mock_getsize, mock_time, mock_sleep):
        # Size stabilizes, but open() raises OSError (e.g. permission denied or file locked by another process)
        mock_getsize.side_effect = [100, 100, 100, 100, 100, 100, 100]

        mock_open_func.side_effect = [OSError("Locked"), mock_open_func.return_value]

        mock_time.side_effect = [0, 1, 2, 3, 4, 5, 6, 7, 8]

        result = wait_for_file_ready("dummy.txt", timeout=30)

        self.assertTrue(result)
        self.assertEqual(mock_getsize.call_count, 7)
        self.assertEqual(mock_open_func.call_count, 2)
        self.assertEqual(mock_sleep.call_count, 6)

if __name__ == '__main__':
    unittest.main()

if __name__ == '__main__':
    unittest.main()
