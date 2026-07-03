import unittest
from unittest.mock import patch, MagicMock

import gui.app
from gui.app import gemini_chat

class TestGeminiChat(unittest.TestCase):

    @patch('gui.app.make_gemini_client')
    @patch('gui.app.gemini_use_proxy', False)
    def test_gemini_chat_success(self, mock_make_client):
        # 1. Test happy path
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = "Success"
        mock_make_client.return_value = mock_client

        res = gemini_chat("test_key", model="gemini-1.5-flash", messages=[])
        self.assertEqual(res, "Success")
        mock_make_client.assert_called_with("test_key", use_proxy=False)
        mock_client.chat.completions.create.assert_called_once_with(model="gemini-1.5-flash", messages=[])

    @patch('gui.app.make_gemini_client')
    @patch('gui.app.gemini_use_proxy', False)
    @patch('gui.app.ensure_tunnel')
    def test_gemini_chat_fallback_on_connection_error(self, mock_ensure_tunnel, mock_make_client):
        # 2. Test falling back to proxy on connection error
        mock_client_fail = MagicMock()
        # Simulate a network/connection error first
        mock_client_fail.chat.completions.create.side_effect = Exception("ConnectionError: Failed to connect")

        mock_client_success = MagicMock()
        mock_client_success.chat.completions.create.return_value = "Fallback Success"

        # First call returns failing client, second (proxy) returns successful client
        mock_make_client.side_effect = [mock_client_fail, mock_client_success]
        mock_ensure_tunnel.return_value = True

        res = gemini_chat("test_key", model="gemini-1.5-flash", messages=[])

        self.assertEqual(res, "Fallback Success")
        # Assert ensure_tunnel was called
        mock_ensure_tunnel.assert_called_once()
        # Ensure it called make_gemini_client first without proxy, then with proxy
        mock_make_client.assert_any_call("test_key", use_proxy=False)
        mock_make_client.assert_any_call("test_key", use_proxy=True)

    @patch('gui.app.make_gemini_client')
    @patch('gui.app.gemini_use_proxy', False)
    @patch('gui.app.ensure_tunnel')
    def test_gemini_chat_raises_on_non_connection_error(self, mock_ensure_tunnel, mock_make_client):
        # 3. Test that non-connection errors immediately raise
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = Exception("ValueError: Bad Request")
        mock_make_client.return_value = mock_client

        with self.assertRaises(Exception) as context:
            gemini_chat("test_key", model="gemini-1.5-flash", messages=[])

        self.assertTrue("ValueError: Bad Request" in str(context.exception))
        # Ensure it didn't try to use proxy fallback
        mock_ensure_tunnel.assert_not_called()

if __name__ == '__main__':
    unittest.main()
