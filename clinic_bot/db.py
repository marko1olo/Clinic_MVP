import os
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

# Инициализация при импорте
init_db()

# Дефолтные админы и врачи из переменных окружения
initial_admins = os.environ.get("INITIAL_ADMINS", "")
if initial_admins:
    for admin_id in initial_admins.split(','):
        if admin_id.strip().isdigit():
            add_user(int(admin_id.strip()), 'admin', f'Admin {admin_id.strip()}')

initial_doctors = os.environ.get("INITIAL_DOCTORS", "")
if initial_doctors:
    for doctor_id in initial_doctors.split(','):
        if doctor_id.strip().isdigit():
            add_user(int(doctor_id.strip()), 'doctor', f'Doctor {doctor_id.strip()}')
