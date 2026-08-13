import unittest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message, cmd_start, cmd_test, handle_alert_admin
from bot import on_mqtt_message, cmd_start, handle_default
from bot import on_mqtt_message, cmd_start, handle_review_neg
from bot import on_mqtt_message, cmd_start, handle_xray_result
from bot import on_mqtt_message, cmd_start, handle_marketing_send
from aiogram.types import Message, Chat, User
import base64

class TestHandleAlertAdmin(unittest.TestCase):
    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_alert_admin_with_text(self, mock_broadcast, mock_run_coroutine_threadsafe):
        loop = MagicMock()
        payload = {'text': 'Test alert payload'}

        # Avoid AsyncMock warnings for coroutines that are never awaited
        mock_broadcast.return_value = 'mock_coroutine'

        handle_alert_admin('clinic/alerts/admin', payload, loop)

        mock_broadcast.assert_called_once_with("🚨 *АЛЕРТ*\n\nTest alert payload", role='admin')
        mock_run_coroutine_threadsafe.assert_called_once_with('mock_coroutine', loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_handle_alert_admin_without_text(self, mock_broadcast, mock_run_coroutine_threadsafe):
        loop = MagicMock()
        payload = {'key': 'value'}

        mock_broadcast.return_value = 'mock_coroutine'

        handle_alert_admin('clinic/alerts/admin', payload, loop)

        mock_broadcast.assert_called_once_with("🚨 *АЛЕРТ*\n\n{'key': 'value'}", role='admin')
        mock_run_coroutine_threadsafe.assert_called_once_with('mock_coroutine', loop)

class TestBotMqtt(unittest.TestCase):
    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast')
    def test_handle_default(self, mock_broadcast, mock_run_coroutine_threadsafe):
        """
        Test that handle_default formats the message correctly and broadcasts it.
        """
        topic = 'unknown/topic'
        payload = b'some_payload'
        loop = MagicMock()

        handle_default(topic, payload, loop)

        expected_text = f"📨 `{topic}`\n\n{str(payload)}"
        mock_broadcast.assert_called_once_with(expected_text, role='admin')

        # Verify run_coroutine_threadsafe was called with loop
        self.assertEqual(mock_run_coroutine_threadsafe.call_count, 1)
        self.assertEqual(mock_run_coroutine_threadsafe.call_args[0][1], loop)

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

    @patch('bot.handle_default')
    def test_on_mqtt_message_json_decode_error(self, mock_handle_default):
        """
        Test that on_mqtt_message correctly handles JSONDecodeError by falling back
        to a text payload dictionary.
        """
        client = MagicMock()
        loop = MagicMock()
        userdata = {'loop': loop}
        msg = MagicMock()
        msg.topic = 'test/topic'
        msg.payload = b'{invalid_json}'

        on_mqtt_message(client, userdata, msg)

        mock_handle_default.assert_called_once_with('test/topic', {'text': '{invalid_json}'}, loop)


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


# Ensure clinic_bot module is in sys.path

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
        mock_add_user.assert_called_once_with(12345, 'guest', "Test User")

        # Verify the answer was called
        self.mock_message.answer.assert_called_once()
        args, kwargs = self.mock_message.answer.call_args
        self.assertIn(r"Ваш chat\_id: `12345`", args[0])
        self.assertIn("Ваша роль: `guest`", args[0])
        self.assertEqual(kwargs.get("parse_mode"), "Markdown")


    async def test_cmd_test(self):
        # Act
        await cmd_test(self.mock_message)

        # Assert
        self.mock_message.answer.assert_called_once()
        args, kwargs = self.mock_message.answer.call_args
        self.assertIn("🦷 *Тест уведомления*", args[0])
        self.assertIn("Снимок: `test_xray.png`", args[0])
        self.assertIn("Находки:", args[0])
        self.assertEqual(kwargs.get("parse_mode"), "Markdown")


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

        mock_broadcast_photo.assert_not_not_called = lambda: mock_broadcast_photo.assert_not_called()
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

    @patch('bot.asyncio.run_coroutine_threadsafe')
    @patch('bot.broadcast_photo', new_callable=MagicMock)
    @patch('bot.broadcast', new_callable=MagicMock)
    def test_on_mqtt_message_xray_result(self, mock_broadcast, mock_broadcast_photo, mock_run_coroutine_threadsafe):
        import json
        from bot import on_mqtt_message
        from config.settings import TOPIC_XRAY_RESULT

        mock_broadcast.return_value = "mocked_coro"
        mock_broadcast_photo.return_value = "mocked_coro_photo"

        loop = MagicMock()
        client = MagicMock()
        userdata = {'loop': loop}
        msg = MagicMock()
        msg.topic = TOPIC_XRAY_RESULT

        payload_dict = {
            'image_b64': base64.b64encode(b"test_image").decode('utf-8'),
            'report': 'Test report integration',
            'patient_name': 'Sergey Sergeev',
            'file': 'xray_integration.jpg'
        }
        msg.payload = json.dumps(payload_dict).encode('utf-8')

        on_mqtt_message(client, userdata, msg)

        # Check run_coroutine_threadsafe is called twice
        self.assertEqual(mock_run_coroutine_threadsafe.call_count, 2)

        # First call is broadcast_photo
        mock_broadcast_photo.assert_called_once_with(
            b"test_image",
            "🦷 *Новый рентген проанализирован!*\n👤 _Пациент: Sergey Sergeev_\nПолный отчет следующим сообщением.",
            'Test report integration',
            role='doctor'
        )

        # Second call is broadcast text to admin
        mock_broadcast.assert_called_once_with(
            "🔄 *Система*: Снимок xray_integration.jpg (Пациент: Sergey Sergeev) отправлен врачам.",
            role='admin'
        )


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



class TestStartMqtt(unittest.TestCase):
    @patch('bot.mqtt.Client')
    @patch('bot.MQTT_USER', 'test_user')
    @patch('bot.MQTT_PASS', 'test_pass')
    def test_start_mqtt(self, mock_mqtt_client_class):
        mock_client = MagicMock()
        mock_mqtt_client_class.return_value = mock_client

        # Break the infinite loop using BaseException
        mock_client.loop_forever.side_effect = KeyboardInterrupt("Stop loop")

        loop = MagicMock()

        from bot import start_mqtt, on_mqtt_message
        from config.settings import (
            TOPIC_XRAY_RESULT, TOPIC_ALERT_ADMIN, TOPIC_REVIEW_NEG, TOPIC_MARKETING_SEND,
            MQTT_HOST, MQTT_PORT
        )

        with self.assertRaises(KeyboardInterrupt):
            start_mqtt(loop)

        # Assert client configurations
        mock_client.user_data_set.assert_called_once_with({'loop': loop})
        mock_client.username_pw_set.assert_called_once_with('test_user', 'test_pass')
        self.assertEqual(mock_client.on_message, on_mqtt_message)

        # Test on_connect lambda
        self.assertTrue(callable(mock_client.on_connect))
        mock_client.on_connect(mock_client, None, None, 0, None)
        mock_client.subscribe.assert_called_once_with([
            (TOPIC_XRAY_RESULT, 1),
            (TOPIC_ALERT_ADMIN, 1),
            (TOPIC_REVIEW_NEG, 1),
            (TOPIC_MARKETING_SEND, 1),
        ])

        # Test on_disconnect lambda
        self.assertTrue(callable(mock_client.on_disconnect))
        mock_client.on_disconnect(mock_client, None, None, 0, None)

        mock_client.connect.assert_called_once_with(MQTT_HOST, MQTT_PORT, keepalive=60)
        mock_client.loop_forever.assert_called_once()

    @patch('bot.mqtt.Client')
    @patch('bot.MQTT_USER', '')
    def test_start_mqtt_no_user(self, mock_mqtt_client_class):
        mock_client = MagicMock()
        mock_mqtt_client_class.return_value = mock_client

        mock_client.connect.side_effect = KeyboardInterrupt("Stop loop")

        loop = MagicMock()

        from bot import start_mqtt

        with self.assertRaises(KeyboardInterrupt):
            start_mqtt(loop)

        mock_client.username_pw_set.assert_not_called()

    @patch('bot.mqtt.Client')
    @patch('bot.time.sleep')
    @patch('bot.MQTT_USER', 'test_user')
    @patch('bot.MQTT_PASS', 'test_pass')
    def test_start_mqtt_exception_handling(self, mock_sleep, mock_mqtt_client_class):
        mock_client = MagicMock()
        mock_mqtt_client_class.return_value = mock_client

        # Raise Exception first time, then KeyboardInterrupt to break loop
        mock_client.loop_forever.side_effect = [Exception("Test connection error"), KeyboardInterrupt("Stop loop")]

        loop = MagicMock()

        from bot import start_mqtt

        with self.assertRaises(KeyboardInterrupt):
            start_mqtt(loop)

        mock_sleep.assert_called_once_with(5)
        self.assertEqual(mock_client.loop_forever.call_count, 2)


class TestBotFallbackException(unittest.TestCase):
    def test_on_mqtt_message_json_decode_error_and_exception(self):
        client = MagicMock()
        userdata = {'loop': MagicMock()}
        msg = MagicMock()
        msg.topic = 'test/topic'
        msg.payload = MagicMock()
        msg.payload.decode.side_effect = [
            'invalid_json',
            Exception('Fallback decoding error')
        ]
        with self.assertLogs('bot', level='ERROR') as log_capture:
            on_mqtt_message(client, userdata, msg)
        self.assertTrue(any("Error processing MQTT message: Fallback decoding error" in log for log in log_capture.output))

if __name__ == '__main__':
    unittest.main()
