import asyncio
import time
import sys

sys.path.insert(0, '.')
import db

_role_cache = {}
CACHE_TTL = 60.0

async def get_cached_users_by_role(role: str):
    now = time.monotonic()
    if role not in _role_cache or now - _role_cache[role]['timestamp'] > CACHE_TTL:
        users = await asyncio.to_thread(db.get_users_by_role, role)
        _role_cache[role] = {'users': users, 'timestamp': now}
    return _role_cache[role]['users']

async def benchmark_cache():
    start = time.perf_counter()
    for _ in range(100):
        users = await get_cached_users_by_role('admin')
    duration = time.perf_counter() - start
    return duration

async def main():
    db.init_db()
    db.add_user(12345, 'admin', 'Test Admin')

    t1 = await benchmark_cache()
    print(f"Cached (100 lookups): {t1:.4f}s")

if __name__ == "__main__":
    asyncio.run(main())
