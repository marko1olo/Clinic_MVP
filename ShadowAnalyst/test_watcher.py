import os
import base64
from io import BytesIO
import pytest
from PIL import Image
from unittest.mock import patch, MagicMock

# Import the module to be tested
from ShadowAnalyst import watcher

def test_prepare_image_normal(tmp_path):
    # Create a small RGB image
    img = Image.new('RGB', (100, 100), color = 'red')
    img_path = tmp_path / "normal.jpg"
    img.save(img_path)

    # Call prepare_image
    result = watcher.prepare_image(str(img_path))

    # Assert return value starts with the right prefix
    assert result is not None
    assert result.startswith("data:image/jpeg;base64,")

    # Verify we can decode it back to an image
    b64_data = result.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_data)
    with Image.open(BytesIO(img_bytes)) as decoded_img:
        assert decoded_img.size == (100, 100)

def test_prepare_image_resize(tmp_path):
    # Create a large image that needs resizing
    img = Image.new('RGB', (2000, 1500), color = 'blue')
    img_path = tmp_path / "large.jpg"
    img.save(img_path)

    # Call prepare_image
    result = watcher.prepare_image(str(img_path))

    # Assert
    assert result is not None

    # Decode and check size
    b64_data = result.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_data)
    with Image.open(BytesIO(img_bytes)) as decoded_img:
        assert max(decoded_img.size) == 1000
        assert decoded_img.size == (1000, 750) # Assuming aspect ratio is maintained

def test_prepare_image_non_rgb(tmp_path):
    # Create an RGBA image
    img = Image.new('RGBA', (200, 200), color = (255, 0, 0, 128))
    img_path = tmp_path / "rgba.png"
    img.save(img_path)

    # Call prepare_image
    result = watcher.prepare_image(str(img_path))

    # Assert
    assert result is not None
    assert result.startswith("data:image/jpeg;base64,")

    # Decode and check mode
    b64_data = result.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_data)
    with Image.open(BytesIO(img_bytes)) as decoded_img:
        assert decoded_img.mode == 'RGB'

def test_prepare_image_error(tmp_path):
    # Pass a non-existent file
    img_path = tmp_path / "does_not_exist.jpg"

    # Call prepare_image
    result = watcher.prepare_image(str(img_path))

    # Assert
    assert result is None

@patch('ShadowAnalyst.watcher.prepare_image')
@patch('ShadowAnalyst.watcher.OpenAI')
def test_analyze_image_success(mock_openai_class, mock_prepare_image):
    mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

    # Setup mock OpenAI client
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client

    # Setup mock response
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = "All clear"
    mock_client.chat.completions.create.return_value = mock_response

    # Call analyze_image
    marked_path, report = watcher.analyze_image("dummy.jpg")

    # Assert
    assert marked_path is None
    assert report == "All clear"

    # Ensure client was created and create was called
    mock_openai_class.assert_called()
    mock_client.chat.completions.create.assert_called_once()

@patch('ShadowAnalyst.watcher.prepare_image')
@patch('ShadowAnalyst.watcher.OpenAI')
def test_analyze_image_rate_limit_retry(mock_openai_class, mock_prepare_image):
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

    # Call analyze_image
    marked_path, report = watcher.analyze_image("dummy.jpg")

    # Assert
    assert marked_path is None
    assert report == "Success on second try"

    # Ensure client was created twice
    assert mock_openai_class.call_count == 2
    mock_client_1.chat.completions.create.assert_called_once()
    mock_client_2.chat.completions.create.assert_called_once()

@patch('ShadowAnalyst.watcher.prepare_image')
@patch('ShadowAnalyst.watcher.OpenAI')
def test_analyze_image_rate_limit_exhausted(mock_openai_class, mock_prepare_image):
    mock_prepare_image.return_value = "data:image/jpeg;base64,dummybase64"

    # Setup mock OpenAI client instance
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client

    # Client always throws a 429 exception
    mock_client.chat.completions.create.side_effect = Exception("HTTP 429 Too Many Requests")

    # Call analyze_image
    marked_path, report = watcher.analyze_image("dummy.jpg")

    # Assert
    assert marked_path is None
    assert report == "Сбой: Все ключи Groq исчерпали лимиты (429)."

    # Ensure client was created as many times as there are API keys
    assert mock_openai_class.call_count == len(watcher.GROQ_API_KEYS)

@patch('ShadowAnalyst.watcher.prepare_image')
@patch('ShadowAnalyst.watcher.OpenAI')
def test_analyze_image_prepare_failed(mock_openai_class, mock_prepare_image):
    # Setup mock to return None (failure)
    mock_prepare_image.return_value = None

    # Call analyze_image
    marked_path, report = watcher.analyze_image("dummy.jpg")

    # Assert
    assert marked_path is None
    assert report == "Ошибка обработки файла"

    # Ensure OpenAI was not called
    mock_openai_class.assert_not_called()
