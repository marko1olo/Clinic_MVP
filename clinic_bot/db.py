import sqlite3
from pathlib import Path

DB_FILE = str(Path(__file__).parent / 'bot_users.db')

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()
    # Check if we need to migrate the old table
    c.execute("PRAGMA table_info(users)")
    columns = [col['name'] for col in c.fetchall()]

    if columns and 'chat_id' in columns and 'user_id' not in columns:
        # We need to migrate:
        # Create new table, copy data, drop old, rename new
        c.execute('''
            CREATE TABLE users_new (
                user_id INTEGER PRIMARY KEY,
                username TEXT,
                full_name TEXT,
                role TEXT NOT NULL
            )
        ''')
        c.execute('''
            INSERT INTO users_new (user_id, full_name, role)
            SELECT chat_id, name, role FROM users
        ''')
        c.execute('DROP TABLE users')
        c.execute('ALTER TABLE users_new RENAME TO users')
    else:
        # Fresh initialization
        c.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                username TEXT,
                full_name TEXT,
                role TEXT NOT NULL
            )
        ''')
    conn.commit()
    conn.close()

def add_user(user_id: int, username: str, full_name: str, role: str = "user"):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT OR REPLACE INTO users (user_id, username, full_name, role)
            VALUES (?, ?, ?, ?)
        """, (user_id, username, full_name, role))
        conn.commit()
    finally:
        conn.close()

def get_users_by_role(role: str):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT user_id FROM users WHERE role = ?', (role,))
    users = [row['user_id'] for row in c.fetchall()]
    conn.close()
    return users

def get_user_role(user_id: int):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT role FROM users WHERE user_id = ?', (user_id,))
    row = c.fetchone()
    conn.close()
    return row['role'] if row else None

# Инициализация при импорте
init_db()

# Дефолтные админы (из старого кода)
add_user(8721416291, 'danat', 'Danat', 'admin')
add_user(7716348189, 'danat2', 'Danat 2', 'admin')
add_user(8721416291, 'danat_doctor', 'Danat Doctor', 'doctor') # Добавляем для теста
add_user(7716348189, 'danat_doctor2', 'Danat Doctor 2', 'doctor') # Добавляем для теста
