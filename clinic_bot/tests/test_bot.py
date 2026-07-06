import unittest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message, cmd_start, handle_alert_admin
from aiogram.types import Message, Chat, User

class TestHandleAlertAdmin(unittest.TestCase):
    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_alert_admin_with_text(self, mock_broadcast, mock_run_coroutine_threadsafe):
        loop = MagicMock()
        payload = {'text': 'Test alert payload'}

        # Avoid AsyncMock warnings for coroutines that are never awaited
        mock_broadcast.return_value = 'mock_coroutine'

        handle_alert_admin('test/topic', payload, loop)

        mock_broadcast.assert_called_once_with("🚨 *АЛЕРТ*\n\nTest alert payload", role='admin')
        mock_run_coroutine_threadsafe.assert_called_once_with('mock_coroutine', loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_alert_admin_without_text(self, mock_broadcast, mock_run_coroutine_threadsafe):
        loop = MagicMock()
        payload = {'key': 'value'}

        mock_broadcast.return_value = 'mock_coroutine'

        handle_alert_admin('test/topic', payload, loop)

        mock_broadcast.assert_called_once_with("🚨 *АЛЕРТ*\n\n{'key': 'value'}", role='admin')
        mock_run_coroutine_threadsafe.assert_called_once_with('mock_coroutine', loop)

class TestBotMqtt(unittest.TestCase):
    def test_on_mqtt_message_exception_handling(self):
        """
        Test that if an unexpected exception occurs while processing an MQTT message,
        it is caught and logged, rather than crashing the application.
        """
        client = MagicMock()
        userdata = {'loop': MagicMock()}
        msg = MagicMock()
        msg.topic = 'test/topic'

        # Configure msg.payload to raise an exception when accessed/decoded,
        # simulating a catastrophic failure when reading the message payload.
        msg.payload.decode.side_effect = Exception("Simulated decode error")

        with self.assertLogs('bot', level='ERROR') as log_capture:
            # This would raise an exception if not properly caught
            on_mqtt_message(client, userdata, msg)

        # Verify the error was properly logged
        self.assertTrue(any("Error processing MQTT message: Simulated decode error" in log_msg for log_msg in log_capture.output))

    def test_on_mqtt_message_missing_loop(self):
        """
        Test that the function returns gracefully if no event loop is provided in userdata.
        """
        client = MagicMock()
        userdata = {}  # Missing 'loop'
        msg = MagicMock()
        msg.topic = 'test/topic'
        msg.payload = b'{"test": "data"}'

        # This should return cleanly
        on_mqtt_message(client, userdata, msg)


class TestBotCmdStart(unittest.IsolatedAsyncioTestCase):
    @patch('bot.db')
    async def test_cmd_start_default_role(self, mock_db):
        # Setup the mock database to return no role
        mock_db.get_user_role.return_value = None

        # Setup the mock message
        message = AsyncMock(spec=Message)
        message.chat = MagicMock(spec=Chat)
        message.chat.id = 123
        message.from_user = MagicMock(spec=User)
        message.from_user.full_name = "Test User"
        message.answer = AsyncMock()

        # Call the command handler
        await cmd_start(message)

        # Check if the database was called to add the user
        mock_db.add_user.assert_called_with(123, 'guest', "Test User")
        message.answer.assert_called_once()
        self.assertIn('guest', message.answer.call_args[0][0])

    @patch('bot.db')
    async def test_cmd_start_existing_role(self, mock_db):
        # Setup the mock database to return a role
        mock_db.get_user_role.return_value = 'doctor'

        # Setup the mock message
        message = AsyncMock(spec=Message)
        message.chat = MagicMock(spec=Chat)
        message.chat.id = 123
        message.from_user = MagicMock(spec=User)
        message.from_user.full_name = "Test User"
        message.answer = AsyncMock()

        # Call the command handler
        await cmd_start(message)

        # Check if the database was NOT called to add the user
        mock_db.add_user.assert_not_called()
        message.answer.assert_called_once()
        self.assertIn('doctor', message.answer.call_args[0][0])

from unittest.mock import AsyncMock, patch, MagicMock

# Ensure clinic_bot module is in sys.path

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
