import re

with open("ShadowAnalyst/watcher.py", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add _GROQ_CLIENTS = {}
cache_str = """
# Cache for OpenAI clients to avoid recreating them for every request
_GROQ_CLIENTS = {}
"""

code = code.replace("GROQ_VISION_MODEL = \"meta-llama/llama-4-scout-17b-16e-instruct\"",
                    "GROQ_VISION_MODEL = \"meta-llama/llama-4-scout-17b-16e-instruct\"\n" + cache_str)

# 2. Update analyze_image
search_pattern = """    for api_key in keys:
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
            timeout=30.0,
            max_retries=0
        )"""

replace_pattern = """    for api_key in keys:
        if api_key not in _GROQ_CLIENTS:
            _GROQ_CLIENTS[api_key] = OpenAI(
                api_key=api_key,
                base_url="https://api.groq.com/openai/v1",
                timeout=30.0,
                max_retries=0
            )
        client = _GROQ_CLIENTS[api_key]"""

code = code.replace(search_pattern, replace_pattern)

with open("ShadowAnalyst/watcher.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated ShadowAnalyst/watcher.py")
