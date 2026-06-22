import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from aiogram.types import Message, Chat, User
from bot import cmd_start, cmd_status, cmd_test

@pytest.fixture
def message_mock():
    msg = MagicMock(spec=Message)
    msg.chat = MagicMock(spec=Chat)
    msg.chat.id = 12345
    msg.from_user = MagicMock(spec=User)
    msg.from_user.full_name = "Test User"
    msg.answer = AsyncMock()
    return msg

@pytest.mark.asyncio
async def test_cmd_start(message_mock):
    with patch('db.get_user_role') as mock_get_role, \
         patch('db.add_user') as mock_add_user:

         # Test new user
         mock_get_role.return_value = None
         await cmd_start(message_mock)

         mock_add_user.assert_called_once_with(12345, 'doctor', 'Test User')
         message_mock.answer.assert_called_once()
         assert "Денталия-2" in message_mock.answer.call_args[0][0]

@pytest.mark.asyncio
async def test_cmd_status(message_mock):
    with patch('db.get_users_by_role') as mock_get_users:
        mock_get_users.side_effect = [[1, 2], [3]] # 2 doctors, 1 admin

        await cmd_status(message_mock)

        message_mock.answer.assert_called_once()
        ans = message_mock.answer.call_args[0][0]
        assert "Врачей: 2" in ans
        assert "Админов: 1" in ans

@pytest.mark.asyncio
async def test_cmd_test(message_mock):
    await cmd_test(message_mock)
    message_mock.answer.assert_called_once()
    ans = message_mock.answer.call_args[0][0]
    assert "Тест уведомления" in ans
