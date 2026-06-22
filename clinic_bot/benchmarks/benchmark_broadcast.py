import asyncio
import time
import logging

logging.basicConfig(level=logging.ERROR)

class MockBot:
    async def send_message(self, chat_id, text, parse_mode=None):
        await asyncio.sleep(0.05)  # Simulate network latency

bot = MockBot()
users = list(range(100))

async def broadcast_sequential(text: str):
    for chat_id in users:
        try:
            await bot.send_message(chat_id, text, parse_mode="Markdown")
        except Exception as e:
            pass

async def broadcast_concurrent(text: str):
    async def send_to_user(chat_id):
        try:
            await bot.send_message(chat_id, text, parse_mode="Markdown")
        except Exception as e:
            pass

    await asyncio.gather(*(send_to_user(chat_id) for chat_id in users))

async def main():
    print("Benchmarking sequential broadcast to 100 users...")
    start = time.time()
    await broadcast_sequential("test")
    seq_time = time.time() - start
    print(f"Sequential time: {seq_time:.2f} seconds")

    print("Benchmarking concurrent broadcast to 100 users...")
    start = time.time()
    await broadcast_concurrent("test")
    conc_time = time.time() - start
    print(f"Concurrent time: {conc_time:.2f} seconds")

if __name__ == "__main__":
    asyncio.run(main())
