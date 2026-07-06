import os
import base64
import tempfile
import shutil
import unittest
from io import BytesIO
import pytest
from PIL import Image
from unittest.mock import patch, MagicMock

# Import the module to be tested
from ShadowAnalyst import watcher

class TestWatcher(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.mkdtemp()
        # Clear client cache to ensure test isolation
        if hasattr(watcher, "_clients_cache"):
            watcher._clients_cache.clear()

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    def test_setup_dirs_success(self):
        watch_dir = os.path.join(self.tmp_dir, "mock_watch")
        processed_dir = os.path.join(self.tmp_dir, "mock_processed")

        with patch('ShadowAnalyst.watcher.WATCH_DIR', watch_dir), \
             patch('ShadowAnalyst.watcher.PROCESSED_DIR', processed_dir):
            watcher.setup_dirs()

            # Check if directories were created
            self.assertTrue(os.path.exists(watch_dir))
            self.assertTrue(os.path.exists(processed_dir))
            self.assertTrue(os.path.isdir(watch_dir))
            self.assertTrue(os.path.isdir(processed_dir))

    def test_setup_dirs_existing(self):
        watch_dir = os.path.join(self.tmp_dir, "mock_watch_ext")
        processed_dir = os.path.join(self.tmp_dir, "mock_processed_ext")

        # Pre-create the directories
        os.makedirs(watch_dir)
        os.makedirs(processed_dir)

        with patch('ShadowAnalyst.watcher.WATCH_DIR', watch_dir), \
             patch('ShadowAnalyst.watcher.PROCESSED_DIR', processed_dir):
            # Should not raise an exception when directories already exist
            watcher.setup_dirs()

            # Verify they still exist
            self.assertTrue(os.path.exists(watch_dir))
            self.assertTrue(os.path.exists(processed_dir))

    @patch('ShadowAnalyst.watcher.os.makedirs')
    def test_setup_dirs_error(self, mock_makedirs):
        # Simulate an OSError during directory creation
        mock_makedirs.side_effect = OSError("Permission denied")

        with patch('ShadowAnalyst.watcher.WATCH_DIR', '/tmp/mock_watch'), \
             patch('ShadowAnalyst.watcher.PROCESSED_DIR', '/tmp/mock_processed'):
            # The exception should propagate up
            with self.assertRaises(OSError) as context:
                watcher.setup_dirs()

            self.assertIn("Permission denied", str(context.exception))

    def test_prepare_image_normal(self):
        # Create a small RGB image in memory
        img = Image.new('RGB', (100, 100), color = 'red')

        with patch('PIL.Image.open') as mock_open:
            mock_open.return_value.__enter__.return_value = img
            # Call prepare_image
            result = watcher.prepare_image("dummy_path.jpg")

        # Assert return value starts with the right prefix
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith("data:image/jpeg;base64,"))

        # Verify we can decode it back to an image
        b64_data = result.split(",", 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(decoded_img.size, (100, 100))

    def test_prepare_image_resize(self):
        # Create a large image that needs resizing in memory
        img = Image.new('RGB', (2000, 1500), color = 'blue')

        with patch('PIL.Image.open') as mock_open:
            mock_open.return_value.__enter__.return_value = img
            # Call prepare_image
            result = watcher.prepare_image("dummy_path.jpg")

        # Assert
        self.assertIsNotNone(result)

        # Decode and check size
        b64_data = result.split(",", 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(max(decoded_img.size), 1000)
            self.assertEqual(decoded_img.size, (1000, 750))

    def test_prepare_image_non_rgb(self):
        # Create an RGBA image in memory
        img = Image.new('RGBA', (200, 200), color = (255, 0, 0, 128))

        with patch('PIL.Image.open') as mock_open:
            mock_open.return_value.__enter__.return_value = img
            # Call prepare_image
            result = watcher.prepare_image("dummy_path.jpg")

        # Assert
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith("data:image/jpeg;base64,"))

        # Decode and check mode
        b64_data = result.split(",", 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(decoded_img.mode, 'RGB')

    def test_prepare_image_error(self):
        with patch('PIL.Image.open') as mock_open:
            # Make the open raise an error
            mock_open.side_effect = Exception("Mocked error")

            # Call prepare_image
            result = watcher.prepare_image("does_not_exist.jpg")

        # Assert
        self.assertIsNone(result)

    @patch('ShadowAnalyst.watcher.Image.open')
    def test_prepare_image_exception(self, mock_image_open):
        # Set the side effect to raise an exception
        mock_image_open.side_effect = Exception("Mocked error")

        # Call prepare_image
        img_path = os.path.join(self.tmp_dir, "mock_error.jpg")
        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNone(result)
        mock_image_open.assert_called_once_with(img_path)

    def test_prepare_image_non_existent_file(self):
        # Call prepare_image with a file that doesn't exist (no mocking)
        result = watcher.prepare_image(os.path.join(self.tmp_dir, "definitely_does_not_exist.jpg"))

        # Assert
        self.assertIsNone(result)

    def test_prepare_image_invalid_file(self):
        # Call prepare_image with a text file masquerading as an image (no mocking)
        img_path = os.path.join(self.tmp_dir, "invalid_image.jpg")
        with open(img_path, 'w') as f:
            f.write("This is not a valid image file")

        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNone(result)

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_success(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        # Setup mock OpenAI client
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        # Setup mock response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "All clear"
        mock_client.chat.completions.create.return_value = mock_response

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', []):
            # Call analyze_image
            marked_path, report = watcher.analyze_image("dummy.jpg")

        # Assert
        self.assertIsNone(marked_path)
        self.assertEqual(report, "All clear")

        # Ensure client was created and create was called
        mock_openai_class.assert_called_once()
        mock_client.chat.completions.create.assert_called_once()

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_rate_limit_retry(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        # Setup mock OpenAI client instances
        mock_client_1 = MagicMock()
        mock_client_2 = MagicMock()

        # First call to create returns mock_client_1, second returns mock_client_2
        mock_openai_class.side_effect = [mock_client_1, mock_client_2]

        # First client throws a 429 exception
        mock_client_1.chat.completions.create.side_effect = Exception("HTTP 429 Too Many Requests")

        # Second client succeeds
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Success on second try"
        mock_client_2.chat.completions.create.return_value = mock_response

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1', 'gkey2']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', []):
            # Call analyze_image
            marked_path, report = watcher.analyze_image("dummy.jpg")

        # Assert
        self.assertIsNone(marked_path)
        self.assertEqual(report, "Success on second try")

        # Ensure client was created twice
        self.assertEqual(mock_openai_class.call_count, 2)
        mock_client_1.chat.completions.create.assert_called_once()
        mock_client_2.chat.completions.create.assert_called_once()

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_rate_limit_exhausted(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        # Setup mock OpenAI client instance
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        # Client always throws a 429 exception
        mock_client.chat.completions.create.side_effect = Exception("HTTP 429 Too Many Requests")

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', ['groqkey1']):
            # Call analyze_image
            marked_path, report = watcher.analyze_image("dummy.jpg")

        # Assert
        self.assertIsNone(marked_path)
        self.assertIn("все ключи исчерпаны", report)

        # Gemini 3.5 (1 key) + Gemini 3.1 (cached 1 key) + Groq (1 key) = 2 calls
        self.assertEqual(mock_openai_class.call_count, 2)

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_prepare_failed(self, mock_openai_class, mock_prepare_image):
        # Setup mock to return None (failure)
        mock_prepare_image.return_value = None

        # Call analyze_image
        marked_path, report = watcher.analyze_image("dummy.jpg")

        # Assert
        self.assertIsNone(marked_path)
        self.assertEqual(report, "Ошибка обработки файла")

        # Ensure OpenAI was not called
        mock_openai_class.assert_not_called()

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_think_tags_stripped(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "<think>Thoughts process...</think>\nActual report"
        mock_client.chat.completions.create.return_value = mock_response

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', []):
            marked_path, report = watcher.analyze_image("dummy.jpg")

        self.assertEqual(report, "Actual report")

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_empty_api_key_skipped(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Valid response"
        mock_client.chat.completions.create.return_value = mock_response

        # Use an empty string and a valid string
        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['', 'gkey1']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', []), \
             patch('random.shuffle', lambda x: x): # Keep order so empty key is checked first
            marked_path, report = watcher.analyze_image("dummy.jpg")

        self.assertEqual(report, "Valid response")
        # Should only be instantiated once for the valid key
        self.assertEqual(mock_openai_class.call_count, 1)
        mock_openai_class.assert_called_with(api_key='gkey1', base_url='https://generativelanguage.googleapis.com/v1beta/openai/', timeout=30.0, max_retries=0)

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_provider_cascade(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        mock_gemini_client = MagicMock()
        mock_groq_client = MagicMock()

        def openai_side_effect(api_key, base_url, timeout, max_retries):
            if "google" in base_url:
                return mock_gemini_client
            elif "groq" in base_url:
                return mock_groq_client
            return MagicMock()

        mock_openai_class.side_effect = openai_side_effect

        # Gemini fails
        mock_gemini_client.chat.completions.create.side_effect = Exception("Gemini fails")

        # Groq succeeds
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Groq success"
        mock_groq_client.chat.completions.create.return_value = mock_response

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', ['groqkey1']):
            marked_path, report = watcher.analyze_image("dummy.jpg")

        self.assertEqual(report, "Groq success")
        # Ensure groq was called
        mock_groq_client.chat.completions.create.assert_called_once()
        self.assertTrue(mock_gemini_client.chat.completions.create.call_count > 0)

    @patch('ShadowAnalyst.watcher.prepare_image')
    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_analyze_image_empty_choices(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        # Response with empty choices array
        mock_response = MagicMock()
        mock_response.choices = []
        mock_client.chat.completions.create.return_value = mock_response

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', []):
            marked_path, report = watcher.analyze_image("dummy.jpg")

        # Should exhaust keys because none return a valid message
        self.assertIsNone(marked_path)
        self.assertIn("все ключи исчерпаны", report)

if __name__ == '__main__':
    unittest.main()

from unittest.mock import patch, MagicMock, mock_open

# Import functions to test
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from watcher import prepare_image, analyze_image


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

        self.assertTrue(result.startswith('data:image/jpeg;base64,'))
        expected_base64 = base64.b64encode(b"dummy_image_data").decode('utf-8')
        self.assertIn(expected_base64, result)

    @patch('watcher.Image.open')
    def test_prepare_image_failure(self, mock_image_open):
        mock_image_open.side_effect = Exception("File not found")

        result = prepare_image('dummy_path.jpg')


    @patch('watcher.prepare_image')
    @patch('builtins.open', new_callable=mock_open, read_data="Dummy prompt")
    @patch('watcher.OpenAI')
    def test_analyze_image_success(self, mock_openai_class, mock_file_open, mock_prepare_image):
        mock_prepare_image.return_value = "dummy_base64"


        mock_response.choices[0].message.content.strip.return_value = "Mock report"

        res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Mock report")

    @patch('watcher.prepare_image')
    def test_analyze_image_image_prep_fails(self, mock_prepare_image):

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


        with patch('watcher.GROQ_API_KEYS', ['key1', 'key2']):
            res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Сбой: Все ключи Groq исчерпали лимиты (429).")

    @patch('watcher.prepare_image')
    @patch('builtins.open', new_callable=mock_open, read_data="Dummy prompt")
    @patch('watcher.OpenAI')
    def test_analyze_image_general_error(self, mock_openai_class, mock_file_open, mock_prepare_image):
        mock_prepare_image.return_value = "dummy_base64"

        mock_client.chat.completions.create.side_effect = Exception("Some unknown error")

        with patch('watcher.GROQ_API_KEYS', ['key1', 'key2']):
            res1, res2 = analyze_image('dummy_path.jpg')

        self.assertIsNone(res1)
        self.assertEqual(res2, "Сбой ИИ-анализа: Some unknown error")

def test_prepare_image_normal(tmp_path):
    # Create a small RGB image
    img_path = tmp_path / "normal.jpg"
    img.save(img_path)

    result = watcher.prepare_image(str(img_path))

    assert result is not None
    assert result.startswith("data:image/jpeg;base64,")

        assert decoded_img.size == (100, 100)

def test_prepare_image_resize(tmp_path):
    # Create a large image that needs resizing
    img_path = tmp_path / "large.jpg"
    img.save(img_path)

    result = watcher.prepare_image(str(img_path))

    assert result is not None

        assert max(decoded_img.size) == 1000
        assert decoded_img.size == (1000, 750) # Assuming aspect ratio is maintained

def test_prepare_image_non_rgb(tmp_path):
    # Create an RGBA image
    img_path = tmp_path / "rgba.png"
    img.save(img_path)

    result = watcher.prepare_image(str(img_path))

    assert result is not None
    assert result.startswith("data:image/jpeg;base64,")

        assert decoded_img.mode == 'RGB'

def test_prepare_image_error(tmp_path):
    # Pass a non-existent file
    img_path = tmp_path / "does_not_exist.jpg"

    result = watcher.prepare_image(str(img_path))

    assert result is None

def test_analyze_image_success(mock_openai_class, mock_prepare_image):




    assert marked_path is None
    assert report == "All clear"

    mock_openai_class.assert_called()

def test_analyze_image_rate_limit_retry(mock_openai_class, mock_prepare_image):






    assert marked_path is None
    assert report == "Success on second try"

    assert mock_openai_class.call_count == 2

def test_analyze_image_rate_limit_exhausted(mock_openai_class, mock_prepare_image):




    assert marked_path is None
    assert report == "Сбой: Все ключи Groq исчерпали лимиты (429)."

    # Ensure client was created as many times as there are API keys
    assert mock_openai_class.call_count == len(watcher.GROQ_API_KEYS)

def test_analyze_image_prepare_failed(mock_openai_class, mock_prepare_image):


    assert marked_path is None
    assert report == "Ошибка обработки файла"

