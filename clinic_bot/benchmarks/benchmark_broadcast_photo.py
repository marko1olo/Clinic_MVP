import asyncio
import time
import logging

logging.basicConfig(level=logging.ERROR)

class MockBot:
    async def send_photo(self, chat_id, photo, caption=None, parse_mode=None):
        await asyncio.sleep(0.1)  # Simulate network latency (photo is heavier)

    async def send_message(self, chat_id, text, parse_mode=None):
        await asyncio.sleep(0.05)  # Simulate network latency

bot = MockBot()
users = list(range(10)) # fewer users to be fast

class BufferedInputFile:
    def __init__(self, *args, **kwargs):
        pass

async def broadcast_photo_sequential(photo_bytes, caption, report_text):
    for chat_id in users:
        try:
            input_file = BufferedInputFile(photo_bytes, filename="xray.jpg")
            await bot.send_photo(chat_id, photo=input_file, caption=caption, parse_mode="Markdown")

            # Send the rest as text
            max_len = 4000
            for i in range(0, len(report_text), max_len):
                chunk = report_text[i:i+max_len]
                await bot.send_message(chat_id, text=chunk)
        except Exception as e:
            pass

async def broadcast_photo_concurrent(photo_bytes, caption, report_text):
    async def send_to_user(chat_id):
        try:
            input_file = BufferedInputFile(photo_bytes, filename="xray.jpg")
            await bot.send_photo(chat_id, photo=input_file, caption=caption, parse_mode="Markdown")

            # Send the rest as text
            max_len = 4000
            for i in range(0, len(report_text), max_len):
                chunk = report_text[i:i+max_len]
                await bot.send_message(chat_id, text=chunk)
        except Exception as e:
            pass

    await asyncio.gather(*(send_to_user(chat_id) for chat_id in users))

async def main():
    print("Benchmarking sequential photo broadcast to 10 users...")
    start = time.time()
    await broadcast_photo_sequential(b"abc", "caption", "a"*10000) # 3 chunks
    seq_time = time.time() - start
    print(f"Sequential time: {seq_time:.2f} seconds")

    print("Benchmarking concurrent photo broadcast to 10 users...")
    start = time.time()
    await broadcast_photo_concurrent(b"abc", "caption", "a"*10000)
    conc_time = time.time() - start
    print(f"Concurrent time: {conc_time:.2f} seconds")

if __name__ == "__main__":
    asyncio.run(main())
