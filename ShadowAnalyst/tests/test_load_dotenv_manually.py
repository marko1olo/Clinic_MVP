import unittest
from unittest.mock import patch, mock_open
import os

from gui.app import load_dotenv_manually

class TestLoadDotenvManually(unittest.TestCase):

    @patch.dict('os.environ', {}, clear=True)
    @patch('os.path.exists')
    @patch('builtins.print')
    @patch('builtins.open', new_callable=mock_open, read_data="TEST_VAR=123\n#comment\nQUOTED=\"val\"\nEMPTY=\n")
    def test_load_dotenv_happy_path(self, mock_file, mock_print, mock_exists):
        returns = [True] + [False] * 10
        mock_exists.side_effect = returns

        load_dotenv_manually()

        self.assertEqual(os.environ.get('TEST_VAR'), '123')
        self.assertEqual(os.environ.get('QUOTED'), 'val')
        self.assertEqual(os.environ.get('EMPTY'), '')

        self.assertTrue(any("Found .env file at" in call.args[0] for call in mock_print.call_args_list))

    @patch('os.path.exists')
    @patch('builtins.print')
    def test_load_dotenv_no_file(self, mock_print, mock_exists):
        mock_exists.return_value = False

        load_dotenv_manually()

        mock_print.assert_called_with("[CONFIG] No .env file loaded on startup.")

    @patch('os.path.exists')
    @patch('builtins.print')
    @patch('builtins.open')
    def test_load_dotenv_read_error(self, mock_file, mock_print, mock_exists):
        mock_exists.return_value = True
        mock_file.side_effect = Exception("Permission denied")

        load_dotenv_manually()

        self.assertTrue(any("Error reading .env at" in call.args[0] for call in mock_print.call_args_list))
        mock_print.assert_called_with("[CONFIG] No .env file loaded on startup.")

if __name__ == '__main__':
    unittest.main()
