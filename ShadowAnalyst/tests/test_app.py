import os
import pytest
from unittest.mock import patch, MagicMock
from gui import app

@pytest.fixture
def mock_env():
    # Reset state to clean between tests
    app.processing_files.clear()

    # We patch everything that could make external calls, UI updates or file writes
    with patch("gui.app.wait_for_file_ready", return_value=True), \
         patch("gui.app.prepare_image", return_value="data:image/jpeg;base64,mocked"), \
         patch("shutil.copy2"), \
         patch("gui.app.run_ai_analysis", return_value="Mocked AI Report"), \
         patch("threading.Thread"), \
         patch("threading.Timer"), \
         patch("builtins.open"):
        yield

def test_process_new_xray_crm_api_failure(mock_env, tmp_path):
    """
    Test missing patient handling in process_new_xray when the CRM API times out
    or returns an error, ensuring the application handles the exception without crashing.
    """
    # Setup fake file
    test_file = tmp_path / "test_image.jpg"
    test_file.touch()

    # Mock requests.get to raise an exception
    with patch("requests.get", side_effect=Exception("API Timeout")) as mock_get:
        app.process_new_xray(str(test_file))

        # Ensure requests.get was called
        mock_get.assert_called_once_with(app.CRM_API_URL, timeout=3)

        # Verify app state transitioned properly despite the error
        assert app.app_state["latest_image"] == "/static/uploads/test_image.jpg"
        assert app.app_state["latest_report"] == "Mocked AI Report"
        assert app.app_state["is_processing"] == False

def test_process_new_xray_crm_api_success(mock_env, tmp_path):
    """
    Test patient handling in process_new_xray when the CRM API returns patient info.
    """
    # Setup fake file
    test_file = tmp_path / "test_image.jpg"
    test_file.touch()

    # Mock requests.get to return a successful response with patient info
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"patient_name": "Ivan Ivanov"}

    with patch("requests.get", return_value=mock_response) as mock_get:
        app.process_new_xray(str(test_file))

        # Ensure requests.get was called
        mock_get.assert_called_once_with(app.CRM_API_URL, timeout=3)

        # Verify app state transitioned properly
        assert app.app_state["latest_image"] == "/static/uploads/test_image.jpg"
        assert app.app_state["latest_report"] == "Mocked AI Report"
        assert app.app_state["is_processing"] == False
