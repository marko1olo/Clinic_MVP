import unittest
from unittest.mock import patch
import os
import sys

# Add clinic_admin directory to sys.path to resolve module import
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from clinic_admin.seo_agent import get_groq_api_key

class TestSeoAgent(unittest.TestCase):
    @patch('builtins.open')
    def test_get_groq_api_key_error_path(self, mock_open):
        # Configure the mock to raise an IOError when open() is called
        mock_open.side_effect = IOError("Simulated IOError for testing")

        # Call the function
        result = get_groq_api_key()

        # Verify the exception was caught and handled correctly
        self.assertIsNone(result)

if __name__ == '__main__':
    unittest.main()
