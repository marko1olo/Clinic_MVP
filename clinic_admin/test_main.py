import unittest
import os
import sqlite3
import tempfile

# Set the working directory to clinic_admin for template resolving
if not os.getcwd().endswith("clinic_admin"):
    os.chdir("clinic_admin")

import database

# Use a temporary file instead of :memory: so that all connections use the same DB
temp_db = tempfile.NamedTemporaryFile(delete=False)
temp_db.close()
database.DB_FILE = temp_db.name

from database import init_db, get_connection
init_db()

from fastapi.testclient import TestClient
from main import app

class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def setUp(self):
        # We need to wipe and reset the database between tests for isolation
        conn = get_connection()
        c = conn.cursor()
        c.execute("DELETE FROM appointments")
        c.execute("DELETE FROM patients")
        conn.commit()
        conn.close()

    @classmethod
    def tearDownClass(cls):
        # Clean up temporary database
        os.unlink(database.DB_FILE)

    def test_read_root(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)

    def test_add_patient(self):
        response = self.client.post(
            "/patients/add",
            data={"name": "John Doe", "phone": "123-456-7890"}
        )
        self.assertEqual(response.status_code, 200)

        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT name, phone FROM patients WHERE name='John Doe'")
        patient = c.fetchone()
        conn.close()

        self.assertIsNotNone(patient)
        self.assertEqual(patient["name"], "John Doe")
        self.assertEqual(patient["phone"], "123-456-7890")

    def test_add_appointment(self):
        conn = get_connection()
        c = conn.cursor()
        c.execute("INSERT INTO patients (name, phone) VALUES ('Jane Doe', '098-765-4321')")
        patient_id = c.lastrowid
        conn.commit()
        conn.close()

        response = self.client.post(
            "/appointments/add",
            data={"patient_id": patient_id, "doctor": "Dr. Smith", "date": "2023-12-01T10:00:00"}
        )
        self.assertEqual(response.status_code, 200)

        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT doctor, appointment_date FROM appointments WHERE patient_id=?", (patient_id,))
        appointment = c.fetchone()
        conn.close()

        self.assertIsNotNone(appointment)
        self.assertEqual(appointment["doctor"], "Dr. Smith")
        self.assertEqual(appointment["appointment_date"], "2023-12-01T10:00:00")

    def test_get_current_appointment(self):
        response = self.client.get("/api/current_appointment")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("error" in data or "appointment_id" in data)

if __name__ == '__main__':
    unittest.main()
