import pytest
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'gui')))

@patch('app.make_groq_client')
@patch('app.groq_use_proxy', False)
def test_groq_chat_success(mock_make_client):
    from app import groq_chat

    # Setup mock
    mock_client = MagicMock()
    mock_make_client.return_value = mock_client
    mock_client.chat.completions.create.return_value = "Success Response"

    # Test
    result = groq_chat("fake_api_key", model="fake-model", messages=[{"role": "user", "content": "hi"}])

    # Assert
    assert result == "Success Response"
    mock_make_client.assert_called_once_with("fake_api_key", use_proxy=False)
    mock_client.chat.completions.create.assert_called_once_with(
        model="fake-model",
        messages=[{"role": "user", "content": "hi"}]
    )

@patch('app.make_groq_client')
@patch('app.groq_use_proxy', False)
@patch('app.ensure_tunnel')
def test_groq_chat_connection_error_fallback(mock_ensure_tunnel, mock_make_client):
    from app import groq_chat

    # Setup mock for primary client failing with connection error
    mock_client_fail = MagicMock()
    mock_client_fail.chat.completions.create.side_effect = Exception("Connection timeout")

    # Setup mock for fallback client succeeding
    mock_client_success = MagicMock()
    mock_client_success.chat.completions.create.return_value = "Fallback Response"

    # make_groq_client is called twice: first fails, second succeeds
    mock_make_client.side_effect = [mock_client_fail, mock_client_success]

    # ensure_tunnel returns True
    mock_ensure_tunnel.return_value = True

    # Test
    result = groq_chat("fake_api_key", model="fake-model", messages=[{"role": "user", "content": "hi"}])

    # Assert
    assert result == "Fallback Response"
    assert mock_make_client.call_count == 2
    mock_ensure_tunnel.assert_called_once()
    mock_client_success.chat.completions.create.assert_called_once()

@patch('app.make_groq_client')
@patch('app.groq_use_proxy', False)
def test_groq_chat_non_connection_error(mock_make_client):
    from app import groq_chat

    # Setup mock to fail with non-connection error
    mock_client = MagicMock()
    mock_client.chat.completions.create.side_effect = ValueError("Invalid parameter")
    mock_make_client.return_value = mock_client

    # Test that exception is re-raised
    with pytest.raises(ValueError, match="Invalid parameter"):
        groq_chat("fake_api_key", model="fake-model", messages=[{"role": "user", "content": "hi"}])
