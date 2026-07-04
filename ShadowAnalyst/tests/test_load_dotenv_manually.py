import unittest
from unittest.mock import patch, mock_open, MagicMock
import os
import sys

# Add GUI path to sys.path to be able to import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'gui')))

from app import load_dotenv_manually

class TestLoadDotenvManually(unittest.TestCase):

    @patch('app.os.path.exists')
    @patch('app.open', new_callable=mock_open, read_data="KEY1=value1\nKEY2='value2'\n#comment\nKEY3=\"value3\"\n")
    def test_load_first_found(self, mock_file, mock_exists):
        # Setup mock behavior
        with patch.dict('os.environ', {}, clear=True):
            exists_returns = [False, True, False, False, False, False]
            mock_exists.side_effect = exists_returns

            load_dotenv_manually()

            self.assertEqual(mock_file.call_count, 1)

            self.assertEqual(os.environ.get('KEY1'), 'value1')
            self.assertEqual(os.environ.get('KEY2'), 'value2') # quotes should be stripped
            self.assertEqual(os.environ.get('KEY3'), 'value3') # quotes should be stripped

    @patch('app.os.path.exists')
    @patch('app.open', new_callable=mock_open)
    def test_exception_during_read_continues_search(self, mock_file, mock_exists):
        with patch.dict('os.environ', {}, clear=True):
            exists_returns = [True, True, False, False, False, False]
            mock_exists.side_effect = exists_returns

            # Since mock_open doesn't let us easily raise on first call and succeed on second with read_data,
            # we'll build a custom mock behavior
            def open_side_effect(*args, **kwargs):
                if open_side_effect.call_count == 0:
                    open_side_effect.call_count += 1
                    raise Exception("Read error")
                else:
                    open_side_effect.call_count += 1
                    return mock_open(read_data="KEY1=fallback\n")()
            open_side_effect.call_count = 0
            mock_file.side_effect = open_side_effect

            load_dotenv_manually()

            self.assertEqual(os.environ.get('KEY1'), 'fallback')
            self.assertEqual(mock_file.call_count, 2)

    @patch('app.os.path.exists', return_value=False)
    @patch('app.open', new_callable=mock_open)
    def test_no_env_file_found(self, mock_file, mock_exists):
        with patch.dict('os.environ', {}, clear=True):
            load_dotenv_manually()
            self.assertEqual(mock_file.call_count, 0)
            self.assertNotIn('KEY1', os.environ)

if __name__ == '__main__':
    unittest.main()
