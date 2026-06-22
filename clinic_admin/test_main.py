import unittest
import tempfile
import os
from fastapi.testclient import TestClient
from datetime import datetime

# Patch database file path before importing main
temp_db = tempfile.NamedTemporaryFile(delete=False)
temp_db_name = temp_db.name
temp_db.close()

import sys
import os

# Append clinic_admin to sys.path so we can import as main does
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import database
database.DB_FILE = temp_db_name

from main import app
from database import init_db, get_connection

client = TestClient(app)

class TestMain(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        pass

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(temp_db_name):
            os.unlink(temp_db_name)

    def setUp(self):
        # Initialize db and clean up database between tests
        init_db()
        conn = get_connection()
        c = conn.cursor()
        c.execute("DELETE FROM appointments")
        c.execute("DELETE FROM patients")
        conn.commit()
        conn.close()

    def test_read_root(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("text/html", response.headers["content-type"])

    def test_add_patient(self):
        response = client.post(
            "/patients/add",
            data={"name": "John Doe", "phone": "1234567890"},
            follow_redirects=False
        )
        self.assertEqual(response.status_code, 303)
        self.assertEqual(response.headers["location"], "/")

        # Verify database
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM patients WHERE name='John Doe'")
        patient = c.fetchone()
        conn.close()

        self.assertIsNotNone(patient)
        self.assertEqual(patient["phone"], "1234567890")

    def test_add_appointment(self):
        # Add a patient first
        client.post(
            "/patients/add",
            data={"name": "Jane Doe", "phone": "0987654321"},
            follow_redirects=False
        )

        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT id FROM patients WHERE name='Jane Doe'")
        patient_id = c.fetchone()["id"]
        conn.close()

        response = client.post(
            "/appointments/add",
            data={
                "patient_id": patient_id,
                "doctor": "Dr. Smith",
                "date": "2023-10-10T10:00:00"
            },
            follow_redirects=False
        )
        self.assertEqual(response.status_code, 303)
        self.assertEqual(response.headers["location"], "/")

        # Verify database
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM appointments WHERE patient_id=?", (patient_id,))
        appointment = c.fetchone()
        conn.close()

        self.assertIsNotNone(appointment)
        self.assertEqual(appointment["doctor"], "Dr. Smith")
        self.assertEqual(appointment["appointment_date"], "2023-10-10T10:00:00")

    def test_get_current_appointment_no_appointments(self):
        response = client.get("/api/current_appointment")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"error": "No appointments today"})

    def test_get_current_appointment_with_appointment(self):
        # Add a patient
        conn = get_connection()
        c = conn.cursor()
        c.execute("INSERT INTO patients (name, phone, created_at) VALUES ('Alice', '111222333', '2023-10-10')")
        patient_id = c.lastrowid

        # Add an appointment for today
        today = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        c.execute('''
            INSERT INTO appointments (patient_id, doctor, appointment_date, status, created_at)
            VALUES (?, 'Dr. Who', ?, 'scheduled', '2023-10-10')
        ''', (patient_id, today))
        conn.commit()
        conn.close()

        response = client.get("/api/current_appointment")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("appointment_id", data)
        self.assertEqual(data["patient_name"], "Alice")
        self.assertEqual(data["doctor"], "Dr. Who")

if __name__ == '__main__':
    unittest.main()
