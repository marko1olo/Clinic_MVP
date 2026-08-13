import asyncio
import time
import sys

sys.path.insert(0, '.')
import db

async def benchmark_no_cache():
    start = time.perf_counter()
    for _ in range(100):
        users = await asyncio.to_thread(db.get_users_by_role, 'admin')
    duration = time.perf_counter() - start
    return duration

async def main():
    db.init_db()
    db.add_user(12345, 'admin', 'Test Admin')

    t1 = await benchmark_no_cache()
    print(f"Baseline (100 lookups): {t1:.4f}s")

if __name__ == "__main__":
    asyncio.run(main())
