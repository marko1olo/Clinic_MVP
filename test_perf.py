import time
import os
import shutil
import base64
from io import BytesIO
from PIL import Image
from ShadowAnalyst.watcher import analyze_image

# Create a dummy image
os.makedirs("Sample_Images", exist_ok=True)
img = Image.new('RGB', (100, 100), color = 'red')
img.save('Sample_Images/dummy.jpg')

# create dentalimage.md to prevent error
with open("ShadowAnalyst/dentalimage.md", "w") as f:
    f.write("test")

# Monkey patch OpenAI client to not make actual network requests for performance test
import openai
from unittest.mock import Mock

class MockChat:
    def __init__(self):
        self.completions = Mock()
        choice_mock = Mock()
        choice_mock.message.content = "dummy report"
        self.completions.create.return_value = Mock(choices=[choice_mock])

def mock_openai(*args, **kwargs):
    client = Mock()
    client.chat = MockChat()
    return client

openai.OpenAI = mock_openai

# Call it multiple times to see performance
def run_perf_test(iterations=100):
    start = time.time()
    for _ in range(iterations):
        analyze_image('Sample_Images/dummy.jpg')
    duration = time.time() - start
    print(f"Time for {iterations} iterations: {duration:.4f}s")
    print(f"Avg time per call: {(duration/iterations):.6f}s")

# Let's import watcher again after patching OpenAI just in case
import ShadowAnalyst.watcher
ShadowAnalyst.watcher.OpenAI = mock_openai

run_perf_test(1000)
