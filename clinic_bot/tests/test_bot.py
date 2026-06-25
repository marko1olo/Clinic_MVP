import unittest
import logging
import sys
import os
from unittest.mock import MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import json
import base64
from unittest.mock import patch, ANY
from bot import on_mqtt_message, TOPIC_XRAY_RESULT, TOPIC_ALERT_ADMIN, TOPIC_REVIEW_NEG, TOPIC_MARKETING_SEND

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

    @patch('bot.asyncio.run_coroutine_threadsafe')
    def test_on_mqtt_message_xray_with_image(self, mock_run_coroutine):
        client = MagicMock()
        mock_loop = MagicMock()
        userdata = {'loop': mock_loop}
        msg = MagicMock()
        msg.topic = TOPIC_XRAY_RESULT

        test_payload = {
            'image_b64': base64.b64encode(b'test_image_data').decode('utf-8'),
            'report': 'Test report',
            'patient_name': 'John Doe',
            'file': 'test.png'
        }
        msg.payload = json.dumps(test_payload).encode('utf-8')

        with patch('bot.broadcast_photo', new_callable=MagicMock, return_value='coro_photo') as mock_broadcast_photo, \
             patch('bot.broadcast', new_callable=MagicMock, return_value='coro_broadcast') as mock_broadcast:

            on_mqtt_message(client, userdata, msg)

            mock_broadcast_photo.assert_called_once()
            args, kwargs = mock_broadcast_photo.call_args
            self.assertEqual(args[0], b'test_image_data')
            self.assertIn("John Doe", args[1])
            self.assertEqual(args[2], 'Test report')
            self.assertEqual(kwargs.get('role'), 'doctor')

            mock_broadcast.assert_called_once()
            args, kwargs = mock_broadcast.call_args
            self.assertIn("John Doe", args[0])
            self.assertIn("test.png", args[0])
            self.assertEqual(kwargs.get('role'), 'admin')

            self.assertEqual(mock_run_coroutine.call_count, 2)
            mock_run_coroutine.assert_any_call('coro_photo', mock_loop)
            mock_run_coroutine.assert_any_call('coro_broadcast', mock_loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    def test_on_mqtt_message_xray_no_image(self, mock_run_coroutine):
        client = MagicMock()
        mock_loop = MagicMock()
        userdata = {'loop': mock_loop}
        msg = MagicMock()
        msg.topic = TOPIC_XRAY_RESULT

        test_payload = {
            'report': 'Test report no image',
            'patient_name': 'Jane Doe'
        }
        msg.payload = json.dumps(test_payload).encode('utf-8')

        with patch('bot.broadcast', new_callable=MagicMock, return_value='coro_broadcast') as mock_broadcast:
            on_mqtt_message(client, userdata, msg)

            mock_broadcast.assert_called_once()
            args, kwargs = mock_broadcast.call_args
            self.assertIn("Jane Doe", args[0])
            self.assertIn("Test report no image", args[0])
            self.assertEqual(kwargs.get('role'), 'doctor')

            mock_run_coroutine.assert_called_once_with('coro_broadcast', mock_loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    def test_on_mqtt_message_alert_admin(self, mock_run_coroutine):
        client = MagicMock()
        mock_loop = MagicMock()
        userdata = {'loop': mock_loop}
        msg = MagicMock()
        msg.topic = TOPIC_ALERT_ADMIN

        test_payload = {'text': 'System failure'}
        msg.payload = json.dumps(test_payload).encode('utf-8')

        with patch('bot.broadcast', new_callable=MagicMock, return_value='coro_broadcast') as mock_broadcast:
            on_mqtt_message(client, userdata, msg)

            mock_broadcast.assert_called_once()
            args, kwargs = mock_broadcast.call_args
            self.assertIn("System failure", args[0])
            self.assertEqual(kwargs.get('role'), 'admin')

            mock_run_coroutine.assert_called_once_with('coro_broadcast', mock_loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    def test_on_mqtt_message_review_neg(self, mock_run_coroutine):
        client = MagicMock()
        mock_loop = MagicMock()
        userdata = {'loop': mock_loop}
        msg = MagicMock()
        msg.topic = TOPIC_REVIEW_NEG

        test_payload = {'patient': 'Angry Joe', 'text': 'Terrible service'}
        msg.payload = json.dumps(test_payload).encode('utf-8')

        with patch('bot.broadcast', new_callable=MagicMock, return_value='coro_broadcast') as mock_broadcast:
            on_mqtt_message(client, userdata, msg)

            mock_broadcast.assert_called_once()
            args, kwargs = mock_broadcast.call_args
            self.assertIn("Angry Joe", args[0])
            self.assertIn("Terrible service", args[0])
            self.assertEqual(kwargs.get('role'), 'admin')

            mock_run_coroutine.assert_called_once_with('coro_broadcast', mock_loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    def test_on_mqtt_message_marketing_send(self, mock_run_coroutine):
        client = MagicMock()
        mock_loop = MagicMock()
        userdata = {'loop': mock_loop}
        msg = MagicMock()
        msg.topic = TOPIC_MARKETING_SEND

        test_payload = {'patient': 'Alice', 'draft': 'Promo code'}
        msg.payload = json.dumps(test_payload).encode('utf-8')

        with patch('bot.broadcast', new_callable=MagicMock, return_value='coro_broadcast') as mock_broadcast:
            on_mqtt_message(client, userdata, msg)

            mock_broadcast.assert_called_once()
            args, kwargs = mock_broadcast.call_args
            self.assertIn("Alice", args[0])
            self.assertIn("Promo code", args[0])
            self.assertEqual(kwargs.get('role'), 'admin')

            mock_run_coroutine.assert_called_once_with('coro_broadcast', mock_loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    def test_on_mqtt_message_unknown_topic(self, mock_run_coroutine):
        client = MagicMock()
        mock_loop = MagicMock()
        userdata = {'loop': mock_loop}
        msg = MagicMock()
        msg.topic = 'clinic/unknown/topic'

        test_payload = {'data': 'something'}
        msg.payload = json.dumps(test_payload).encode('utf-8')

        with patch('bot.broadcast', new_callable=MagicMock, return_value='coro_broadcast') as mock_broadcast:
            on_mqtt_message(client, userdata, msg)

            mock_broadcast.assert_called_once()
            args, kwargs = mock_broadcast.call_args
            self.assertIn("clinic/unknown/topic", args[0])
            self.assertIn("'data': 'something'", args[0])
            self.assertEqual(kwargs.get('role'), 'admin')

            mock_run_coroutine.assert_called_once_with('coro_broadcast', mock_loop)

    @patch('bot.asyncio.run_coroutine_threadsafe')
    def test_on_mqtt_message_invalid_json(self, mock_run_coroutine):
        client = MagicMock()
        mock_loop = MagicMock()
        userdata = {'loop': mock_loop}
        msg = MagicMock()
        msg.topic = 'clinic/some/topic'

        # Invalid JSON string
        msg.payload = b'Invalid JSON { payload'

        with patch('bot.broadcast', new_callable=MagicMock, return_value='coro_broadcast') as mock_broadcast:
            on_mqtt_message(client, userdata, msg)

            mock_broadcast.assert_called_once()
            args, kwargs = mock_broadcast.call_args
            self.assertIn("clinic/some/topic", args[0])
            self.assertIn("Invalid JSON { payload", args[0])
            self.assertEqual(kwargs.get('role'), 'admin')

            mock_run_coroutine.assert_called_once_with('coro_broadcast', mock_loop)

if __name__ == '__main__':
    unittest.main()

