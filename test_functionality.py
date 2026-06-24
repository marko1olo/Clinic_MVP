import sqlite3
import os
from clinic_admin.inject_old_data import inject_dummy_data
import clinic_admin.inject_old_data as inject_module

# Override DB_FILE to test file
TEST_DB = "test_func.db"
inject_module.DB_FILE = TEST_DB

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

setup_db(TEST_DB)
inject_module.inject_dummy_data()

conn = sqlite3.connect(TEST_DB)
c = conn.cursor()
c.execute("SELECT name, phone FROM patients")
patients = c.fetchall()
print("Patients after 1st run:", patients)

c.execute("SELECT patient_id, doctor, status FROM appointments")
appointments = c.fetchall()
print("Appointments after 1st run:", appointments)

# Run again to verify it doesn't insert duplicates
inject_module.inject_dummy_data()

c.execute("SELECT name, phone FROM patients")
patients2 = c.fetchall()
print("Patients after 2nd run:", patients2)
assert patients == patients2, "Duplicates found in patients"

c.execute("SELECT patient_id, doctor, status FROM appointments")
appointments2 = c.fetchall()
print("Appointments after 2nd run:", appointments2)
assert appointments == appointments2, "Duplicates found in appointments"

print("Functionality verification passed!")
