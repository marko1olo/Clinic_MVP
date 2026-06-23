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
    
    for name, phone in old_patients:
        # Check if exists
        c.execute("SELECT id FROM patients WHERE name = ?", (name,))
        res = c.fetchone()
        if not res:
            c.execute("INSERT INTO patients (name, phone, created_at) VALUES (?, ?, ?)", (name, phone, now.isoformat()))
            patient_id = c.lastrowid
            
            # Add an appointment 7 months ago
            old_date = (now - timedelta(days=210)).isoformat()
            c.execute('''
                INSERT INTO appointments (patient_id, doctor, appointment_date, status, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (patient_id, "Др. Хаус", old_date, "completed", now.isoformat()))
    
    conn.commit()
    conn.close()
    print("Dummy marketing data injected.")

if __name__ == "__main__":
    inject_dummy_data()
