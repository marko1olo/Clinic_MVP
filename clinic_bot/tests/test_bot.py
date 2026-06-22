import unittest
from unittest.mock import AsyncMock, patch, MagicMock
from aiogram.types import Message, Chat, User
import sys
import os

# Ensure clinic_bot module is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bot import cmd_start
import db

class TestBotCommands(unittest.IsolatedAsyncioTestCase):

    def setUp(self):
        self.mock_message = MagicMock(spec=Message)
        self.mock_message.chat = MagicMock(spec=Chat)
        self.mock_message.chat.id = 12345
        self.mock_message.from_user = MagicMock(spec=User)
        self.mock_message.from_user.id = 54321
        self.mock_message.from_user.full_name = "Test User"
        self.mock_message.answer = AsyncMock()

    @patch('bot.db.get_user_role')
    @patch('bot.db.add_user')
    async def test_cmd_start_existing_user(self, mock_add_user, mock_get_user_role):
        # Arrange
        mock_get_user_role.return_value = 'admin'

        # Act
        await cmd_start(self.mock_message)

        # Assert
        mock_get_user_role.assert_called_once_with(12345)
        mock_add_user.assert_not_called()

        # Verify the answer was called
        self.mock_message.answer.assert_called_once()
        args, kwargs = self.mock_message.answer.call_args
        self.assertIn(r"Ваш chat\_id: `12345`", args[0])
        self.assertIn("Ваша роль: `admin`", args[0])
        self.assertEqual(kwargs.get("parse_mode"), "Markdown")

    @patch('bot.db.get_user_role')
    @patch('bot.db.add_user')
    async def test_cmd_start_new_user(self, mock_add_user, mock_get_user_role):
        # Arrange
        mock_get_user_role.return_value = None

        # Act
        await cmd_start(self.mock_message)

        # Assert
        mock_get_user_role.assert_called_once_with(12345)
        mock_add_user.assert_called_once_with(12345, 'doctor', "Test User")

        # Verify the answer was called
        self.mock_message.answer.assert_called_once()
        args, kwargs = self.mock_message.answer.call_args
        self.assertIn(r"Ваш chat\_id: `12345`", args[0])
        self.assertIn("Ваша роль: `doctor`", args[0])
        self.assertEqual(kwargs.get("parse_mode"), "Markdown")

if __name__ == '__main__':
    unittest.main()
