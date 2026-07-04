import pytest
from unittest.mock import patch, MagicMock
import sys
import os

# Mock out any potential missing dependencies that might cause import errors when testing
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

# Ensure we can import gui.app properly
from gui.app import make_groq_client

def test_make_groq_client():
    client = make_groq_client("test_key", use_proxy=False)
    assert client.api_key == "test_key"
    assert str(client.base_url) == "https://api.groq.com/openai/v1/"
    assert client.timeout == 12.0

def test_make_groq_client_with_proxy():
    client = make_groq_client("test_key", use_proxy=True)
    assert client.api_key == "test_key"
    assert str(client.base_url) == "https://api.groq.com/openai/v1/"
    assert client.timeout == 20.0
    assert hasattr(client, "_client")
