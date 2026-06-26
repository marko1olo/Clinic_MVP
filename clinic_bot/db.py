import sqlite3
import threading
from pathlib import Path

DB_FILE = str(Path(__file__).parent / 'bot_users.db')

_local = threading.local()

def get_connection():
    if not hasattr(_local, 'conns'):
        _local.conns = {}
    if DB_FILE not in _local.conns:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        _local.conns[DB_FILE] = conn
    return _local.conns[DB_FILE]

def close_connections():
    if hasattr(_local, 'conns'):
        for conn in _local.conns.values():
            conn.close()
        _local.conns.clear()

def init_db():
    conn = get_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            chat_id INTEGER PRIMARY KEY,
            role TEXT NOT NULL,
            name TEXT
        )
    ''')
    conn.commit()

def add_user(chat_id: int, role: str, name: str = ""):
    conn = get_connection()
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO users (chat_id, role, name) VALUES (?, ?, ?)', (chat_id, role, name))
    conn.commit()

def get_users_by_role(role: str):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT chat_id FROM users WHERE role = ?', (role,))
    users = [row['chat_id'] for row in c.fetchall()]
    return users

def get_user_role(chat_id: int):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT role FROM users WHERE chat_id = ?', (chat_id,))
    row = c.fetchone()
    return row['role'] if row else None

# Инициализация при импорте
init_db()

# Дефолтные админы (из старого кода)
add_user(8721416291, 'admin', 'Danat')
add_user(7716348189, 'admin', 'Danat 2')
add_user(8721416291, 'doctor', 'Danat Doctor') # Добавляем для теста
add_user(7716348189, 'doctor', 'Danat Doctor 2') # Добавляем для теста
