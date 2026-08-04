import unittest
from unittest.mock import patch, MagicMock, mock_open
from clinic_admin.seo_agent import generate_seo_response, get_groq_api_key

class TestSEOAgent(unittest.TestCase):
    def setUp(self):
        import clinic_admin.seo_agent
        clinic_admin.seo_agent._cached_groq_keys = None

    @patch('builtins.open')
    def test_get_groq_api_key_error_path(self, mock_open):
        # Configure the mock to raise an IOError when open() is called
        mock_open.side_effect = IOError("Simulated IOError for testing")

        # Call the function
        result = get_groq_api_key()

        # Verify the exception was caught and handled correctly
        self.assertIsNone(result)

    @patch('builtins.open')
    def test_get_groq_api_key_file_not_found(self, mock_open):
        # Configure the mock to raise a FileNotFoundError when open() is called
        mock_open.side_effect = FileNotFoundError("Simulated FileNotFoundError for testing")

        # Call the function
        result = get_groq_api_key()

        # Verify the exception was caught and handled correctly
        self.assertIsNone(result)

    @patch('builtins.open', new_callable=mock_open, read_data='invalid json')
    @patch('clinic_admin.seo_agent.json.load')
    def test_get_groq_api_key_json_error(self, mock_json_load, mock_file):
        # Configure the mock to raise an exception when json.load() is called
        mock_json_load.side_effect = ValueError("Simulated JSON Decode Error for testing")

        # Call the function
        result = get_groq_api_key()

        # Verify the exception was caught and handled correctly
        self.assertIsNone(result)

    @patch('builtins.open', new_callable=mock_open, read_data='invalid json')
    @patch('builtins.print')
    def test_get_groq_api_key_json_parsing_failure(self, mock_print, mock_file):
        # Call the function
        result = get_groq_api_key()

        # Verify the exception was caught, handled, printed and None returned
        self.assertIsNone(result)
        mock_print.assert_called_once()
        self.assertTrue(mock_print.call_args[0][0].startswith("Error loading config: Expecting value"))

    @patch('builtins.open', new_callable=mock_open, read_data='{"groq_api_keys": ["key1", "key2"]}')
    @patch('clinic_admin.seo_agent.random.choice')
    def test_get_groq_api_key_success(self, mock_choice, mock_file):
        # Configure the mock to return a specific key when choice is called
        mock_choice.return_value = "key1"

        # Call the function
        result = get_groq_api_key()

        # Verify the key was retrieved properly
        self.assertEqual(result, "key1")
        mock_choice.assert_called_once_with(["key1", "key2"])

    @patch('builtins.open', new_callable=mock_open, read_data='{"groq_api_keys": []}')
    def test_get_groq_api_key_empty(self, mock_file):
        # Call the function
        result = get_groq_api_key()

        # Verify we get None when no keys exist
        self.assertIsNone(result)

    @patch('builtins.open', new_callable=mock_open, read_data='{}')
    def test_get_groq_api_key_missing_key(self, mock_file):
        # Call the function
        result = get_groq_api_key()

        # Verify we get None when the key doesn't exist
        self.assertIsNone(result)

    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_missing_api_key(self, mock_get_api_key):
        # Setup: Return None to simulate missing API key
        mock_get_api_key.return_value = None

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertEqual(result, "Ошибка: Не найден API ключ Groq в конфигурации.")
        mock_get_api_key.assert_called_once()

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_happy_path_success(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and successful request
        mock_get_api_key.return_value = "fake-api-key"

        mock_response = MagicMock()
        mock_response.json.return_value = {
            "choices": [
                {"message": {"content": "   Спасибо за отзыв!   "}}
            ]
        }
        mock_post.return_value = mock_response

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertEqual(result, "Спасибо за отзыв!")
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()

        # Check payload
        called_args, called_kwargs = mock_post.call_args
        self.assertEqual(called_args[0], "https://api.groq.com/openai/v1/chat/completions")
        self.assertEqual(called_kwargs["headers"]["Authorization"], "Bearer fake-api-key")
        self.assertEqual(called_kwargs["json"]["model"], "llama-3.3-70b-versatile")
        self.assertEqual(called_kwargs["json"]["messages"][1]["content"], "Вот текст отзыва: \"Good doctor.\"\n\nНапиши ответ.")

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_request_exception(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and failed request (e.g., timeout)
        mock_get_api_key.return_value = "fake-api-key"
        mock_post.side_effect = Exception("Connection timed out")

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertTrue(result.startswith("Ошибка генерации: "))
        self.assertIn("Connection timed out", result)
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_malformed_response(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and successful request but malformed JSON (missing choices)
        mock_get_api_key.return_value = "fake-api-key"

        mock_response = MagicMock()
        mock_response.json.return_value = {
            "unrelated_key": "some_value"
        }
        mock_post.return_value = mock_response

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertTrue(result.startswith("Ошибка генерации: "))
        self.assertIn("choices", result)
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()


    def test_get_groq_api_key_cached(self):
        import clinic_admin.seo_agent
        original_cache = clinic_admin.seo_agent._cached_groq_keys
        try:
            clinic_admin.seo_agent._cached_groq_keys = ["cached1", "cached2"]
            with patch('clinic_admin.seo_agent.random.choice') as mock_choice:
                mock_choice.return_value = "cached1"
                result = get_groq_api_key()
                self.assertEqual(result, "cached1")
                mock_choice.assert_called_once_with(["cached1", "cached2"])
        finally:
            clinic_admin.seo_agent._cached_groq_keys = original_cache

    def test_get_groq_api_key_cached_empty(self):
        import clinic_admin.seo_agent
        original_cache = clinic_admin.seo_agent._cached_groq_keys
        try:
            clinic_admin.seo_agent._cached_groq_keys = []
            result = get_groq_api_key()
            self.assertIsNone(result)
        finally:
            clinic_admin.seo_agent._cached_groq_keys = original_cache

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_empty_review_text(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and successful request for empty text
        mock_get_api_key.return_value = "fake-api-key"

        mock_response = MagicMock()
        mock_response.json.return_value = {
            "choices": [
                {"message": {"content": "Спасибо за отзыв!"}}
            ]
        }
        mock_post.return_value = mock_response

        # Execute
        result = generate_seo_response("")

        # Verify
        self.assertEqual(result, "Спасибо за отзыв!")
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()

    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_generate_seo_response_missing_api_key_error(self, mock_get_api_key):
        # Setup: Return None to simulate missing API key
        mock_get_api_key.return_value = None

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertEqual(result, "Ошибка: Не найден API ключ Groq в конфигурации.")
        mock_get_api_key.assert_called_once()

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_request_http_error(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and HTTPError
        import requests
        mock_get_api_key.return_value = "fake-api-key"

        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("404 Client Error")
        mock_post.return_value = mock_response

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertTrue(result.startswith("Ошибка генерации: "))
        self.assertIn("404 Client Error", result)
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_request_timeout(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and Timeout
        import requests
        mock_get_api_key.return_value = "fake-api-key"
        mock_post.side_effect = requests.exceptions.Timeout("Read timed out")

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertTrue(result.startswith("Ошибка генерации: "))
        self.assertIn("Read timed out", result)
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_request_json_decode_error(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and JSONDecodeError on response.json()
        import requests
        mock_get_api_key.return_value = "fake-api-key"

        mock_response = MagicMock()
        mock_response.json.side_effect = requests.exceptions.JSONDecodeError("Expecting value", "", 0)
        mock_post.return_value = mock_response

        # Execute
        result = generate_seo_response("Good doctor.")

        # Verify
        self.assertTrue(result.startswith("Ошибка генерации: "))
        self.assertIn("Expecting value", result)
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()
        mock_response.json.assert_called_once()

if __name__ == '__main__':
    unittest.main()
