import unittest
from gui.app import is_retryable

class TestAppIsRetryable(unittest.TestCase):
    def test_non_retryable_exceptions(self):
        """Test that specific keywords correctly identify non-retryable exceptions."""
        non_retryable_messages = [
            "Error 429: Too many requests",
            "Too Many Requests error",
            "HTTP 401 Unauthorized",
            "User is unauthorized",
            "Access denied (403)",
            "Invalid input provided",
            "API key is invalid",
        ]

        for msg in non_retryable_messages:
            with self.subTest(msg=msg):
                self.assertFalse(is_retryable(Exception(msg)))

    def test_retryable_exceptions(self):
        """Test that other types of exceptions are considered retryable."""
        retryable_messages = [
            "Connection timeout",
            "HTTP 500 Internal Server Error",
            "502 Bad Gateway",
            "Network unreachable",
            "Unexpected error occurred",
            "SSL certificate verify failed",
        ]

        for msg in retryable_messages:
            with self.subTest(msg=msg):
                self.assertTrue(is_retryable(Exception(msg)))

    def test_empty_and_generic_exceptions(self):
        """Test how generic exceptions are handled."""
        self.assertTrue(is_retryable(Exception()))
        self.assertTrue(is_retryable(Exception("")))
        self.assertTrue(is_retryable(ValueError("Something went wrong")))

if __name__ == '__main__':
    unittest.main()
