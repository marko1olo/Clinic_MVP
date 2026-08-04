import unittest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch, ANY
from aiogram.types import Message, Chat, User

import sys
import os
sys.path.insert(0, '.')
sys.path.insert(0, os.path.dirname(__file__))

from clinic_bot.bot import cmd_start, cmd_status, cmd_test, on_mqtt_message
from clinic_bot import bot

class TestBotHandlers(unittest.IsolatedAsyncioTestCase):

    def setUp(self):
        self.message_mock = MagicMock(spec=Message)
        self.message_mock.chat = MagicMock(spec=Chat)
        self.message_mock.chat.id = 12345
        self.message_mock.from_user = MagicMock(spec=User)
        self.message_mock.from_user.full_name = "Test User"
        self.message_mock.answer = AsyncMock()

        # Reset the status cache before each test (just in case cache logic is added/used later)
        if hasattr(bot, '_status_cache'):
            bot._status_cache = {'doctors': 0, 'admins': 0, 'timestamp': float('-inf')}

    async def test_cmd_start(self):
        with patch('db.get_user_role') as mock_get_role, \
             patch('db.add_user') as mock_add_user:

             # Test new user
             mock_get_role.return_value = None
             await cmd_start(self.message_mock)

             mock_add_user.assert_called_once_with(12345, 'guest', 'Test User')
             self.message_mock.answer.assert_called_once()
             self.assertIn("Денталия-2", self.message_mock.answer.call_args[0][0])
             self.assertIn("guest", self.message_mock.answer.call_args[0][0])

    async def test_cmd_status(self):
        with patch('db.get_users_by_role') as mock_get_users:
            # First call is doctors, second is admins
            mock_get_users.side_effect = [[1, 2], [3]] # 2 doctors, 1 admin

            await cmd_status(self.message_mock)

            self.assertEqual(mock_get_users.call_count, 2)

            self.message_mock.answer.assert_called_once()
            ans = self.message_mock.answer.call_args[0][0]
            self.assertIn("Система работает", ans)
            self.assertIn("Врачей: 2", ans)
            self.assertIn("Админов: 1", ans)

    async def test_cmd_test(self):
        await cmd_test(self.message_mock)
        self.message_mock.answer.assert_called_once()
        ans = self.message_mock.answer.call_args[0][0]
        self.assertIn("Тест уведомления", ans)

class TestBotMqttMessage(unittest.TestCase):
    def test_on_mqtt_message_invalid_json(self):
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

    def test_on_mqtt_message_valid_json(self):
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

if __name__ == '__main__':
    unittest.main()
