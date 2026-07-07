import unittest
from unittest.mock import patch
import sys
import os

# Ensure watcher module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import sys
from unittest.mock import MagicMock

# Mock third-party dependencies required by watcher.py
sys.modules['PIL'] = MagicMock()
sys.modules['openai'] = MagicMock()
sys.modules['watchdog'] = MagicMock()
sys.modules['watchdog.observers'] = MagicMock()
sys.modules['watchdog.events'] = MagicMock()
sys.modules['paho'] = MagicMock()
sys.modules['paho.mqtt'] = MagicMock()
sys.modules['paho.mqtt.client'] = MagicMock()

from watcher import analyze_image

class TestAnalyzeImage(unittest.TestCase):
    @patch('watcher.prepare_image')
    def test_analyze_image_prep_failure(self, mock_prepare_image):
        mock_prepare_image.return_value = None
        result = analyze_image("dummy_path")
        self.assertEqual(result, (None, "Ошибка обработки файла"))

if __name__ == '__main__':
    unittest.main()
