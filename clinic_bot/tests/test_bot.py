import unittest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message, cmd_start, handle_xray_result
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


class TestBotHandleXrayResult(unittest.TestCase):
    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast_photo', new_callable=MagicMock)
    @patch('bot.broadcast', new_callable=MagicMock)
    @patch('bot.base64.b64decode')
    def test_handle_xray_result_with_image_and_patient(self, mock_b64decode, mock_broadcast, mock_broadcast_photo, mock_run_coroutine):
        mock_b64decode.return_value = b"fake_image_bytes"
        mock_broadcast_photo.return_value = "coro_broadcast_photo"
        mock_broadcast.return_value = "coro_broadcast"

        payload = {
            'image_b64': 'ZmFrZV9pbWFnZV9ieXRlcw==',
            'report': 'Found cavity on tooth 4.6',
            'patient_name': 'Иван Иванов',
            'file': 'xray1.jpg'
        }
        loop = MagicMock()

        handle_xray_result('topic_xray', payload, loop)

        mock_b64decode.assert_called_once_with('ZmFrZV9pbWFnZV9ieXRlcw==')

        # Check broadcast_photo args
        mock_broadcast_photo.assert_called_once()
        args, kwargs = mock_broadcast_photo.call_args
        self.assertEqual(args[0], b"fake_image_bytes")
        self.assertIn("Иван Иванов", args[1])
        self.assertEqual(args[2], 'Found cavity on tooth 4.6')
        self.assertEqual(kwargs.get('role'), 'doctor')

        # Check broadcast args (admin)
        mock_broadcast.assert_called_once()
        args, kwargs = mock_broadcast.call_args
        self.assertIn("Иван Иванов", args[0])
        self.assertIn("xray1.jpg", args[0])
        self.assertEqual(kwargs.get('role'), 'admin')

        # Check that both coroutines were submitted
        self.assertEqual(mock_run_coroutine.call_count, 2)
        mock_run_coroutine.assert_any_call("coro_broadcast_photo", loop)
        mock_run_coroutine.assert_any_call("coro_broadcast", loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast_photo', new_callable=MagicMock)
    @patch('bot.broadcast', new_callable=MagicMock)
    @patch('bot.base64.b64decode')
    def test_handle_xray_result_missing_patient(self, mock_b64decode, mock_broadcast, mock_broadcast_photo, mock_run_coroutine):
        mock_b64decode.return_value = b"fake_image_bytes"
        mock_broadcast_photo.return_value = "coro_broadcast_photo"
        mock_broadcast.return_value = "coro_broadcast"

        payload = {
            'image_b64': 'ZmFrZV9pbWFnZV9ieXRlcw==',
            'report': 'Found cavity'
            # no patient_name
        }
        loop = MagicMock()

        handle_xray_result('topic_xray', payload, loop)

        mock_broadcast_photo.assert_called_once()
        args, kwargs = mock_broadcast_photo.call_args
        self.assertIn("неизвестен (нет записи)", args[1])

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast_photo', new_callable=MagicMock)
    @patch('bot.broadcast', new_callable=MagicMock)
    @patch('bot.base64.b64decode')
    def test_handle_xray_result_patient_neizvesten(self, mock_b64decode, mock_broadcast, mock_broadcast_photo, mock_run_coroutine):
        mock_b64decode.return_value = b"fake_image_bytes"
        mock_broadcast_photo.return_value = "coro_broadcast_photo"
        mock_broadcast.return_value = "coro_broadcast"

        payload = {
            'image_b64': 'ZmFrZV9pbWFnZV9ieXRlcw==',
            'report': 'Found cavity',
            'patient_name': 'Неизвестен'
        }
        loop = MagicMock()

        handle_xray_result('topic_xray', payload, loop)

        mock_broadcast_photo.assert_called_once()
        args, kwargs = mock_broadcast_photo.call_args
        self.assertIn("неизвестен (нет записи)", args[1])

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast_photo', new_callable=MagicMock)
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_xray_result_no_image(self, mock_broadcast, mock_broadcast_photo, mock_run_coroutine):
        mock_broadcast.return_value = "coro_broadcast"

        payload = {
            'report': 'Found cavity on tooth 4.6',
            'patient_name': 'Иван Иванов'
        }
        loop = MagicMock()

        handle_xray_result('topic_xray', payload, loop)

        mock_broadcast_photo.assert_not_called()

        mock_broadcast.assert_called_once()
        args, kwargs = mock_broadcast.call_args
        self.assertIn("Иван Иванов", args[0])
        self.assertIn("Found cavity on tooth 4.6", args[0])
        self.assertEqual(kwargs.get('role'), 'doctor')

        mock_run_coroutine.assert_called_once_with("coro_broadcast", loop)


if __name__ == '__main__':
    unittest.main()
