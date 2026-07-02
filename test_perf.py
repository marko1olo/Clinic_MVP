import asyncio
import time
from unittest.mock import MagicMock
from aiogram.types import Message, Chat, User
from clinic_bot import db

class MockDB:
    def __init__(self):
        self.users = {}

    def get_user_role(self, chat_id):
        # Simulate some IO blocking
        time.sleep(0.05)
        return self.users.get(chat_id)

    def add_user(self, chat_id, role, name=""):
        time.sleep(0.05)
        self.users[chat_id] = role

mock_db = MockDB()

async def blocking_cmd_start(message: Message):
    chat_id = message.chat.id
    # ORIGINAL
    role = mock_db.get_user_role(chat_id)
    if not role:
        mock_db.add_user(chat_id, 'guest', message.from_user.full_name)
        role = 'guest'

async def async_cmd_start(message: Message):
    chat_id = message.chat.id
    # OPTIMIZED
    role = await asyncio.to_thread(mock_db.get_user_role, chat_id)
    if not role:
        await asyncio.to_thread(mock_db.add_user, chat_id, 'guest', message.from_user.full_name)
        role = 'guest'

async def test_performance():
    messages = []
    for i in range(20):
        msg = MagicMock(spec=Message)
        msg.chat = MagicMock(spec=Chat)
        msg.chat.id = i
        msg.from_user = MagicMock(spec=User)
        msg.from_user.full_name = f"User {i}"
        messages.append(msg)

    print("Testing blocking version...")
    mock_db.users = {}
    start = time.time()
    await asyncio.gather(*(blocking_cmd_start(m) for m in messages))
    end = time.time()
    print(f"Blocking took: {end - start:.4f}s")

    print("Testing async version...")
    mock_db.users = {}
    start = time.time()
    await asyncio.gather(*(async_cmd_start(m) for m in messages))
    end = time.time()
    print(f"Async took: {end - start:.4f}s")

if __name__ == "__main__":
    asyncio.run(test_performance())
