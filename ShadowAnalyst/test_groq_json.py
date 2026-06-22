import os
import base64
from openai import OpenAI

api_key = os.environ.get("GROQ_API_KEY", "")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1",
)

def test_groq():
    # Provide a dummy base64 image (1x1 pixel) just to test format if it accepts, but better to use a real image if we can.
    # I'll just ask the model if it can output bounding box JSON to see its response format.
    system_prompt = (
        "Respond only with valid JSON. Analyze the image and find objects. "
        "Return output strictly in this JSON format: "
        '{"objects": [{"name": "object_name", "box": [xmin, ymin, xmax, ymax]}]}'
        " Use coordinates from 0 to 1000."
    )
    
    # Replace hardcoded image path with dummy base64 for testing purposes
    img_b64 = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    
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
        print("Response:", response.choices[0].message.content)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_groq()
