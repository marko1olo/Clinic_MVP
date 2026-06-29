import unittest
from unittest.mock import patch
import sys
import os

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock gui before importing to avoid tkinter and other errors
import sys
from unittest.mock import MagicMock
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

from gui.app import run_ai_analysis

class TestRunAIAnalysis(unittest.TestCase):
    @patch('gui.app.prepare_image')
    def test_run_ai_analysis_image_prep_failure(self, mock_prepare_image):
        mock_prepare_image.return_value = None
        res1, res2 = run_ai_analysis("dummy_path")
        self.assertEqual(res1, "Ошибка обработки картинки.")
        self.assertEqual(res2, "Снимок не обработан.")

    @patch('gui.app.check_internet_connection')
    @patch('gui.app.prepare_image')
    def test_run_ai_analysis_network_failure(self, mock_prepare_image, mock_check_internet):
        mock_prepare_image.return_value = "base64_string"
        mock_check_internet.return_value = False

        res1, res2 = run_ai_analysis("dummy_path")
        self.assertEqual(res1, "Сбой сети: Отсутствует подключение к интернету. Проверьте кабель или Wi-Fi.")
        self.assertEqual(res2, "Сбой анализа.")

if __name__ == '__main__':
    unittest.main()
