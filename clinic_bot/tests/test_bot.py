import unittest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message, cmd_start, handle_xray_result
from aiogram.types import Message, Chat, User
import base64

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


class TestHandleXrayResult(unittest.TestCase):
    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast_photo', new_callable=MagicMock)
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_xray_result_with_image(self, mock_broadcast, mock_broadcast_photo, mock_run_coroutine_threadsafe):
        mock_broadcast.return_value = "mocked_coro"
        mock_broadcast_photo.return_value = "mocked_coro_photo"

        loop = MagicMock()
        payload = {
            'image_b64': base64.b64encode(b"test_image").decode('utf-8'),
            'report': 'Test report',
            'patient_name': 'Ivan Ivanov',
            'file': 'xray.jpg'
        }

        handle_xray_result('test_topic', payload, loop)

        # Check run_coroutine_threadsafe is called twice
        self.assertEqual(mock_run_coroutine_threadsafe.call_count, 2)

        # First call is broadcast_photo
        mock_broadcast_photo.assert_called_once_with(b"test_image", "🦷 *Новый рентген проанализирован!*\n👤 _Пациент: Ivan Ivanov_\nПолный отчет следующим сообщением.", 'Test report', role='doctor')

        # Second call is broadcast text to admin
        mock_broadcast.assert_called_once_with("🔄 *Система*: Снимок xray.jpg (Пациент: Ivan Ivanov) отправлен врачам.", role='admin')

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast_photo', new_callable=MagicMock)
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_xray_result_without_image(self, mock_broadcast, mock_broadcast_photo, mock_run_coroutine_threadsafe):
        mock_broadcast.return_value = "mocked_coro"

        loop = MagicMock()
        payload = {
            'report': 'Test report',
            'patient_name': 'Ivan Ivanov'
        }

        handle_xray_result('test_topic', payload, loop)

        # Check run_coroutine_threadsafe is called once
        self.assertEqual(mock_run_coroutine_threadsafe.call_count, 1)

        # Call is broadcast text to doctor
        mock_broadcast.assert_called_once_with("🦷 *Анализ снимка готов*\n👤 _Пациент: Ivan Ivanov_\n\nНаходки:\nTest report\n", role='doctor')

        mock_broadcast_photo.assert_not_called()

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_xray_result_patient_name_formatting(self, mock_broadcast, mock_run_coroutine_threadsafe):
        mock_broadcast.return_value = "mocked_coro"

        loop = MagicMock()

        # Test case 1: Unknown patient
        payload_unknown = {
            'report': 'Test report',
            'patient_name': 'Неизвестен'
        }
        handle_xray_result('test_topic', payload_unknown, loop)
        mock_broadcast.assert_called_with("🦷 *Анализ снимка готов*\n👤 _Пациент: неизвестен (нет записи)_\n\nНаходки:\nTest report\n", role='doctor')

        # Test case 2: Missing patient
        payload_missing = {
            'report': 'Test report'
        }
        handle_xray_result('test_topic', payload_missing, loop)
        mock_broadcast.assert_called_with("🦷 *Анализ снимка готов*\n👤 _Пациент: неизвестен (нет записи)_\n\nНаходки:\nTest report\n", role='doctor')

        # Test case 3: Valid patient
        payload_valid = {
            'report': 'Test report',
            'patient_name': 'Petr Petrov'
        }
        handle_xray_result('test_topic', payload_valid, loop)
        mock_broadcast.assert_called_with("🦷 *Анализ снимка готов*\n👤 _Пациент: Petr Petrov_\n\nНаходки:\nTest report\n", role='doctor')


if __name__ == '__main__':
    unittest.main()
