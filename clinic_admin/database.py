import sqlite3
from datetime import datetime
import os

DB_FILE = os.environ.get("DB_FILE", "clinic.db")

# Initialize global connection for :memory: testing
_memory_conn = None

def get_connection():
    global _memory_conn
    if DB_FILE == ':memory:':
        if _memory_conn is None:
            _memory_conn = sqlite3.connect(DB_FILE, check_same_thread=False)
            _memory_conn.row_factory = sqlite3.Row
        return _memory_conn
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            last_visit TEXT,
            notes TEXT,
            created_at TEXT
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor TEXT,
            appointment_date TEXT NOT NULL,
            status TEXT DEFAULT 'scheduled',
            created_at TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    ''')
    
    conn.commit()
    if DB_FILE != ':memory:':
        conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized.")
