import os
import base64
import tempfile
import shutil
import unittest
from io import BytesIO
from PIL import Image
from unittest.mock import patch, MagicMock

# Import the module to be tested
from ShadowAnalyst import watcher

class TestWatcher(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.mkdtemp()
        # Clear client cache to ensure test isolation
        if hasattr(watcher, "get_openai_client"):
            watcher.get_openai_client.cache_clear()

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    @patch('ShadowAnalyst.watcher.OpenAI')
    def test_get_openai_client_caching(self, mock_openai_class):
        # Clear cache to ensure a clean state
        watcher.get_openai_client.cache_clear()
        mock_instance = MagicMock()
        mock_openai_class.return_value = mock_instance

        # First call (cache miss)
        client1 = watcher.get_openai_client("key1", "url1")
        self.assertEqual(client1, mock_instance)
        mock_openai_class.assert_called_once_with(
            api_key="key1",
            base_url="url1",
            timeout=30.0,
            max_retries=0
        )

        # Second call with identical arguments (cache hit)
        mock_openai_class.reset_mock()
        client2 = watcher.get_openai_client("key1", "url1")
        self.assertEqual(client2, mock_instance)
        mock_openai_class.assert_not_called()

        # Third call with different arguments (cache miss)
        client3 = watcher.get_openai_client("key2", "url2", 15.0)
        self.assertEqual(client3, mock_instance)
        mock_openai_class.assert_called_once_with(
            api_key="key2",
            base_url="url2",
            timeout=15.0,
            max_retries=0
        )

        # Fourth call with empty api_key (fallback to dummy_key)
        mock_openai_class.reset_mock()
        client4 = watcher.get_openai_client("", "url3")
        self.assertEqual(client4, mock_instance)
        mock_openai_class.assert_called_once_with(
            api_key="dummy_key",
            base_url="url3",
            timeout=30.0,
            max_retries=0
        )

    @patch('ShadowAnalyst.watcher.get_openai_client')
    def test_make_groq_client(self, mock_get_client):
        mock_get_client.return_value = "mock_client"
        client = watcher.make_groq_client("test_api_key")
        self.assertEqual(client, "mock_client")
        mock_get_client.assert_called_once_with("test_api_key", "https://api.groq.com/openai/v1")

    @patch('ShadowAnalyst.watcher.os.makedirs')
    def test_setup_dirs_success(self, mock_makedirs):
        # Patching WATCH_DIR and PROCESSED_DIR just to be sure we check the right values
        with patch('ShadowAnalyst.watcher.WATCH_DIR', '/tmp/mock_watch'), \
             patch('ShadowAnalyst.watcher.PROCESSED_DIR', '/tmp/mock_processed'):
            watcher.setup_dirs()

            # Check if os.makedirs was called correctly
            self.assertEqual(mock_makedirs.call_count, 2)
            mock_makedirs.assert_any_call('/tmp/mock_watch', exist_ok=True)
            mock_makedirs.assert_any_call('/tmp/mock_processed', exist_ok=True)

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
        # Create a small RGB image
        img = Image.new('RGB', (100, 100), color = 'red')
        img_path = os.path.join(self.tmp_dir, "normal.jpg")
        img.save(img_path)

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert return value starts with the right prefix
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith("data:image/jpeg;base64,"))

        # Verify we can decode it back to an image
        b64_data = result.split(",", 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(decoded_img.size, (100, 100))

    def test_prepare_image_resize(self):
        # Create a large image that needs resizing
        img = Image.new('RGB', (2000, 1500), color = 'blue')
        img_path = os.path.join(self.tmp_dir, "large.jpg")
        img.save(img_path)

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNotNone(result)

        # Decode and check size
        b64_data = result.split(",", 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(max(decoded_img.size), 1000)
            self.assertEqual(decoded_img.size, (1000, 750))

    def test_prepare_image_non_rgb(self):
        # Create an RGBA image
        img = Image.new('RGBA', (200, 200), color = (255, 0, 0, 128))
        img_path = os.path.join(self.tmp_dir, "rgba.png")
        img.save(img_path)

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith("data:image/jpeg;base64,"))

        # Decode and check mode
        b64_data = result.split(",", 1)[1]
        img_bytes = base64.b64decode(b64_data)
        with Image.open(BytesIO(img_bytes)) as decoded_img:
            self.assertEqual(decoded_img.mode, 'RGB')

    def test_prepare_image_error(self):
        # Pass a non-existent file
        img_path = os.path.join(self.tmp_dir, "does_not_exist.jpg")

        # Call prepare_image
        result = watcher.prepare_image(img_path)

        # Assert
        self.assertIsNone(result)

    @patch('ShadowAnalyst.watcher.SYSTEM_PROMPT', 'test prompt')
    def test__query_model_success(self):
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Analysis result"
        mock_client.chat.completions.create.return_value = mock_response

        result = watcher._query_model(mock_client, "test-model", "base64img")

        self.assertEqual(result, "Analysis result")
        mock_client.chat.completions.create.assert_called_once_with(
            model="test-model",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "test prompt"},
                        {"type": "image_url", "image_url": {"url": "base64img"}}
                    ]
                }
            ]
        )

    @patch('ShadowAnalyst.watcher.SYSTEM_PROMPT', 'test prompt')
    def test__query_model_strips_think_tags(self):
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "<think>Internal thoughts</think>Analysis result"
        mock_client.chat.completions.create.return_value = mock_response

        result = watcher._query_model(mock_client, "test-model", "base64img")

        self.assertEqual(result, "Analysis result")

    @patch('ShadowAnalyst.watcher.SYSTEM_PROMPT', 'test prompt')
    def test__query_model_empty_choices(self):
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = []
        mock_client.chat.completions.create.return_value = mock_response

        result = watcher._query_model(mock_client, "test-model", "base64img")

        self.assertIsNone(result)

    @patch('ShadowAnalyst.watcher.SYSTEM_PROMPT', 'test prompt')
    def test__query_model_no_content(self):
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = None
        mock_client.chat.completions.create.return_value = mock_response

        result = watcher._query_model(mock_client, "test-model", "base64img")

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

    @patch('ShadowAnalyst.watcher.get_openai_client')
    def test_make_gemini_client(self, mock_get_openai_client):
        test_api_key = "test_gemini_key_123"
        result = watcher.make_gemini_client(test_api_key)

        mock_get_openai_client.assert_called_once_with(
            test_api_key,
            "https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        self.assertEqual(result, mock_get_openai_client.return_value)

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
    def test_analyze_image_general_error(self, mock_openai_class, mock_prepare_image):
        mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        # Client throws a generic exception
        mock_client.chat.completions.create.side_effect = Exception("Some unknown error")

        with patch('ShadowAnalyst.watcher.GOOGLE_API_KEYS', ['gkey1']), \
             patch('ShadowAnalyst.watcher.GROQ_API_KEYS', ['groqkey1']):
            marked_path, report = watcher.analyze_image("dummy.jpg")

        self.assertIsNone(marked_path)
        self.assertIn("Сбой ИИ-анализа: все ключи исчерпаны", report)
        self.assertIn("Some unknown error", report)
        self.assertEqual(mock_openai_class.call_count, 2)

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

    @patch('ShadowAnalyst.watcher.threading.Timer')
    @patch('ShadowAnalyst.watcher.publish_result')
    @patch('ShadowAnalyst.watcher.analyze_image')
    @patch('ShadowAnalyst.watcher.os.replace')
    @patch('ShadowAnalyst.watcher.os.path.exists')
    def test_do_process_marked_file_replace_exception(self, mock_exists, mock_replace, mock_analyze, mock_publish, mock_timer):
        mock_analyze.return_value = ('dummy_marked.jpg', 'findings')
        mock_exists.return_value = True

        def replace_side_effect(src, dst):
            if src == 'dummy_marked.jpg':
                raise Exception("Test replace exception")

        mock_replace.side_effect = replace_side_effect

        with patch('builtins.print') as mock_print, patch('ShadowAnalyst.watcher.PROCESSED_DIR', '/tmp/mock_processed'):
            watcher._do_process('dummy.jpg')

            mock_print.assert_any_call("    [!] Ошибка перемещения размеченного файла: Test replace exception")

    @patch('ShadowAnalyst.watcher.threading.Timer')
    @patch('ShadowAnalyst.watcher.publish_result')
    @patch('ShadowAnalyst.watcher.analyze_image')
    @patch('ShadowAnalyst.watcher.os.replace')
    def test_do_process_file_not_found_error(self, mock_replace, mock_analyze, mock_publish, mock_timer):
        mock_analyze.return_value = (None, 'findings')
        mock_replace.side_effect = FileNotFoundError("File moved")

        with patch('builtins.print') as mock_print, patch('ShadowAnalyst.watcher.PROCESSED_DIR', '/tmp/mock_processed'):
            watcher._do_process('dummy.jpg')

    @patch('ShadowAnalyst.watcher.process_single_file')
    @patch('ShadowAnalyst.watcher.Observer')
    @patch('ShadowAnalyst.watcher.time.sleep')
    @patch('ShadowAnalyst.watcher.setup_dirs')
    @patch('ShadowAnalyst.watcher.os.listdir')
    def test_watch_loop_keyboard_interrupt(self, mock_listdir, mock_setup_dirs, mock_sleep, mock_observer_class, mock_process):
        mock_listdir.return_value = ['test1.jpg', 'test2.txt']
        mock_sleep.side_effect = KeyboardInterrupt()
        mock_observer_instance = MagicMock()
        mock_observer_class.return_value = mock_observer_instance

        with patch('builtins.print') as mock_print, \
             patch('ShadowAnalyst.watcher.WATCH_DIR', '/tmp/mock_watch'):
            watcher.watch_loop()

            mock_setup_dirs.assert_called_once()
            mock_process.assert_called_once_with(os.path.join('/tmp/mock_watch', 'test1.jpg'))
            mock_observer_instance.schedule.assert_called_once()
            mock_observer_instance.start.assert_called_once()
            mock_observer_instance.stop.assert_called_once()
            mock_observer_instance.join.assert_called_once()

            mock_print.assert_any_call("Остановка.")

    @patch('ShadowAnalyst.watcher.Observer')
    @patch('ShadowAnalyst.watcher.time.sleep')
    @patch('ShadowAnalyst.watcher.setup_dirs')
    @patch('ShadowAnalyst.watcher.os.listdir')
    def test_watch_loop_general_exception(self, mock_listdir, mock_setup_dirs, mock_sleep, mock_observer_class):
        mock_listdir.return_value = []
        mock_sleep.side_effect = Exception("General error")
        mock_observer_instance = MagicMock()
        mock_observer_class.return_value = mock_observer_instance

        with patch('builtins.print') as mock_print, \
             patch('ShadowAnalyst.watcher.WATCH_DIR', '/tmp/mock_watch'):
            watcher.watch_loop()

            mock_setup_dirs.assert_called_once()
            mock_observer_instance.schedule.assert_called_once()
            mock_observer_instance.start.assert_called_once()
            mock_observer_instance.stop.assert_called_once()
            mock_observer_instance.join.assert_called_once()

            mock_print.assert_any_call("Глобальная ошибка: General error")

    @patch('ShadowAnalyst.watcher.Observer')
    @patch('ShadowAnalyst.watcher.time.sleep')
    @patch('ShadowAnalyst.watcher.setup_dirs')
    @patch('ShadowAnalyst.watcher.os.listdir')
    def test_watch_loop_listdir_exception(self, mock_listdir, mock_setup_dirs, mock_sleep, mock_observer_class):
        mock_listdir.side_effect = Exception("Listdir error")
        mock_sleep.side_effect = KeyboardInterrupt()
        mock_observer_instance = MagicMock()
        mock_observer_class.return_value = mock_observer_instance

        with patch('builtins.print') as mock_print, \
             patch('ShadowAnalyst.watcher.WATCH_DIR', '/tmp/mock_watch'):
            watcher.watch_loop()

            mock_print.assert_any_call("Ошибка при проверке существующих файлов: Listdir error")
            mock_observer_instance.start.assert_called_once()

if __name__ == '__main__':
    unittest.main()

