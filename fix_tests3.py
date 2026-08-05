import re

with open('clinic_bot/test_bot.py', 'r') as f:
    content = f.read()

# Add proper teardown to close unawaited mock coroutines
teardown = """
    def tearDown(self):
        import asyncio
        loop = asyncio.new_event_loop()
        try:
            for task in asyncio.all_tasks(loop):
                task.cancel()
        except:
            pass
        finally:
            loop.close()
"""
content = content.replace(
    '        self.topic = "test/xray"\n',
    '        self.topic = "test/xray"\n' + teardown
)

content = content.replace('async def mock_coro1(): pass\n        mock_broadcast_photo.return_value = mock_coro1()', 'pass')
content = content.replace('async def mock_coro2(): pass\n        mock_broadcast.return_value = mock_coro2()', 'pass')


with open('clinic_bot/test_bot.py', 'w') as f:
    f.write(content)
