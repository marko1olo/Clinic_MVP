import unittest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message, cmd_start, handle_review_neg
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

    @patch('bot.broadcast')
    def test_handle_review_neg_with_data(self, mock_broadcast):
        """Test handle_review_neg formats message correctly and broadcasts to admin."""
        loop = MagicMock()
        payload = {'patient': 'Ivanov Ivan', 'text': 'Very bad service'}

        with patch('bot.asyncio.run_coroutine_threadsafe') as mock_run_coroutine:
            handle_review_neg('some/topic', payload, loop)

            mock_broadcast.assert_called_once_with(
                "⚠️ *Негативный отзыв*\n\nПациент: Ivanov Ivan\nСообщение: _Very bad service_\n\nТребует обратной связи!",
                role='admin'
            )
            self.assertEqual(mock_run_coroutine.call_count, 1)
            # The first argument should be a coroutine created by mock_broadcast
            coroutine = mock_run_coroutine.call_args[0][0]
            # Since broadcast is an async function, calling it returns a coroutine.
            # We don't try to assert exact equality with mock_broadcast.return_value because mock_broadcast returns a coroutine object which changes its id.
            # Instead we just verify it was called with loop
            self.assertEqual(mock_run_coroutine.call_args[0][1], loop)
            coroutine.close() # close the unawaited coroutine to avoid warning

    @patch('bot.broadcast')
    def test_handle_review_neg_missing_fields(self, mock_broadcast):
        """Test handle_review_neg uses default values if payload is missing fields."""
        loop = MagicMock()
        payload = {}

        with patch('bot.asyncio.run_coroutine_threadsafe') as mock_run_coroutine:
            handle_review_neg('some/topic', payload, loop)

            mock_broadcast.assert_called_once_with(
                "⚠️ *Негативный отзыв*\n\nПациент: неизвестен\nСообщение: __\n\nТребует обратной связи!",
                role='admin'
            )
            self.assertEqual(mock_run_coroutine.call_count, 1)
            coroutine = mock_run_coroutine.call_args[0][0]
            self.assertEqual(mock_run_coroutine.call_args[0][1], loop)
            coroutine.close() # close the unawaited coroutine to avoid warning


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


if __name__ == '__main__':
    unittest.main()
