import builtins
import io
import pytest
from unittest.mock import patch, MagicMock
from gui.add_text import add_text_to_splash

@pytest.fixture
def mock_image_env():
    with patch('gui.add_text.Image.open') as mock_open, \
         patch('gui.add_text.ImageFont.truetype') as mock_truetype, \
         patch('gui.add_text.ImageFont.load_default') as mock_load_default, \
         patch('gui.add_text.Image.new') as mock_new, \
         patch('gui.add_text.ImageDraw.Draw') as mock_draw, \
         patch('gui.add_text.Image.alpha_composite') as mock_alpha_composite:

        # Mock image opened
        mock_img = MagicMock()
        mock_img.convert.return_value = mock_img
        mock_img.size = (800, 600)
        mock_open.return_value = mock_img

        # Mock draw
        mock_draw_instance = MagicMock()
        mock_draw_instance.textbbox.return_value = (0, 0, 100, 50) # left, top, right, bottom
        mock_draw.return_value = mock_draw_instance

        # Mock alpha composite output
        mock_out = MagicMock()
        mock_out_rgb = MagicMock()
        mock_out.convert.return_value = mock_out_rgb
        mock_alpha_composite.return_value = mock_out

        yield {
            'open': mock_open,
            'truetype': mock_truetype,
            'load_default': mock_load_default,
            'new': mock_new,
            'draw': mock_draw,
            'draw_instance': mock_draw_instance,
            'alpha_composite': mock_alpha_composite,
            'out_rgb': mock_out_rgb
        }

def test_add_text_to_splash_success(mock_image_env, capsys):
    """Test successful text addition when fonts are found."""
    add_text_to_splash('test_splash.png')

    mock_image_env['open'].assert_called_once_with('test_splash.png')
    mock_image_env['truetype'].assert_called()
    mock_image_env['draw_instance'].text.assert_called()
    mock_image_env['out_rgb'].save.assert_called_once_with('test_splash.png')

    captured = capsys.readouterr()
    assert 'Added text to test_splash.png' in captured.out

def test_add_text_to_splash_fallback_font(mock_image_env, capsys):
    """Test text addition when TrueType fonts are unavailable."""
    mock_image_env['truetype'].side_effect = Exception("Font not found")

    add_text_to_splash('test_splash.png')

    mock_image_env['load_default'].assert_called()
    mock_image_env['draw_instance'].text.assert_called()
    mock_image_env['out_rgb'].save.assert_called_once_with('test_splash.png')

    captured = capsys.readouterr()
    assert 'Added text to test_splash.png' in captured.out

def test_add_text_to_splash_exception(mock_image_env, capsys):
    """Test handling of exceptions during image processing."""
    mock_image_env['open'].side_effect = IOError("File not found")

    add_text_to_splash('missing_splash.png')

    mock_image_env['open'].assert_called_once_with('missing_splash.png')

    captured = capsys.readouterr()
    assert 'Error: File not found' in captured.out
