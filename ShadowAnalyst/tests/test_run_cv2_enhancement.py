import pytest
from unittest.mock import patch, MagicMock
import sys

# Create mock modules
mock_cv2 = MagicMock()
mock_np = MagicMock()

# Since cv2 and numpy are imported inside the function, we can patch sys.modules
@patch.dict('sys.modules', {'cv2': mock_cv2, 'numpy': mock_np})
def test_run_cv2_enhancement_success():
    # Setup mocks for success case
    mock_np.fromfile.return_value = [1, 2, 3] # Not empty
    mock_cv2.IMREAD_GRAYSCALE = 0
    mock_cv2.imdecode.return_value = "mock_img"

    mock_clahe = MagicMock()
    mock_clahe.apply.return_value = "enhanced_img"
    mock_cv2.createCLAHE.return_value = mock_clahe
    mock_cv2.GaussianBlur.return_value = "gaussian_img"
    mock_cv2.addWeighted.return_value = "sharpened_img"

    mock_im_buf_arr = MagicMock()
    mock_cv2.imencode.return_value = (True, mock_im_buf_arr)

    from ShadowAnalyst.gui.app import run_cv2_enhancement

    result = run_cv2_enhancement("src.jpg", "dest.jpg")

    assert result is True
    mock_np.fromfile.assert_called_with("src.jpg", dtype=mock_np.uint8)
    mock_cv2.imdecode.assert_called_with([1, 2, 3], mock_cv2.IMREAD_GRAYSCALE)
    mock_cv2.imencode.assert_called_with(".jpg", "sharpened_img")
    mock_im_buf_arr.tofile.assert_called_once_with("dest.jpg")


@patch.dict('sys.modules', {'cv2': mock_cv2, 'numpy': mock_np})
def test_run_cv2_enhancement_empty_file():
    mock_np.fromfile.return_value = [] # Empty file

    from ShadowAnalyst.gui.app import run_cv2_enhancement

    result = run_cv2_enhancement("src.jpg", "dest.jpg")

    assert result is False

@patch.dict('sys.modules', {'cv2': mock_cv2, 'numpy': mock_np})
def test_run_cv2_enhancement_decode_failure():
    mock_np.fromfile.return_value = [1, 2, 3]
    mock_cv2.imdecode.return_value = None # Failed to decode

    from ShadowAnalyst.gui.app import run_cv2_enhancement

    result = run_cv2_enhancement("src.jpg", "dest.jpg")

    assert result is False

@patch.dict('sys.modules', {'cv2': mock_cv2, 'numpy': mock_np})
def test_run_cv2_enhancement_encode_failure():
    mock_np.fromfile.return_value = [1, 2, 3]
    mock_cv2.imdecode.return_value = "mock_img"

    mock_im_buf_arr = MagicMock()
    mock_cv2.imencode.return_value = (False, mock_im_buf_arr) # Failed to encode

    from ShadowAnalyst.gui.app import run_cv2_enhancement

    result = run_cv2_enhancement("src.jpg", "dest.jpg")

    assert result is False

@patch.dict('sys.modules', {'cv2': mock_cv2, 'numpy': mock_np})
def test_run_cv2_enhancement_exception():
    mock_np.fromfile.side_effect = Exception("File read error")

    from ShadowAnalyst.gui.app import run_cv2_enhancement

    result = run_cv2_enhancement("src.jpg", "dest.jpg")

    assert result is False
