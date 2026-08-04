import unittest
from unittest.mock import MagicMock, patch

from bot import on_mqtt_message

class TestOnMqttMessageException(unittest.TestCase):
    def test_on_mqtt_message_generic_exception(self):
        client = MagicMock()
        userdata = {'loop': MagicMock()}
        msg = MagicMock()
        msg.topic = 'test/topic'

        # Configure msg.payload.decode to raise a generic Exception
        msg.payload.decode.side_effect = Exception("Simulated generic error")

        with patch('bot.log.error') as mock_log_error:
            # Should not raise an exception
            on_mqtt_message(client, userdata, msg)

            # Verify it logged the error
            mock_log_error.assert_called_once()
            self.assertIn("Simulated generic error", mock_log_error.call_args[0][0])
