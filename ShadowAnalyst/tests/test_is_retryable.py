import unittest
from gui.app import is_retryable

class TestIsRetryable(unittest.TestCase):

    def test_non_retryable_errors(self):
        """Test that errors indicating a hard stop (e.g. rate limit, auth) return False."""
        non_retryable_cases = [
            Exception("HTTP Error 429: Too Many Requests"),
            Exception("too many requests to the server"),
            Exception("Error 401: Unauthorized access"),
            Exception("Unauthorized access to API"),
            Exception("Error 403: Forbidden"),
            Exception("invalid api key provided"),
            Exception("429"),
            Exception("401"),
            Exception("403"),
            Exception("invalid"),
            Exception("TOO MANY REQUESTS")  # Case insensitivity test
        ]

        for exc in non_retryable_cases:
            with self.subTest(exc=exc):
                self.assertFalse(is_retryable(exc), f"Expected False for: {exc}")

    def test_retryable_errors(self):
        """Test that other errors (e.g., timeouts, connection issues) return True."""
        retryable_cases = [
            Exception("ConnectionTimeoutError"),
            Exception("RemoteDisconnected"),
            Exception("ConnectionError"),
            Exception("SSLError"),
            Exception("ProxyError"),
            Exception("Network is unreachable"),
            Exception("OSError: [Errno 104] Connection reset by peer"),
            Exception("500 Internal Server Error"),
            Exception("503 Service Unavailable"),
            Exception("unknown error occurred"),
            Exception("")
        ]

        for exc in retryable_cases:
            with self.subTest(exc=exc):
                self.assertTrue(is_retryable(exc), f"Expected True for: {exc}")

if __name__ == "__main__":
    unittest.main()
