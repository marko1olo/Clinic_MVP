import base64
import os
import unittest
from unittest.mock import patch, MagicMock, mock_open
from io import BytesIO

import base64
from openai import OpenAI

def run_groq_query(client, img_path):
    system_prompt = (
        "Respond only with valid JSON. Analyze the image and find objects. "
        "Return output strictly in this JSON format: "
        '{"objects": [{"name": "object_name", "box": [xmin, ymin, xmax, ymax]}]}'
        " Use coordinates from 0 to 1000."
    )

    try:
        with open(img_path, "rb") as f:
            img_b64 = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode("utf-8")
    except FileNotFoundError:
        img_b64 = "data:image/jpeg;base64,dummybase64data"

    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": system_prompt},
                        {"type": "image_url", "image_url": {"url": img_b64}}
                    ]
                }
            ],
            response_format={"type": "json_object"},
            max_tokens=300
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {e}"

class TestGroqJson(unittest.TestCase):
    def setUp(self):
        self.client = MagicMock()
        self.img_path = r"C:\Users\danat\Desktop\stomchat\photo_2026-05-18_18-39-46.jpg"

    @patch("builtins.open", new_callable=mock_open, read_data=b"dummy_image_content")
    def test_groq_success(self, mock_file):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = '{"objects": []}'
        self.client.chat.completions.create.return_value = mock_response

        # Run function
        result = run_groq_query(self.client, self.img_path)

        # Assertions
        mock_file.assert_called_once_with(self.img_path, "rb")
        self.assertEqual(result, '{"objects": []}')

        # Verify base64 encoding logic
        expected_b64 = "data:image/jpeg;base64," + base64.b64encode(b"dummy_image_content").decode("utf-8")

        # Verify client called with correct arguments
        self.client.chat.completions.create.assert_called_once()
        call_args = self.client.chat.completions.create.call_args[1]
        self.assertEqual(call_args["model"], "meta-llama/llama-4-scout-17b-16e-instruct")
        self.assertEqual(call_args["response_format"], {"type": "json_object"})
        self.assertEqual(call_args["max_tokens"], 300)
        self.assertEqual(call_args["messages"][0]["content"][1]["image_url"]["url"], expected_b64)

    @patch("builtins.open", side_effect=FileNotFoundError)
    def test_groq_file_not_found(self, mock_file):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = '{"objects": []}'
        self.client.chat.completions.create.return_value = mock_response

        # Run function
        result = run_groq_query(self.client, self.img_path)

        # Assertions
        mock_file.assert_called_once_with(self.img_path, "rb")
        self.assertEqual(result, '{"objects": []}')

        # Verify fallback base64
        self.client.chat.completions.create.assert_called_once()
        call_args = self.client.chat.completions.create.call_args[1]
        self.assertEqual(call_args["messages"][0]["content"][1]["image_url"]["url"], "data:image/jpeg;base64,dummybase64data")

    @patch("builtins.open", new_callable=mock_open, read_data=b"dummy_image_content")
    def test_groq_api_error(self, mock_file):
        # Setup mock to raise exception
        self.client.chat.completions.create.side_effect = Exception("API connection failed")

        # Run function
        result = run_groq_query(self.client, self.img_path)

        # Assertions
        self.assertEqual(result, "Error: API connection failed")

if __name__ == "__main__":
    unittest.main()
