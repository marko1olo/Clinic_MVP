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

             mock_add_user.assert_called_once_with(12345, 'guest', 'Test User')
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
from unittest.mock import AsyncMock, patch, MagicMock

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from bot import cmd_start

class TestBot(unittest.IsolatedAsyncioTestCase):
    @patch('bot.db')
    async def test_cmd_start_default_role(self, mock_db):
        mock_db.get_user_role.return_value = None

        message = AsyncMock(spec=Message)
        message.chat = MagicMock(spec=Chat)
        message.chat.id = 123
        message.from_user = MagicMock(spec=User)
        message.from_user.full_name = "Test User"
        message.answer = AsyncMock()

        await cmd_start(message)

        mock_db.add_user.assert_called_with(123, 'guest', "Test User")
        message.answer.assert_called_once()
        self.assertIn('guest', message.answer.call_args[0][0])

if __name__ == '__main__':
    unittest.main()
from unittest.mock import MagicMock, patch, ANY

sys.path.insert(0, '.')
from clinic_bot.bot import on_mqtt_message

def test_on_mqtt_message_invalid_json():
    client = MagicMock()

    loop = MagicMock()
    userdata = {'loop': loop}

    msg = MagicMock()
    msg.topic = "some_unknown_topic"
    msg.payload = b"not a json string"

    with patch('clinic_bot.bot.asyncio.run_coroutine_threadsafe') as mock_run_coroutine, \
         patch('clinic_bot.bot.broadcast') as mock_broadcast:

        on_mqtt_message(client, userdata, msg)

        # Verify it fallback to {"text": ...} for payload and hits the else branch
        mock_broadcast.assert_called_once()
        args, kwargs = mock_broadcast.call_args

        assert "not a json string" in args[0]
        assert "some_unknown_topic" in args[0]
        assert kwargs.get('role') == 'admin'

        mock_run_coroutine.assert_called_once_with(ANY, loop)

        # Clean up coroutine
        coro = mock_run_coroutine.call_args.args[0]
        coro.close()

def test_on_mqtt_message_valid_json():
    client = MagicMock()

    loop = MagicMock()
    userdata = {'loop': loop}

    msg = MagicMock()
    msg.topic = "some_unknown_topic"
    msg.payload = b'{"key": "value"}'

    with patch('clinic_bot.bot.asyncio.run_coroutine_threadsafe') as mock_run_coroutine, \
         patch('clinic_bot.bot.broadcast') as mock_broadcast:

        on_mqtt_message(client, userdata, msg)

        mock_broadcast.assert_called_once()
        args, kwargs = mock_broadcast.call_args

        assert "{'key': 'value'}" in args[0]
        assert "some_unknown_topic" in args[0]
        assert kwargs.get('role') == 'admin'

        mock_run_coroutine.assert_called_once_with(ANY, loop)

        # Clean up coroutine
        coro = mock_run_coroutine.call_args.args[0]
        coro.close()
from unittest.mock import AsyncMock, patch
from clinic_bot import bot

class TestBotBroadcastPhoto(unittest.IsolatedAsyncioTestCase):
    async def test_broadcast_photo_error_handling(self):
        # Mock database call to return two users
        with patch('clinic_bot.bot.db.get_users_by_role', return_value=[123, 456]):
            # Mock bot.send_photo
            mock_send_photo = AsyncMock()
            # First call raises an exception, second call succeeds
            mock_send_photo.side_effect = [Exception("Test send_photo error"), None]

            # Mock bot.send_message
            mock_send_message = AsyncMock()

            # Mock logger
            with patch('clinic_bot.bot.log.error') as mock_logger_error:
                with patch.object(bot.bot, 'send_photo', mock_send_photo):
                    with patch.object(bot.bot, 'send_message', mock_send_message):
                        # Call the function
                        photo_bytes = b"fake_photo_data"
                        caption = "Test Caption"
                        report_text = "Test Report Text"

                        await bot.broadcast_photo(photo_bytes, caption, report_text, role='doctor')

                        # Verify send_photo was called for both users despite the error on the first user
                        self.assertEqual(mock_send_photo.call_count, 2)

                        # Check arguments for the first user
                        call_args_1 = mock_send_photo.call_args_list[0]
                        self.assertEqual(call_args_1.args[0], 123)
                        self.assertEqual(call_args_1.kwargs['caption'], caption)

                        # Check arguments for the second user
                        call_args_2 = mock_send_photo.call_args_list[1]
                        self.assertEqual(call_args_2.args[0], 456)
                        self.assertEqual(call_args_2.kwargs['caption'], caption)

                        # Verify send_message was only called for the second user because the first user failed at send_photo
                        self.assertEqual(mock_send_message.call_count, 1)
                        call_args_msg = mock_send_message.call_args_list[0]
                        self.assertEqual(call_args_msg.args[0], 456)
                        self.assertEqual(call_args_msg.kwargs['text'], report_text)

                        # Verify logger was called for the first user error
                        self.assertEqual(mock_logger_error.call_count, 1)
                        self.assertIn("Failed to send photo to 123: Test send_photo error", mock_logger_error.call_args_list[0].args[0])

