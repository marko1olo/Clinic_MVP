import asyncio
import time
import requests
import httpx
from unittest.mock import patch, MagicMock

# Define a mock request content
MOCK_AUDIO = b"mock audio data"

def sync_request():
    start = time.time()
    r = requests.post("https://mock-url", json={"test": "data"}, timeout=20)
    end = time.time()
    return end - start

async def async_request():
    start = time.time()
    async with httpx.AsyncClient() as client:
        r = await client.post("https://mock-url", json={"test": "data"}, timeout=20.0)
    end = time.time()
    return end - start

async def run_benchmark():
    print("Benchmarking HTTP requests (simulating blocking vs async)")

    # We'll use respx to mock httpx, and responses to mock requests

    with patch('requests.post') as mock_req, patch('httpx.AsyncClient.post') as mock_httpx:
        # Mock requests.post
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.content = MOCK_AUDIO

        # Make the sync mock sleep to simulate network IO
        def sync_side_effect(*args, **kwargs):
            time.sleep(0.5)
            return mock_resp
        mock_req.side_effect = sync_side_effect

        # Mock httpx.AsyncClient.post
        async def async_side_effect(*args, **kwargs):
            await asyncio.sleep(0.5)
            mock_async_resp = MagicMock()
            mock_async_resp.status_code = 200
            mock_async_resp.content = MOCK_AUDIO
            return mock_async_resp
        mock_httpx.side_effect = async_side_effect

        # Test 1: Multiple sync requests concurrently (in an async loop context)
        print("\nTest 1: Multiple sync requests concurrently (blocking the event loop)")
        start_sync = time.time()
        # In a real app, these would block the loop. We simulate this by running them sequentially
        # as they would if executed in async functions without an executor.
        for _ in range(5):
            sync_request()
        end_sync = time.time()
        sync_time = end_sync - start_sync
        print(f"Sync time (5 sequential calls): {sync_time:.4f}s")

        # Test 2: Multiple async requests concurrently
        print("\nTest 2: Multiple async requests concurrently")
        start_async = time.time()
        tasks = [async_request() for _ in range(5)]
        await asyncio.gather(*tasks)
        end_async = time.time()
        async_time = end_async - start_async
        print(f"Async time (5 concurrent calls): {async_time:.4f}s")

        print(f"\nImprovement: {sync_time / async_time:.2f}x faster under concurrency")

if __name__ == "__main__":
    asyncio.run(run_benchmark())
