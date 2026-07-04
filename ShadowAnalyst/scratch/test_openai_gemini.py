import os
from openai import OpenAI

key = "AQ.Ab8RN6I0rdGYG0hCAGheByDr_2X-QEHVHq3Xx5wAdi9lOo2qbw"
base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
model_name = "gemini-3.5-flash"

client = OpenAI(api_key=key, base_url=base_url)

try:
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "user", "content": "Hello! How are you?"}
        ],
        max_tokens=50
    )
    print("Full Response Object:")
    print(response)
    print("\nChoice message content:")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
