import os
import unittest
from unittest.mock import patch, MagicMock
import tempfile
from gui import app

class TestApp(unittest.TestCase):
    def setUp(self):
        # Reset state to clean between tests
        app.processing_files.clear()

        # We patch everything that could make external calls, UI updates or file writes
        self.patcher_wait = patch("gui.app.wait_for_file_ready", return_value=True)
        self.patcher_prepare = patch("gui.app.prepare_image", return_value="data:image/jpeg;base64,mocked")
        self.patcher_copy = patch("shutil.copy2")
        self.patcher_ai = patch("gui.app.run_ai_analysis", return_value="Mocked AI Report")
        self.patcher_thread = patch("threading.Thread")
        self.patcher_timer = patch("threading.Timer")
        self.patcher_open = patch("builtins.open")

        self.patcher_wait.start()
        self.patcher_prepare.start()
        self.patcher_copy.start()
        self.patcher_ai.start()
        self.patcher_thread.start()
        self.patcher_timer.start()
        self.patcher_open.start()

        # Temporary file for testing
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.test_file = os.path.join(self.tmp_dir.name, "test_image.jpg")
        with open(self.test_file, 'w') as f:
            f.write("")

    def tearDown(self):
        self.patcher_wait.stop()
        self.patcher_prepare.stop()
        self.patcher_copy.stop()
        self.patcher_ai.stop()
        self.patcher_thread.stop()
        self.patcher_timer.stop()
        self.patcher_open.stop()
        self.tmp_dir.cleanup()

    @patch("requests.get", side_effect=Exception("API Timeout"))
    def test_process_new_xray_crm_api_failure(self, mock_get):
        """
        Test missing patient handling in process_new_xray when the CRM API times out
        or returns an error, ensuring the application handles the exception without crashing.
        """
        app.process_new_xray(self.test_file)

        # Ensure requests.get was called
        mock_get.assert_called_once_with(app.CRM_API_URL, timeout=3)

        # Verify app state transitioned properly despite the error
        self.assertEqual(app.app_state["latest_image"], "/static/uploads/test_image.jpg")
        self.assertEqual(app.app_state["latest_report"], "Mocked AI Report")
        self.assertEqual(app.app_state["is_processing"], False)

    @patch("requests.get")
    def test_process_new_xray_crm_api_success(self, mock_get):
        """
        Test patient handling in process_new_xray when the CRM API returns patient info.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"patient_name": "Ivan Ivanov"}
        mock_get.return_value = mock_response

        app.process_new_xray(self.test_file)

        # Ensure requests.get was called
        mock_get.assert_called_once_with(app.CRM_API_URL, timeout=3)

        # Verify app state transitioned properly
        self.assertEqual(app.app_state["latest_image"], "/static/uploads/test_image.jpg")
        self.assertEqual(app.app_state["latest_report"], "Mocked AI Report")
        self.assertEqual(app.app_state["is_processing"], False)

if __name__ == '__main__':
    unittest.main()
