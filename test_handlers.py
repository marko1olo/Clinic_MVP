from aiogram import Dispatcher, Router
from aiogram.types import Message
from aiogram.filters.command import CommandStart

dp = Dispatcher()
router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    pass

dp.include_router(router)
print("Handlers registered successfully!")
