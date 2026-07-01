import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock modules that might cause import errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import make_gemini_client

class TestMakeGeminiClient(unittest.TestCase):
    @patch('gui.app.OpenAI')
    def test_make_gemini_client_no_proxy(self, mock_openai):
        api_key = "test_api_key"

        client = make_gemini_client(api_key, use_proxy=False)

        mock_openai.assert_called_once_with(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            timeout=12.0,
            max_retries=1
        )
        self.assertEqual(client, mock_openai.return_value)

    @patch('gui.app.SOCKS_PROXY', 'socks5://127.0.0.1:9050')
    @patch('httpx.Client')
    @patch('gui.app.OpenAI')
    def test_make_gemini_client_with_proxy(self, mock_openai, mock_httpx_client):
        api_key = "test_api_key_proxy"

        client = make_gemini_client(api_key, use_proxy=True)

        mock_httpx_client.assert_called_once_with(
            proxy='socks5://127.0.0.1:9050',
            timeout=20.0
        )

        mock_openai.assert_called_once_with(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            timeout=20.0,
            max_retries=1,
            http_client=mock_httpx_client.return_value
        )
        self.assertEqual(client, mock_openai.return_value)

if __name__ == '__main__':
    unittest.main()
