import unittest
from unittest.mock import patch, MagicMock
from clinic_admin.seo_agent import generate_seo_response

class TestSEOAgent(unittest.TestCase):
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_missing_api_key(self, mock_get_key):
        mock_get_key.return_value = None
        result = generate_seo_response("Test review")
        self.assertEqual(result, "Ошибка: Не найден API ключ Groq в конфигурации.")

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_successful_generation(self, mock_get_key, mock_post):
        mock_get_key.return_value = "fake_api_key"

        # Mock the response from requests.post
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": "  Mocked SEO response  "
                    }
                }
            ]
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        result = generate_seo_response("Good review!")
        self.assertEqual(result, "Mocked SEO response")

        # Verify the mock was called correctly
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertEqual(args[0], "https://api.groq.com/openai/v1/chat/completions")
        self.assertEqual(kwargs['headers']["Authorization"], "Bearer fake_api_key")
        self.assertEqual(kwargs['timeout'], 15)
        self.assertIn("Good review!", kwargs['json']['messages'][1]['content'])

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_api_error_handling(self, mock_get_key, mock_post):
        mock_get_key.return_value = "fake_api_key"

        # Simulate a network or HTTP error
        mock_post.side_effect = Exception("Connection Timeout")

        result = generate_seo_response("Bad review!")
        self.assertEqual(result, "Ошибка генерации: Connection Timeout")

if __name__ == '__main__':
    unittest.main()
