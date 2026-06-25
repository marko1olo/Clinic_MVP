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
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            chat_id INTEGER PRIMARY KEY,
            role TEXT NOT NULL,
            name TEXT
        )
    ''')
    conn.commit()
    conn.close()

def add_user(chat_id: int, role: str, name: str = ""):
    conn = get_connection()
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO users (chat_id, role, name) VALUES (?, ?, ?)', (chat_id, role, name))
    conn.commit()
    conn.close()

def get_users_by_role(role: str):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT chat_id FROM users WHERE role = ?', (role,))
    users = [row['chat_id'] for row in c.fetchall()]
    conn.close()
    return users

def get_user_role(chat_id: int):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT role FROM users WHERE chat_id = ?', (chat_id,))
    row = c.fetchone()
    conn.close()
    return row['role'] if row else None

import os

# Инициализация при импорте
init_db()

# Инициализация из переменных окружения
# Формат: chat_id:name,chat_id2:name2
initial_admins = os.environ.get("INITIAL_ADMINS", "")
if initial_admins:
    for admin in initial_admins.split(","):
        parts = admin.split(":")
        if len(parts) >= 1 and parts[0].strip().isdigit():
            chat_id = int(parts[0].strip())
            name = parts[1].strip() if len(parts) > 1 else ""
            add_user(chat_id, 'admin', name)

initial_doctors = os.environ.get("INITIAL_DOCTORS", "")
if initial_doctors:
    for doctor in initial_doctors.split(","):
        parts = doctor.split(":")
        if len(parts) >= 1 and parts[0].strip().isdigit():
            chat_id = int(parts[0].strip())
            name = parts[1].strip() if len(parts) > 1 else ""
            add_user(chat_id, 'doctor', name)
