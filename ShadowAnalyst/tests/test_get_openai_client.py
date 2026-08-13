import unittest
from unittest.mock import patch
from ShadowAnalyst.watcher import get_openai_client, make_groq_client, make_gemini_client

class TestGetOpenAIClient(unittest.TestCase):
    def setUp(self):
        # Clear the lru_cache before each test to ensure tests are isolated
        get_openai_client.cache_clear()

    def test_get_openai_client_caching(self):
        # Arrange
        api_key = "test_key"
        base_url = "http://test_url"
        timeout = 30.0

        # Act
        client1 = get_openai_client(api_key, base_url, timeout)
        client2 = get_openai_client(api_key, base_url, timeout)

        # Assert
        self.assertIs(client1, client2, "Clients with the same credentials should be cached and return the exact same instance")
        self.assertEqual(get_openai_client.cache_info().currsize, 1, "There should be only one entry in the cache")

    def test_get_openai_client_different_args(self):
        # Act
        client1 = get_openai_client("test_key1", "http://test_url1")
        client2 = get_openai_client("test_key2", "http://test_url2")

        # Assert
        self.assertIsNot(client1, client2, "Clients with different credentials should not be the same instance")
        self.assertEqual(get_openai_client.cache_info().currsize, 2, "There should be two entries in the cache")

    def test_get_openai_client_no_api_key(self):
        # Act
        client = get_openai_client(None, "http://test_url")

        # Assert
        self.assertEqual(client.api_key, "dummy_key", "If no api_key is provided, it should default to 'dummy_key'")

    def test_get_openai_client_empty_api_key(self):
        # Act
        client = get_openai_client("", "http://test_url")

        # Assert
        self.assertEqual(client.api_key, "dummy_key", "If an empty string is provided for api_key, it should default to 'dummy_key'")

    @patch('ShadowAnalyst.watcher.get_openai_client')
    def test_make_groq_client(self, mock_get_openai_client):
        # Arrange
        api_key = "test_groq_key"

        # Act
        make_groq_client(api_key)

        # Assert
        mock_get_openai_client.assert_called_once_with(api_key, "https://api.groq.com/openai/v1")

    @patch('ShadowAnalyst.watcher.get_openai_client')
    def test_make_gemini_client(self, mock_get_openai_client):
        # Arrange
        api_key = "test_gemini_key"

        # Act
        make_gemini_client(api_key)

        # Assert
        mock_get_openai_client.assert_called_once_with(api_key, "https://generativelanguage.googleapis.com/v1beta/openai/")

if __name__ == '__main__':
    unittest.main()
