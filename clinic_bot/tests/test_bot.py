import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from aiogram.types import Message, Chat, User
import sys
import os

# Ensure clinic_bot module is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bot import cmd_start
import db

@pytest.fixture
def mock_message():
    message = MagicMock(spec=Message)
    message.chat = MagicMock(spec=Chat)
    message.chat.id = 12345
    message.from_user = MagicMock(spec=User)
    message.from_user.id = 54321
    message.from_user.full_name = "Test User"
    message.answer = AsyncMock()
    return message

@pytest.mark.asyncio
@patch('bot.db.get_user_role')
@patch('bot.db.add_user')
async def test_cmd_start_existing_user(mock_add_user, mock_get_user_role, mock_message):
    # Arrange
    mock_get_user_role.return_value = 'admin'

    # Act
    await cmd_start(mock_message)

    # Assert
    mock_get_user_role.assert_called_once_with(12345)
    mock_add_user.assert_not_called()

    # Verify the answer was called
    mock_message.answer.assert_called_once()
    args, kwargs = mock_message.answer.call_args
    assert r"Ваш chat\_id: `12345`" in args[0]
    assert "Ваша роль: `admin`" in args[0]
    assert kwargs.get("parse_mode") == "Markdown"

@pytest.mark.asyncio
@patch('bot.db.get_user_role')
@patch('bot.db.add_user')
async def test_cmd_start_new_user(mock_add_user, mock_get_user_role, mock_message):
    # Arrange
    mock_get_user_role.return_value = None

    # Act
    await cmd_start(mock_message)

    # Assert
    mock_get_user_role.assert_called_once_with(12345)
    mock_add_user.assert_called_once_with(12345, 'doctor', "Test User")

    # Verify the answer was called
    mock_message.answer.assert_called_once()
    args, kwargs = mock_message.answer.call_args
    assert r"Ваш chat\_id: `12345`" in args[0]
    assert "Ваша роль: `doctor`" in args[0]
    assert kwargs.get("parse_mode") == "Markdown"
