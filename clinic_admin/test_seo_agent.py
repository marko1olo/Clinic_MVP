import unittest
from unittest.mock import patch, MagicMock, mock_open
from clinic_admin.seo_agent import generate_seo_response, get_groq_api_key

class TestSEOAgent(unittest.TestCase):
    def setUp(self):
        import clinic_admin.seo_agent
        clinic_admin.seo_agent._cached_groq_keys = None

    @patch('builtins.open', new_callable=mock_open, read_data='{"groq_api_keys": ["key1", "key2"]}')
    @patch('clinic_admin.seo_agent.random.choice')
    def test_get_groq_api_key_valid(self, mock_choice, mock_file):
        # Test the happy path where a valid config exists
        mock_choice.return_value = "key1"
        result = get_groq_api_key()
        self.assertEqual(result, "key1")
        mock_choice.assert_called_once_with(["key1", "key2"])

    @patch('builtins.open')
    def test_get_groq_api_key_io_error(self, mock_open):
        # Test handling of IOError (e.g., file not found)
        mock_open.side_effect = IOError("Simulated IOError for testing")
        result = get_groq_api_key()
        self.assertIsNone(result)

    @patch('builtins.open', new_callable=mock_open, read_data='invalid json content')
    def test_get_groq_api_key_json_decode_error(self, mock_file):
        # Test handling of malformed JSON
        result = get_groq_api_key()
        self.assertIsNone(result)

    @patch('builtins.open', new_callable=mock_open, read_data='{"groq_api_keys": []}')
    def test_get_groq_api_key_empty_list(self, mock_file):
        # Test behavior when the keys list is empty
        result = get_groq_api_key()
        self.assertIsNone(result)

    @patch('builtins.open', new_callable=mock_open, read_data='{}')
    def test_get_groq_api_key_missing_key(self, mock_file):
        # Test behavior when 'groq_api_keys' is not in the JSON object
        result = get_groq_api_key()
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

if __name__ == '__main__':
    unittest.main()
