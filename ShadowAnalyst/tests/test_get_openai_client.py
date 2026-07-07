import unittest
from ShadowAnalyst.watcher import get_openai_client, _clients_cache

class TestGetOpenAIClient(unittest.TestCase):
    def setUp(self):
        # Clear the cache before each test to ensure tests are isolated
        _clients_cache.clear()

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
        self.assertEqual(len(_clients_cache), 1, "There should be only one entry in the cache")

    def test_get_openai_client_different_args(self):
        # Act
        client1 = get_openai_client("test_key1", "http://test_url1")
        client2 = get_openai_client("test_key2", "http://test_url2")

        # Assert
        self.assertIsNot(client1, client2, "Clients with different credentials should not be the same instance")
        self.assertEqual(len(_clients_cache), 2, "There should be two entries in the cache")

    def test_get_openai_client_no_api_key(self):
        # Act
        client = get_openai_client(None, "http://test_url")

        # Assert
        self.assertEqual(client.api_key, "dummy_key", "If no api_key is provided, it should default to 'dummy_key'")

if __name__ == '__main__':
    unittest.main()
