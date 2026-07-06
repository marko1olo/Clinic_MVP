import unittest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message, cmd_start, handle_marketing_send
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


class TestHandleMarketingSend(unittest.TestCase):
    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_marketing_send(self, mock_broadcast, mock_run_coroutine_threadsafe):
        # Setup
        topic = "test/marketing/send"
        payload = {
            "patient": "John Doe",
            "draft": "Special discount for teeth cleaning!"
        }
        loop = MagicMock()
        mock_coroutine = MagicMock()
        mock_broadcast.return_value = mock_coroutine

        # Execute
        handle_marketing_send(topic, payload, loop)

        # Assert
        expected_text = (
            f"📣 *Маркетинг — задание*\n\n"
            f"Пациент: John Doe\n"
            f"Черновик: _Special discount for teeth cleaning!_"
        )
        mock_broadcast.assert_called_once_with(expected_text, role='admin')
        mock_run_coroutine_threadsafe.assert_called_once_with(mock_coroutine, loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_marketing_send_missing_fields(self, mock_broadcast, mock_run_coroutine_threadsafe):
        # Setup
        topic = "test/marketing/send"
        payload = {}
        loop = MagicMock()
        mock_coroutine = MagicMock()
        mock_broadcast.return_value = mock_coroutine

        # Execute
        handle_marketing_send(topic, payload, loop)

        # Assert
        expected_text = (
            f"📣 *Маркетинг — задание*\n\n"
            f"Пациент: ?\n"
            f"Черновик: __"
        )
        mock_broadcast.assert_called_once_with(expected_text, role='admin')
        mock_run_coroutine_threadsafe.assert_called_once_with(mock_coroutine, loop)


if __name__ == '__main__':
    unittest.main()
