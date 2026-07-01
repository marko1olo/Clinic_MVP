import sys
import os
import unittest
from unittest.mock import MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import make_groq_client

class TestMakeGroqClient(unittest.TestCase):
    def test_make_groq_client_no_proxy(self):
        client = make_groq_client("test_key")
        self.assertEqual(client.api_key, "test_key")
        self.assertEqual(str(client.base_url), "https://api.groq.com/openai/v1/")
        self.assertEqual(client.timeout, 12.0)
        self.assertEqual(client.max_retries, 0)

    def test_make_groq_client_with_proxy(self):
        client = make_groq_client("test_key", use_proxy=True)
        self.assertEqual(client.api_key, "test_key")
        self.assertEqual(str(client.base_url), "https://api.groq.com/openai/v1/")
        self.assertEqual(client.timeout, 20.0)
        self.assertEqual(client.max_retries, 0)
        # Verify custom http_client was passed to OpenAI client
        self.assertIsNotNone(client._client)
        # Verify proxy configuration in http_client if present
        # Note: Depending on the httpx version/OpenAI client implementation,
        # verifying the exact proxy URL might be deeply nested or inaccessible.
        # However, checking that the custom http_client is configured with the expected timeout is feasible.

if __name__ == '__main__':
    unittest.main()
