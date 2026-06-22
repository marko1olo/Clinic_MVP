import pytest
import logging
import sys
import os
from unittest.mock import MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import on_mqtt_message

def test_on_mqtt_message_exception_handling(caplog):
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

    with caplog.at_level(logging.ERROR):
        # This would raise an exception if not properly caught
        on_mqtt_message(client, userdata, msg)

    # Verify the error was properly logged
    assert any("Error processing MQTT message: Simulated decode error" in record.message for record in caplog.records)

def test_on_mqtt_message_missing_loop(caplog):
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
