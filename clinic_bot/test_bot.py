from __future__ import annotations
from aiogram.types import Message, Chat, User
from bot import cmd_start

import asyncio
import os
import sys
import unittest
from unittest.mock import AsyncMock
from unittest.mock import MagicMock
from unittest.mock import patch
sys.path.insert(0, os.path.dirname(__file__))


class TestBot(unittest.IsolatedAsyncioTestCase):
    @patch('bot.db')
    async def test_cmd_start_default_role(self, mock_db):
        mock_db.get_user_role.return_value = None

        message = AsyncMock(spec=Message)
        message.chat = MagicMock(spec=Chat)
        message.chat.id = 123
        message.from_user = MagicMock(spec=User)
        message.from_user.full_name = 'Test User'
        message.answer = AsyncMock()

        await cmd_start(message)

        mock_db.add_user.assert_called_with(123, 'guest', 'Test User')
        message.answer.assert_called_once()
        self.assertIn('guest', message.answer.call_args[0][0])


if __name__ == '__main__':
    unittest.main()
