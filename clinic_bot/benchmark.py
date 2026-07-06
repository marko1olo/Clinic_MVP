import os
import time

# Create lots of fake admins and doctors
num_users = 1000
admins = ",".join(str(i) for i in range(1, num_users + 1))
doctors = ",".join(str(i) for i in range(num_users + 1, 2 * num_users + 1))

os.environ["INITIAL_ADMINS"] = admins
os.environ["INITIAL_DOCTORS"] = doctors

# We need to wipe db because if they exist it's a bit different
import sqlite3
if os.path.exists("bot_users.db"):
    os.remove("bot_users.db")

start_time = time.time()
import db
end_time = time.time()

print(f"Time taken: {end_time - start_time:.4f} seconds")
