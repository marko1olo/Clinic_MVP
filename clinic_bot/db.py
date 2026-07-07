import os
import sqlite3
import threading
from pathlib import Path

DB_FILE = str(Path(__file__).parent / 'bot_users.db')

_local = threading.local()

def get_connection():
    try:
        conns = _local.conns
    except AttributeError:
        conns = _local.conns = {}

    try:
        return conns[DB_FILE]
    except KeyError:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        conns[DB_FILE] = conn
        return conn

def close_connections():
    try:
        conns = _local.conns
    except AttributeError:
        return

    # Convert to list to ensure thread safety while iterating, avoiding dict mutation issues
    for conn in list(conns.values()):
        conn.close()
    conns.clear()

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

def add_users(users_data: list):
    """Batch insert multiple users to avoid N+1 queries."""
    if not users_data:
        return
    conn = get_connection()
    c = conn.cursor()
    c.executemany('INSERT OR REPLACE INTO users (chat_id, role, name) VALUES (?, ?, ?)', users_data)
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

# Дефолтные админы и врачи из переменных окружения
users_to_add = []

initial_admins = os.environ.get("INITIAL_ADMINS", "")
if initial_admins:
    for admin_id in initial_admins.split(','):
        if admin_id.strip().isdigit():
            users_to_add.append((int(admin_id.strip()), 'admin', f'Admin {admin_id.strip()}'))

initial_doctors = os.environ.get("INITIAL_DOCTORS", "")
if initial_doctors:
    for doctor_id in initial_doctors.split(','):
        if doctor_id.strip().isdigit():
            users_to_add.append((int(doctor_id.strip()), 'doctor', f'Doctor {doctor_id.strip()}'))

if users_to_add:
    add_users(users_to_add)
