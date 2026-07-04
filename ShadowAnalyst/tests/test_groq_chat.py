import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui before importing to avoid tkinter and other errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import groq_chat

class TestGroqChat(unittest.TestCase):
    @patch('gui.app.make_groq_client')
    def test_groq_chat_happy_path(self, mock_make_groq_client):
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = "Success"
        mock_make_groq_client.return_value = mock_client

        with patch('gui.app.groq_use_proxy', False):
            result = groq_chat("dummy_api_key", messages=[])
            self.assertEqual(result, "Success")
            mock_make_groq_client.assert_called_once_with("dummy_api_key", use_proxy=False)
            mock_client.chat.completions.create.assert_called_once_with(messages=[])

    @patch('gui.app.ensure_tunnel')
    @patch('gui.app.make_groq_client')
    def test_groq_chat_fallback_proxy(self, mock_make_groq_client, mock_ensure_tunnel):
        # First client raises a connection error on create
        mock_client_direct = MagicMock()
        mock_client_direct.chat.completions.create.side_effect = Exception("ConnectionError")

        # Second client succeeds
        mock_client_proxy = MagicMock()
        mock_client_proxy.chat.completions.create.return_value = "Proxy Success"

        # return_value is direct client, side_effect is proxy client
        mock_make_groq_client.side_effect = [mock_client_direct, mock_client_proxy]

        mock_ensure_tunnel.return_value = True

        with patch('gui.app.groq_use_proxy', False):
            result = groq_chat("dummy_api_key", messages=[])

            self.assertEqual(result, "Proxy Success")
            self.assertEqual(mock_make_groq_client.call_count, 2)
            mock_ensure_tunnel.assert_called_once()
            # Verify first call was without proxy, second with proxy
            mock_make_groq_client.assert_any_call("dummy_api_key", use_proxy=False)
            mock_make_groq_client.assert_any_call("dummy_api_key", use_proxy=True)

    @patch('gui.app.make_groq_client')
    def test_groq_chat_other_error(self, mock_make_groq_client):
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = Exception("ValueError")
        mock_make_groq_client.return_value = mock_client

        with patch('gui.app.groq_use_proxy', False):
            with self.assertRaises(Exception) as context:
                groq_chat("dummy_api_key", messages=[])

            self.assertTrue("ValueError" in str(context.exception))
            self.assertEqual(mock_make_groq_client.call_count, 2)

if __name__ == '__main__':
    unittest.main()
