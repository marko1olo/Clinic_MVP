import sqlite3
import json
from datetime import datetime, timedelta

import os

DEFAULT_DB_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "clinic.db")
)
DB_FILE = os.environ.get("DB_FILE", DEFAULT_DB_FILE)

def _get_existing_names(c, names):
    if not names:
        return set()

    c.execute(
        "SELECT name FROM patients WHERE name IN (SELECT value FROM json_each(?))",
        (json.dumps(names),)
    )
    return set(row[0] for row in c.fetchall())

def _insert_patients(c, new_patients_data):
    if not new_patients_data:
        return []

    query = "INSERT INTO patients (name, phone, created_at) VALUES " + ", ".join(["(?, ?, ?)"] * len(new_patients_data)) + " RETURNING id"
    params = [item for sublist in new_patients_data for item in sublist]

    c.execute(query, params)
    return [row[0] for row in c.fetchall()]

def _insert_appointments(c, inserted_ids, now):
    old_date = (now - timedelta(days=210)).isoformat()
    appointments_data = [
        (pid, "Др. Хаус", old_date, "completed", now.isoformat())
        for pid in inserted_ids
    ]

    c.executemany(
        "INSERT INTO appointments (patient_id, doctor, "
        "appointment_date, status, created_at) VALUES (?, ?, ?, ?, ?)",
        appointments_data
    )

def inject_dummy_data():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    now = datetime.now()

    # Create old patients
    old_patients = [
        ("Смирнов Алексей", "+79991234567"),
        ("Козлова Елена", "+79123456789"),
        ("Петров Дмитрий", "+79001112233")
    ]

    names = [p[0] for p in old_patients]
    existing_names = _get_existing_names(c, names)

    new_patients_data = []
    for name, phone in old_patients:
        if name not in existing_names:
            new_patients_data.append((name, phone, now.isoformat()))

    if new_patients_data:
        inserted_ids = _insert_patients(c, new_patients_data)
        _insert_appointments(c, inserted_ids, now)

    conn.commit()
    conn.close()
    print("Dummy marketing data injected.")

if __name__ == "__main__":
    inject_dummy_data()
