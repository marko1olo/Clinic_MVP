import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from aiogram.types import Message, Chat, User
import sys
import os

# Add clinic_bot to path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bot import cmd_start

@pytest.fixture
def message_mock():
    msg = MagicMock(spec=Message)
    msg.chat = MagicMock(spec=Chat)
    msg.chat.id = 123456789
    msg.from_user = MagicMock(spec=User)
    msg.from_user.id = 123456789
    msg.from_user.full_name = "Test User"
    msg.answer = AsyncMock()
    return msg

@pytest.mark.asyncio
@patch('bot.db.get_user_role')
@patch('bot.db.add_user')
async def test_cmd_start_existing_user(mock_add_user, mock_get_user_role, message_mock):
    mock_get_user_role.return_value = 'admin'

    await cmd_start(message_mock)

    mock_get_user_role.assert_called_once_with(123456789)
    mock_add_user.assert_not_called()

    message_mock.answer.assert_called_once()
    args, kwargs = message_mock.answer.call_args
    assert "Ваш chat\\_id: `123456789`" in args[0]
    assert "Ваша роль: `admin`" in args[0]
    assert kwargs.get("parse_mode") == "Markdown"

@pytest.mark.asyncio
@patch('bot.db.get_user_role')
@patch('bot.db.add_user')
async def test_cmd_start_new_user(mock_add_user, mock_get_user_role, message_mock):
    mock_get_user_role.return_value = None

    await cmd_start(message_mock)

    mock_get_user_role.assert_called_once_with(123456789)
    mock_add_user.assert_called_once_with(123456789, 'doctor', "Test User")

    message_mock.answer.assert_called_once()
    args, kwargs = message_mock.answer.call_args
    assert "Ваш chat\\_id: `123456789`" in args[0]
    assert "Ваша роль: `doctor`" in args[0]
    assert kwargs.get("parse_mode") == "Markdown"
