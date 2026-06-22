import pytest
import asyncio
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
@patch("clinic_bot.bot.bot.send_message", new_callable=AsyncMock)
@patch("clinic_bot.bot.db.get_users_by_role")
async def test_broadcast(mock_get_users, mock_send_message):
    from clinic_bot.bot import broadcast
    mock_get_users.return_value = [1, 2, 3]
    await broadcast("test message", role="admin")
    assert mock_send_message.call_count == 3

@pytest.mark.asyncio
@patch("clinic_bot.bot.bot.send_message", new_callable=AsyncMock)
@patch("clinic_bot.bot.bot.send_photo", new_callable=AsyncMock)
@patch("clinic_bot.bot.db.get_users_by_role")
async def test_broadcast_photo(mock_get_users, mock_send_photo, mock_send_message):
    from clinic_bot.bot import broadcast_photo
    mock_get_users.return_value = [4, 5, 6]
    await broadcast_photo(b"fake photo bytes", "caption", "report text", role="doctor")
    assert mock_send_photo.call_count == 3
    # Report text goes to send_message
    assert mock_send_message.call_count == 3
