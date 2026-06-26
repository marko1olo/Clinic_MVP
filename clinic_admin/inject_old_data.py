import sqlite3
from datetime import datetime, timedelta

DB_FILE = "C:/Clinic_MVP/clinic_admin/clinic.db"

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
    
    # Pre-check all existing names to avoid N queries
    names = [p[0] for p in old_patients]
    if names:
        placeholders = ','.join(['?'] * len(names))
        query = "SELECT name FROM patients WHERE name IN (" + placeholders + ")"  # nosec B608
        c.execute(query, names)
        existing_names = set(row[0] for row in c.fetchall())
    else:
        existing_names = set()

    new_patients_data = []
    for name, phone in old_patients:
        if name not in existing_names:
            new_patients_data.append((name, phone, now.isoformat()))
            
    if new_patients_data:
        c.executemany("INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)", new_patients_data)

        # Get the IDs of the newly inserted patients
        inserted_names = [p[0] for p in new_patients_data]
        placeholders_new = ','.join(['?'] * len(inserted_names))
        query_new = "SELECT id FROM patients WHERE name IN (" + placeholders_new + ")"  # nosec B608
        c.execute(query_new, inserted_names)
        inserted_ids = [row[0] for row in c.fetchall()]

        # Add an appointment 7 months ago for each new patient
        old_date = (now - timedelta(days=210)).isoformat()
        appointments_data = [(pid, "Др. Хаус", old_date, "completed", now.isoformat()) for pid in inserted_ids]

        c.executemany('''
            INSERT INTO appointments (patient_id, doctor, appointment_date, status, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', appointments_data)
    
    conn.commit()
    conn.close()
    print("Dummy marketing data injected.")

if __name__ == "__main__":
    inject_dummy_data()
