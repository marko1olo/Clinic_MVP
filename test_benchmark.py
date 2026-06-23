import sqlite3
import time
from datetime import datetime, timedelta
import os
import shutil

DB_FILE = "test_clinic.db"

def setup_db(db_file):
    if os.path.exists(db_file):
        os.remove(db_file)
    conn = sqlite3.connect(db_file)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS patients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    phone TEXT,
                    created_at TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS appointments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER,
                    doctor TEXT,
                    appointment_date TEXT,
                    status TEXT,
                    created_at TEXT)''')
    conn.commit()
    conn.close()

def inject_dummy_data_old(db_file, n):
    conn = sqlite3.connect(db_file)
    c = conn.cursor()
    now = datetime.now()

    old_patients = [(f"Patient {i}", f"+7999{i:07d}") for i in range(n)]

    start_time = time.time()
    for name, phone in old_patients:
        c.execute("SELECT id FROM patients WHERE name = ?", (name,))
        res = c.fetchone()
        if not res:
            c.execute("INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)", (name, phone, now.isoformat()))
            patient_id = c.lastrowid

            old_date = (now - timedelta(days=210)).isoformat()
            c.execute('''
                INSERT INTO appointments (patient_id, doctor, appointment_date, status, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (patient_id, "Др. Хаус", old_date, "completed", now.isoformat()))

    conn.commit()
    conn.close()
    return time.time() - start_time

def inject_dummy_data_new(db_file, n):
    conn = sqlite3.connect(db_file)
    c = conn.cursor()
    now = datetime.now()

    old_patients = [(f"Patient {i}", f"+7999{i:07d}") for i in range(n)]

    start_time = time.time()

    # Pre-check all existing names to avoid N queries
    names = [p[0] for p in old_patients]
    placeholders = ','.join(['?'] * len(names))
    c.execute(f"SELECT name FROM patients WHERE name IN ({placeholders})", names)
    existing_names = set(row[0] for row in c.fetchall())

    new_patients_data = []
    for name, phone in old_patients:
        if name not in existing_names:
            new_patients_data.append((name, phone, now.isoformat()))

    if new_patients_data:
        c.executemany("INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)", new_patients_data)

        # Get the IDs of the newly inserted patients.
        # SQLite's executemany doesn't return lastrowid for all rows, but we can query by the names we just inserted.
        inserted_names = [p[0] for p in new_patients_data]
        placeholders_new = ','.join(['?'] * len(inserted_names))
        c.execute(f"SELECT id FROM patients WHERE name IN ({placeholders_new})", inserted_names)
        inserted_ids = [row[0] for row in c.fetchall()]

        old_date = (now - timedelta(days=210)).isoformat()
        appointments_data = [(pid, "Др. Хаус", old_date, "completed", now.isoformat()) for pid in inserted_ids]

        c.executemany('''
            INSERT INTO appointments (patient_id, doctor, appointment_date, status, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', appointments_data)

    conn.commit()
    conn.close()
    return time.time() - start_time

def main():
    n = 10000

    setup_db(DB_FILE)
    t_old = inject_dummy_data_old(DB_FILE, n)
    print(f"Old time for {n} records: {t_old:.4f} seconds")

    setup_db(DB_FILE)
    t_new = inject_dummy_data_new(DB_FILE, n)
    print(f"New time for {n} records: {t_new:.4f} seconds")

if __name__ == "__main__":
    main()
