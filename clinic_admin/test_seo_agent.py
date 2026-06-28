import unittest
import json
from unittest.mock import patch, MagicMock, mock_open
from clinic_admin.seo_agent import generate_seo_response, get_groq_api_key, CONFIG_PATH

class TestSEOAgent(unittest.TestCase):
    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps({"groq_api_keys": ["key1", "key2"]}))
    @patch('clinic_admin.seo_agent.random.choice')
    def test_get_groq_api_key_success(self, mock_random_choice, mock_file):
        # Setup
        mock_random_choice.return_value = "key1"

        # Execute
        result = get_groq_api_key()

        # Verify
        self.assertEqual(result, "key1")
        mock_file.assert_called_once_with(CONFIG_PATH, "r", encoding="utf-8")
        mock_random_choice.assert_called_once_with(["key1", "key2"])

    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps({"groq_api_keys": []}))
    def test_get_groq_api_key_empty(self, mock_file):
        # Execute
        result = get_groq_api_key()

        # Verify
        self.assertIsNone(result)
        mock_file.assert_called_once_with(CONFIG_PATH, "r", encoding="utf-8")

    @patch('builtins.open')
    def test_get_groq_api_key_error_path(self, mock_open):
        # Configure the mock to raise an IOError when open() is called
        mock_open.side_effect = IOError("Simulated IOError for testing")

        # Call the function
        result = get_groq_api_key()

        # Verify the exception was caught and handled correctly
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

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_generate_seo_response_payload(self, mock_get_api_key, mock_post):
        # Setup
        mock_get_api_key.return_value = "fake-api-key"
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "choices": [
                {"message": {"content": "Спасибо"}}
            ]
        }
        mock_post.return_value = mock_response

        # Execute
        review = "Great clinic!"
        generate_seo_response(review)

        # Verify call arguments
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertEqual(args[0], "https://api.groq.com/openai/v1/chat/completions")
        self.assertEqual(kwargs["headers"], {
            "Authorization": "Bearer fake-api-key",
            "Content-Type": "application/json"
        })
        self.assertEqual(kwargs["timeout"], 15)
        self.assertEqual(kwargs["json"]["model"], "llama-3.3-70b-versatile")
        self.assertEqual(kwargs["json"]["temperature"], 0.7)
        self.assertEqual(kwargs["json"]["max_tokens"], 512)
        self.assertEqual(len(kwargs["json"]["messages"]), 2)
        self.assertEqual(kwargs["json"]["messages"][1]["role"], "user")
        self.assertIn(review, kwargs["json"]["messages"][1]["content"])


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

if __name__ == '__main__':
    unittest.main()
