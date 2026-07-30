import json
from datetime import datetime, timedelta

from clinic_admin.database import get_connection

OLD_PATIENTS = [
    ("Смирнов Алексей", "+79991234567"),
    ("Козлова Елена", "+79123456789"),
    ("Петров Дмитрий", "+79001112233")
]

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

    query = "INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?) RETURNING id"
    inserted_ids = []
    for row in new_patients_data:
        c.execute(query, row)
        inserted_ids.append(c.fetchone()[0])

    return inserted_ids

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
    now = datetime.now()

    with get_connection() as conn:
        c = conn.cursor()

        names = [p[0] for p in OLD_PATIENTS]
        existing_names = _get_existing_names(c, names)

        new_patients_data = [
            (name, phone, now.isoformat())
            for name, phone in OLD_PATIENTS
            if name not in existing_names
        ]

        if new_patients_data:
            inserted_ids = _insert_patients(c, new_patients_data)
            _insert_appointments(c, inserted_ids, now)

        conn.commit()

    print("Dummy marketing data injected.")

if __name__ == "__main__":
    inject_dummy_data()
