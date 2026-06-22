import unittest
from unittest.mock import AsyncMock, MagicMock, patch
from aiogram.types import Message, Chat, User
import sys
import os

# Add clinic_bot to path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bot import cmd_start

class TestBotHandlers(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.message_mock = MagicMock(spec=Message)
        self.message_mock.chat = MagicMock(spec=Chat)
        self.message_mock.chat.id = 123456789
        self.message_mock.from_user = MagicMock(spec=User)
        self.message_mock.from_user.id = 123456789
        self.message_mock.from_user.full_name = "Test User"
        self.message_mock.answer = AsyncMock()

    @patch('bot.db.get_user_role')
    @patch('bot.db.add_user')
    async def test_cmd_start_existing_user(self, mock_add_user, mock_get_user_role):
        mock_get_user_role.return_value = 'admin'

        await cmd_start(self.message_mock)

        mock_get_user_role.assert_called_once_with(123456789)
        mock_add_user.assert_not_called()

        self.message_mock.answer.assert_called_once()
        args, kwargs = self.message_mock.answer.call_args
        self.assertIn("Ваш chat\\_id: `123456789`", args[0])
        self.assertIn("Ваша роль: `admin`", args[0])
        self.assertEqual(kwargs.get("parse_mode"), "Markdown")

    @patch('bot.db.get_user_role')
    @patch('bot.db.add_user')
    async def test_cmd_start_new_user(self, mock_add_user, mock_get_user_role):
        mock_get_user_role.return_value = None

        await cmd_start(self.message_mock)

        mock_get_user_role.assert_called_once_with(123456789)
        mock_add_user.assert_called_once_with(123456789, 'doctor', "Test User")

        self.message_mock.answer.assert_called_once()
        args, kwargs = self.message_mock.answer.call_args
        self.assertIn("Ваш chat\\_id: `123456789`", args[0])
        self.assertIn("Ваша роль: `doctor`", args[0])
        self.assertEqual(kwargs.get("parse_mode"), "Markdown")

if __name__ == '__main__':
    unittest.main()
