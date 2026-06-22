import time
from openai import OpenAI

GROQ_API_KEYS = [
    "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",
    "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"
]

def benchmark_current(n):
    start = time.time()
    for _ in range(n):
        for api_key in GROQ_API_KEYS:
            client = OpenAI(
                api_key=api_key,
                base_url="https://api.groq.com/openai/v1",
                timeout=30.0,
                max_retries=0
            )
    return time.time() - start

CLIENT_CACHE = {}
def get_client(api_key):
    if api_key not in CLIENT_CACHE:
        CLIENT_CACHE[api_key] = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
            timeout=30.0,
            max_retries=0
        )
    return CLIENT_CACHE[api_key]

def benchmark_optimized(n):
    start = time.time()
    for _ in range(n):
        for api_key in GROQ_API_KEYS:
            client = get_client(api_key)
    return time.time() - start

n = 1000
t1 = benchmark_current(n)
t2 = benchmark_optimized(n)

print(f"Current: {t1:.4f}s")
print(f"Optimized: {t2:.4f}s")
