import pytest
from unittest.mock import patch, MagicMock
from ShadowAnalyst.gui.app import make_gemini_client
import httpx
from openai import OpenAI

def test_make_gemini_client_no_proxy():
    client = make_gemini_client("test_api_key", use_proxy=False)
    assert isinstance(client, OpenAI)
    assert client.api_key == "test_api_key"
    assert str(client.base_url) == "https://generativelanguage.googleapis.com/v1beta/openai/"
    assert client.timeout == 12.0
    assert client.max_retries == 1

@patch("ShadowAnalyst.gui.app.SOCKS_PROXY", "socks5://127.0.0.1:9050")
@patch("httpx.Client", autospec=True)
def test_make_gemini_client_with_proxy(mock_httpx_client_cls):
    mock_client_instance = mock_httpx_client_cls.return_value
    mock_client_instance.timeout = 20.0 # Match what openai's init expects

    # Needs to pass the isinstance(http_client, httpx.Client) check in openai
    # We can patch OpenAI directly to avoid the real init check failing on mocked httpx.Client
    with patch("ShadowAnalyst.gui.app.OpenAI") as mock_openai:
        mock_openai.return_value = MagicMock(spec=OpenAI)
        mock_openai.return_value.api_key = "test_api_key"
        mock_openai.return_value.timeout = 20.0

        client = make_gemini_client("test_api_key", use_proxy=True)

        # Verify httpx.Client was called with the right arguments
        mock_httpx_client_cls.assert_called_once_with(proxy="socks5://127.0.0.1:9050", timeout=20.0)

        # Verify OpenAI was initialized correctly
        mock_openai.assert_called_once()
        kwargs = mock_openai.call_args.kwargs
        assert kwargs["api_key"] == "test_api_key"
        assert kwargs["base_url"] == "https://generativelanguage.googleapis.com/v1beta/openai/"
        assert kwargs["timeout"] == 20.0
        assert kwargs["max_retries"] == 1
        assert kwargs["http_client"] == mock_client_instance

        assert client.api_key == "test_api_key"
        assert client.timeout == 20.0
