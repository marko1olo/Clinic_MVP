import sys
import unittest
from unittest.mock import MagicMock, patch

# Mock dependencies before importing the module
sys.modules['PIL'] = MagicMock()
sys.modules['watchdog'] = MagicMock()
sys.modules['watchdog.observers'] = MagicMock()
sys.modules['watchdog.events'] = MagicMock()
sys.modules['openai'] = MagicMock()

from watcher import make_gemini_client

class TestMakeGeminiClient(unittest.TestCase):
    @patch('watcher.get_openai_client')
    def test_make_gemini_client_delegates_correctly(self, mock_get_openai_client):
        api_key = "test_gemini_key"
        mock_get_openai_client.return_value = "mock_client"

        result = make_gemini_client(api_key)

        mock_get_openai_client.assert_called_once_with(
            api_key,
            "https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        self.assertEqual(result, "mock_client")

if __name__ == '__main__':
    unittest.main()
