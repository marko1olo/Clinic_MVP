import unittest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message, cmd_start
from aiogram.types import Message, Chat, User

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



class TestBotBroadcast(unittest.IsolatedAsyncioTestCase):
    @patch('bot.db')
    @patch('bot.bot')
    async def test_broadcast_success(self, mock_bot, mock_db):
        mock_db.get_users_by_role.return_value = [111, 222]
        mock_bot.send_message = AsyncMock()

        from bot import broadcast
        await broadcast("Test message", role="admin")

        mock_db.get_users_by_role.assert_called_once_with("admin")
        self.assertEqual(mock_bot.send_message.call_count, 2)
        mock_bot.send_message.assert_any_call(111, "Test message", parse_mode="Markdown")
        mock_bot.send_message.assert_any_call(222, "Test message", parse_mode="Markdown")

    @patch('bot.db')
    @patch('bot.bot')
    async def test_broadcast_no_users(self, mock_bot, mock_db):
        mock_db.get_users_by_role.return_value = []
        mock_bot.send_message = AsyncMock()

        from bot import broadcast
        with self.assertLogs('bot', level='WARNING') as log_capture:
            await broadcast("Test message", role="doctor")

        mock_db.get_users_by_role.assert_called_once_with("doctor")
        mock_bot.send_message.assert_not_called()
        self.assertTrue(any("No registered doctors to send to." in log_msg for log_msg in log_capture.output))

    @patch('bot.db')
    @patch('bot.bot')
    async def test_broadcast_exception(self, mock_bot, mock_db):
        mock_db.get_users_by_role.return_value = [111, 222]

        # AsyncMock's side_effect allows it to raise an exception or return a result for async functions
        async def side_effect_func(chat_id, *args, **kwargs):
            if chat_id == 111:
                raise Exception("Failed")
            return None
        mock_bot.send_message.side_effect = side_effect_func

        from bot import broadcast
        with self.assertLogs('bot', level='ERROR') as log_capture:
            await broadcast("Test message", role="admin")

        mock_db.get_users_by_role.assert_called_once_with("admin")
        self.assertEqual(mock_bot.send_message.call_count, 2)
        self.assertTrue(any("Failed to send to 111: Failed" in log_msg for log_msg in log_capture.output))


if __name__ == "__main__":
    unittest.main()
