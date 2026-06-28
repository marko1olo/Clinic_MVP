from __future__ import annotations

import unittest
from unittest.mock import MagicMock
from unittest.mock import patch

from clinic_admin.seo_agent import generate_seo_response
from clinic_admin.seo_agent import get_groq_api_key


class TestSEOAgent(unittest.TestCase):
    @patch('builtins.open')
    def test_get_groq_api_key_error_path(self, mock_open):
        # Configure the mock to raise an IOError when open() is called
        mock_open.side_effect = IOError('Simulated IOError for testing')

        # Call the function
        result = get_groq_api_key()

        # Verify the exception was caught and handled correctly
        self.assertIsNone(result)

    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_missing_api_key(self, mock_get_api_key):
        # Setup: Return None to simulate missing API key
        mock_get_api_key.return_value = None

        # Execute
        result = generate_seo_response('Good doctor.')

        # Verify
        self.assertEqual(
            result, 'Ошибка: Не найден API ключ Groq в конфигурации.')
        mock_get_api_key.assert_called_once()

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_happy_path_success(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and successful request
        mock_get_api_key.return_value = 'fake-api-key'

        mock_response = MagicMock()
        mock_response.json.return_value = {
            'choices': [
                {'message': {'content': '   Спасибо за отзыв!   '}},
            ],
        }
        mock_post.return_value = mock_response

        # Execute
        result = generate_seo_response('Good doctor.')

        # Verify
        self.assertEqual(result, 'Спасибо за отзыв!')
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()

    @patch('clinic_admin.seo_agent.requests.post')
    @patch('clinic_admin.seo_agent.get_groq_api_key')
    def test_request_exception(self, mock_get_api_key, mock_post):
        # Setup: Simulate valid API key and failed request (e.g., timeout)
        mock_get_api_key.return_value = 'fake-api-key'
        mock_post.side_effect = Exception('Connection timed out')

        # Execute
        result = generate_seo_response('Good doctor.')

        # Verify
        self.assertTrue(result.startswith('Ошибка генерации: '))
        self.assertIn('Connection timed out', result)
        mock_get_api_key.assert_called_once()
        mock_post.assert_called_once()


if __name__ == '__main__':
    unittest.main()
