from aiogram import Dispatcher, Router

dp = Dispatcher()
router = Router()

dp.include_router(router)
print("Handlers registered successfully!")
