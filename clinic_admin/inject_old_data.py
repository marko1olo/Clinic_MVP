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
    
    # Check existing names one by one to avoid dynamic IN clause
    existing_names = set()
    for name, _ in old_patients:
        c.execute("SELECT name FROM patients WHERE name = ?", (name,))
        row = c.fetchone()
        if row:
            existing_names.add(row[0])

    new_patients_data = []
    for name, phone in old_patients:
        if name not in existing_names:
            new_patients_data.append((name, phone, now.isoformat()))
            
    if new_patients_data:
        inserted_ids = []
        for p_data in new_patients_data:
            c.execute("INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)", p_data)
            inserted_ids.append(c.lastrowid)

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
