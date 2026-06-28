from __future__ import annotations

import base64
import os
import shutil
import tempfile
import unittest
from io import BytesIO
from unittest.mock import MagicMock
from unittest.mock import patch

from PIL import Image

from ShadowAnalyst import watcher
# Import the module to be tested


class TestWatcher(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.mkdtemp()
        # Clear client cache to ensure test isolation
        if hasattr(watcher, '_clients_cache'):
            watcher._clients_cache.clear()

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    def test_prepare_image_normal(self):
        # Create a small RGB image
        img = Image.new('RGB', (100, 100), color='red')
        img_path = os.path.join(self.tmp_dir, 'normal.jpg')
        img.save(img_path)

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert return value starts with the right prefix
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith('data:image/jpeg;base64,'))

        # Verify we can decode it back to an image
        b64_data = result.split(',', 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(decoded_img.size, (100, 100))

    def test_prepare_image_resize(self):
        # Create a large image that needs resizing
        img = Image.new('RGB', (2000, 1500), color='blue')
        img_path = os.path.join(self.tmp_dir, 'large.jpg')
        img.save(img_path)

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNotNone(result)

        # Decode and check size
        b64_data = result.split(',', 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(max(decoded_img.size), 1000)
            self.assertEqual(decoded_img.size, (1000, 750))

    def test_prepare_image_non_rgb(self):
        # Create an RGBA image
        img = Image.new('RGBA', (200, 200), color=(255, 0, 0, 128))
        img_path = os.path.join(self.tmp_dir, 'rgba.png')
        img.save(img_path)

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith('data:image/jpeg;base64,'))

        # Decode and check mode
        b64_data = result.split(',', 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(decoded_img.mode, 'RGB')

    def test_prepare_image_error(self):
        # Pass a non-existent file
        img_path = os.path.join(self.tmp_dir, 'does_not_exist.jpg')

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNone(result)

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_success(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = 'data:image/jpeg;base64,dummybase64'

        # Setup mock OpenAI client
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        # Setup mock response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = 'All clear'
        mock_client.chat.completions.create.return_value = mock_response

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
                patch('ShadowAnalyst.watcher.GROQ_API_KEYS', []):
            # Call analyze_image
            marked_path, report = watcher.analyze_image('dummy.jpg')

        # Assert
        self.assertIsNone(marked_path)
        self.assertEqual(report, 'All clear')

        # Ensure client was created and create was called
        mock_openai_class.assert_called_once()
        mock_client.chat.completions.create.assert_called_once()

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_rate_limit_retry(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = 'data:image/jpeg;base64,dummybase64'

        # Setup mock OpenAI client instances
        mock_client_1 = MagicMock()
        mock_client_2 = MagicMock()

        # First call to create returns mock_client_1, second returns mock_client_2
        mock_openai_class.side_effect = [mock_client_1, mock_client_2]

        # First client throws a 429 exception
        mock_client_1.chat.completions.create.side_effect = Exception(
            'HTTP 429 Too Many Requests')

        # Second client succeeds
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = 'Success on second try'
        mock_client_2.chat.completions.create.return_value = mock_response

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1', 'gkey2']), \
                patch('ShadowAnalyst.watcher.GROQ_API_KEYS', []):
            # Call analyze_image
            marked_path, report = watcher.analyze_image('dummy.jpg')

        # Assert
        self.assertIsNone(marked_path)
        self.assertEqual(report, 'Success on second try')

        # Ensure client was created twice
        self.assertEqual(mock_openai_class.call_count, 2)
        mock_client_1.chat.completions.create.assert_called_once()
        mock_client_2.chat.completions.create.assert_called_once()

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_rate_limit_exhausted(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = 'data:image/jpeg;base64,dummybase64'

        # Setup mock OpenAI client instance
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        # Client always throws a 429 exception
        mock_client.chat.completions.create.side_effect = Exception(
            'HTTP 429 Too Many Requests')

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
                patch('ShadowAnalyst.watcher.GROQ_API_KEYS', ['groqkey1']):
            # Call analyze_image
            marked_path, report = watcher.analyze_image('dummy.jpg')

        # Assert
        self.assertIsNone(marked_path)
        self.assertIn('все ключи исчерпаны', report)

        # Gemini 3.5 (1 key) + Gemini 3.1 (cached 1 key) + Groq (1 key) = 2 calls
        self.assertEqual(mock_openai_class.call_count, 2)

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_prepare_failed(self, mock_openai_class, mock_prepare_image):
        # Setup mock to return None (failure)
        mock_prepare_image.return_value = None

        # Call analyze_image
        marked_path, report = watcher.analyze_image('dummy.jpg')

        # Assert
        self.assertIsNone(marked_path)
        self.assertEqual(report, 'Ошибка обработки файла')

        # Ensure OpenAI was not called
        mock_openai_class.assert_not_called()


if __name__ == '__main__':
    unittest.main()
