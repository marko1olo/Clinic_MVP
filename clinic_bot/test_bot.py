import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from clinic_bot import bot

@pytest.mark.asyncio
async def test_broadcast_photo_error_handling(mocker):
    # Mock database call to return two users
    mocker.patch('clinic_bot.bot.db.get_users_by_role', return_value=[123, 456])

    # Mock bot.send_photo
    mock_send_photo = AsyncMock()
    # First call raises an exception, second call succeeds
    mock_send_photo.side_effect = [Exception("Test send_photo error"), None]
    mocker.patch.object(bot.bot, 'send_photo', mock_send_photo)

    # Mock bot.send_message
    mock_send_message = AsyncMock()
    mocker.patch.object(bot.bot, 'send_message', mock_send_message)

    # Mock logger
    mock_logger_error = mocker.patch('clinic_bot.bot.log.error')

    # Call the function
    photo_bytes = b"fake_photo_data"
    caption = "Test Caption"
    report_text = "Test Report Text"

    await bot.broadcast_photo(photo_bytes, caption, report_text, role='doctor')

    # Verify send_photo was called for both users despite the error on the first user
    assert mock_send_photo.call_count == 2

    # Check arguments for the first user
    call_args_1 = mock_send_photo.call_args_list[0]
    assert call_args_1.args[0] == 123
    assert call_args_1.kwargs['caption'] == caption

    # Check arguments for the second user
    call_args_2 = mock_send_photo.call_args_list[1]
    assert call_args_2.args[0] == 456
    assert call_args_2.kwargs['caption'] == caption

    # Verify send_message was only called for the second user because the first user failed at send_photo
    assert mock_send_message.call_count == 1
    call_args_msg = mock_send_message.call_args_list[0]
    assert call_args_msg.args[0] == 456
    assert call_args_msg.kwargs['text'] == report_text

    # Verify logger was called for the first user error
    assert mock_logger_error.call_count == 1
    assert "Failed to send photo to 123: Test send_photo error" in mock_logger_error.call_args_list[0].args[0]
