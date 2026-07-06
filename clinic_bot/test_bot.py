import unittest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from aiogram.types import Message, Chat, User
from bot import cmd_start, cmd_status, cmd_test

class TestBotHandlers(unittest.IsolatedAsyncioTestCase):

    def setUp(self):
        self.message_mock = MagicMock(spec=Message)
        self.message_mock.chat = MagicMock(spec=Chat)
        self.message_mock.chat.id = 12345
        self.message_mock.from_user = MagicMock(spec=User)
        self.message_mock.from_user.full_name = "Test User"
        self.message_mock.answer = AsyncMock()

    async def test_cmd_start(self):
        with patch('db.get_user_role') as mock_get_role, \
             patch('db.add_user') as mock_add_user:

             # Test new user
             mock_get_role.return_value = None
             await cmd_start(self.message_mock)

             mock_add_user.assert_called_once_with(12345, 'doctor', 'Test User')
             self.message_mock.answer.assert_called_once()
             self.assertIn("Денталия-2", self.message_mock.answer.call_args[0][0])

    async def test_cmd_status(self):
        with patch('db.get_users_by_role') as mock_get_users:
            mock_get_users.side_effect = [[1, 2], [3]] # 2 doctors, 1 admin

            await cmd_status(self.message_mock)

            self.message_mock.answer.assert_called_once()
            ans = self.message_mock.answer.call_args[0][0]
            self.assertIn("Врачей: 2", ans)
            self.assertIn("Админов: 1", ans)

    async def test_cmd_test(self):
        await cmd_test(self.message_mock)
        self.message_mock.answer.assert_called_once()
        ans = self.message_mock.answer.call_args[0][0]
        self.assertIn("Тест уведомления", ans)

if __name__ == '__main__':
    unittest.main()
