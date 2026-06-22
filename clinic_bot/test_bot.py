import sys
import asyncio
from unittest.mock import MagicMock, patch, ANY

sys.path.insert(0, '.')
from clinic_bot.bot import on_mqtt_message

def test_on_mqtt_message_invalid_json():
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

def test_on_mqtt_message_valid_json():
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
