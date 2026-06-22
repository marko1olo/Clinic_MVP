import unittest
from unittest.mock import patch, MagicMock, mock_open
import base64

# Import functions to test
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from watcher import prepare_image, analyze_image

class TestWatcher(unittest.TestCase):

    @patch('watcher.Image.open')
    def test_prepare_image_success(self, mock_image_open):
        mock_img = MagicMock()
        mock_img.mode = 'RGB'
        mock_img.size = (800, 600)

        # When used as context manager
        mock_image_open.return_value.__enter__.return_value = mock_img

        # Mock save to write some data
        def mock_save(buffer, *args, **kwargs):
            buffer.write(b"dummy_image_data")

        mock_img.save.side_effect = mock_save

        result = prepare_image('dummy_path.jpg')

        self.assertIsNotNone(result)
        self.assertTrue(result.startswith('data:image/jpeg;base64,'))
        expected_base64 = base64.b64encode(b"dummy_image_data").decode('utf-8')
        self.assertIn(expected_base64, result)

    @patch('watcher.Image.open')
    def test_prepare_image_failure(self, mock_image_open):
        mock_image_open.side_effect = Exception("File not found")

        result = prepare_image('dummy_path.jpg')

        self.assertIsNone(result)

    @patch('watcher.prepare_image')
    @patch('builtins.open', new_callable=mock_open, read_data="Dummy prompt")
    @patch('watcher.OpenAI')
    def test_analyze_image_success(self, mock_openai_class, mock_file_open, mock_prepare_image):
        mock_prepare_image.return_value = "dummy_base64"

        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_response = MagicMock()
        mock_response.choices[0].message.content.strip.return_value = "Mock report"
        mock_client.chat.completions.create.return_value = mock_response

        res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Mock report")

    @patch('watcher.prepare_image')
    def test_analyze_image_image_prep_fails(self, mock_prepare_image):
        mock_prepare_image.return_value = None

        res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Ошибка обработки файла")

    @patch('watcher.prepare_image')
    @patch('builtins.open', new_callable=mock_open, read_data="Dummy prompt")
    @patch('watcher.OpenAI')
    def test_analyze_image_rate_limit_retry(self, mock_openai_class, mock_file_open, mock_prepare_image):
        mock_prepare_image.return_value = "dummy_base64"

        # We need the first create call to fail with 429, second to succeed
        mock_client1 = MagicMock()
        mock_client1.chat.completions.create.side_effect = Exception("HTTP 429 Too Many Requests")

        mock_client2 = MagicMock()
        mock_response2 = MagicMock()
        mock_response2.choices[0].message.content.strip.return_value = "Success on retry"
        mock_client2.chat.completions.create.return_value = mock_response2

        mock_openai_class.side_effect = [mock_client1, mock_client2]

        # Patching GROQ_API_KEYS to have 2 keys so we can retry
        with patch('watcher.GROQ_API_KEYS', ['key1', 'key2']):
            res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Success on retry")

    @patch('watcher.prepare_image')
    @patch('builtins.open', new_callable=mock_open, read_data="Dummy prompt")
    @patch('watcher.OpenAI')
    def test_analyze_image_all_keys_fail(self, mock_openai_class, mock_file_open, mock_prepare_image):
        mock_prepare_image.return_value = "dummy_base64"

        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = Exception("HTTP 429 Too Many Requests")
        mock_openai_class.return_value = mock_client

        with patch('watcher.GROQ_API_KEYS', ['key1', 'key2']):
            res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Сбой: Все ключи Groq исчерпали лимиты (429).")

    @patch('watcher.prepare_image')
    @patch('builtins.open', new_callable=mock_open, read_data="Dummy prompt")
    @patch('watcher.OpenAI')
    def test_analyze_image_general_error(self, mock_openai_class, mock_file_open, mock_prepare_image):
        mock_prepare_image.return_value = "dummy_base64"

        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = Exception("Some unknown error")
        mock_openai_class.return_value = mock_client

        with patch('watcher.GROQ_API_KEYS', ['key1', 'key2']):
            res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Сбой ИИ-анализа: Some unknown error")

if __name__ == '__main__':
    unittest.main()
