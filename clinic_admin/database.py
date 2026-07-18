import sqlite3
import logging
import os

DEFAULT_DB_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "clinic.db")
)
DB_FILE = os.environ.get("DB_FILE", DEFAULT_DB_FILE)

def get_connection():
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        logging.error(f"Error connecting to database: {e}")
        raise

def init_db():
    conn = get_connection()
    c = conn.cursor()
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT CHECK (phone IS NULL OR (length(phone) >= 5 AND length(phone) <= 20 AND phone NOT GLOB '*[^0-9+() -]*')),
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
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized.")
