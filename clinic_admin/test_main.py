import os
import sys
import unittest
import unittest.mock
import tempfile
from unittest.mock import patch
from fastapi.testclient import TestClient

# Add clinic_admin directory to sys.path to resolve database import
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import clinic_admin.database
from clinic_admin.main import app

class TestMain(unittest.TestCase):
    def setUp(self):
        import clinic_admin.database
        import clinic_admin.main
        self.db_fd, self.db_path = tempfile.mkstemp()
        self.original_db_file = clinic_admin.database.DB_FILE
        clinic_admin.database.DB_FILE = self.db_path

        # Override the database dependency to use the temporary database
        def override_get_connection():
            import sqlite3
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            return conn

        # Temporarily mock get_connection in main
        self.original_get_connection = clinic_admin.main.get_connection
        clinic_admin.main.get_connection = override_get_connection

        clinic_admin.database.init_db()
        self.client = TestClient(app)

    def tearDown(self):
        import clinic_admin.database
        clinic_admin.main.get_connection = self.original_get_connection
        clinic_admin.database.DB_FILE = self.original_db_file
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def test_startup_event_error(self):
        # Using the TestClient as a context manager triggers the startup event
        with patch('clinic_admin.main.init_db', side_effect=Exception("Database initialization failed")):
            with self.assertRaisesRegex(Exception, "Database initialization failed"):
                with TestClient(app):
                    pass

    def test_read_root_unconfigured_credentials(self):
        # temporarily delete credentials if they exist
        u = os.environ.pop("ADMIN_USERNAME", None)
        p = os.environ.pop("ADMIN_PASSWORD", None)

        response = self.client.get("/", auth=("admin", "admin"))
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"detail": "Admin credentials are not configured on the server"})

        if u is not None:
            os.environ["ADMIN_USERNAME"] = u
        if p is not None:
            os.environ["ADMIN_PASSWORD"] = p

    def test_read_root_unauthenticated(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"
        response = self.client.get("/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Not authenticated"})

    def test_read_root_authenticated_correct(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"
        response = self.client.get("/", auth=("admin", "admin"))
        self.assertEqual(response.status_code, 200)

    @unittest.mock.patch('clinic_admin.main.get_connection')
    def test_get_dashboard_data_db_error(self, mock_get_connection):
        # Simulate a database error
        mock_get_connection.side_effect = Exception("Simulated DB Error")

        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"

        # This calls the / endpoint, which calls get_dashboard_data
        response = self.client.get("/", auth=("admin", "admin"))

        # It should still return 200, not 500
        self.assertEqual(response.status_code, 200)

    def test_read_root_authenticated_incorrect(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"
        response = self.client.get("/", auth=("admin", "wrong"))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Incorrect username or password"})

    def test_api_current_appointment_unauthenticated(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"
        response = self.client.get("/api/current_appointment")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Not authenticated"})

    def test_api_current_appointment_authenticated(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"
        response = self.client.get("/api/current_appointment", auth=("admin", "admin"))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("error" in data or "appointment_id" in data)


    def test_add_patient_unauthenticated(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"
        form_data = {
            "name": "Jane Doe",
            "phone": "9876543210"
        }
        response = self.client.post("/patients/add", data=form_data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Not authenticated"})

    def test_add_patient_authenticated(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"

        form_data = {
            "name": "Jane Doe",
            "phone": "9876543210"
        }

        response = self.client.post("/patients/add", data=form_data, auth=("admin", "admin"), follow_redirects=False)
        self.assertEqual(response.status_code, 303)
        self.assertEqual(response.headers["location"], "/")

        # Verify the patient is in the database
        from clinic_admin.database import get_connection
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM patients WHERE name = ?", ("Jane Doe",))
        patient = c.fetchone()
        self.assertIsNotNone(patient)
        self.assertEqual(patient["phone"], "9876543210")

        conn.close()

    def test_add_appointment_unauthenticated(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"
        form_data = {
            "patient_id": 1,
            "doctor": "Dr. Smith",
            "date": "2023-10-27T10:00"
        }
        response = self.client.post("/appointments/add", data=form_data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Not authenticated"})

    def test_add_appointment_authenticated(self):
        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"

        # First we need to make sure a patient exists since appointment has a foreign key to patients
        response_patient = self.client.post("/patients/add", data={"name": "Test Patient", "phone": "1234567890"}, auth=("admin", "admin"), follow_redirects=False)
        self.assertEqual(response_patient.status_code, 303)

        # Get the patient from the DB to dynamically determine the ID
        from clinic_admin.database import get_connection
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT id FROM patients WHERE name = 'Test Patient'")
        patient = c.fetchone()
        patient_id = patient["id"]
        conn.close()

        form_data = {
            "patient_id": patient_id,
            "doctor": "Dr. Smith",
            "date": "2023-10-27T10:00"
        }

        response = self.client.post("/appointments/add", data=form_data, auth=("admin", "admin"), follow_redirects=False)
        self.assertEqual(response.status_code, 303)
        self.assertEqual(response.headers["location"], "/")

        # Verify the appointment is in the database
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM appointments WHERE patient_id = ? AND doctor = ?", (patient_id, "Dr. Smith"))
        appointment = c.fetchone()
        self.assertIsNotNone(appointment)
        self.assertEqual(appointment["appointment_date"], "2023-10-27T10:00")

        conn.close()


    def test_insert_patient(self):
        from clinic_admin.main import insert_patient
        from clinic_admin.database import get_connection

        # Call the function directly
        insert_patient("Direct Insert", "555-5555")

        # Verify it was added to the test database
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM patients WHERE name = 'Direct Insert'")
        patient = c.fetchone()
        self.assertIsNotNone(patient)
        self.assertEqual(patient["phone"], "555-5555")
        conn.close()

    def test_fetch_current_appointment_no_appointments(self):
        from clinic_admin.main import fetch_current_appointment
        result = fetch_current_appointment()
        self.assertIsNone(result)

    def test_fetch_current_appointment_not_today(self):
        from clinic_admin.main import fetch_current_appointment
        from clinic_admin.database import get_connection

        # Insert a patient and an appointment for yesterday
        conn = get_connection()
        c = conn.cursor()
        c.execute("INSERT INTO patients (name, phone) VALUES (?, ?)", ("Test Patient", "1234567890"))
        patient_id = c.lastrowid

        # Insert appointment for a different date
        c.execute("INSERT INTO appointments (patient_id, doctor, appointment_date, created_at) VALUES (?, ?, datetime('now', '-1 day'), datetime('now'))",
                 (patient_id, "Dr. Smith"))
        conn.commit()
        conn.close()

        result = fetch_current_appointment()
        self.assertIsNone(result)

    def test_fetch_current_appointment_today(self):
        from clinic_admin.main import fetch_current_appointment
        from clinic_admin.database import get_connection

        # Insert a patient and an appointment for today
        conn = get_connection()
        c = conn.cursor()
        c.execute("INSERT INTO patients (name, phone) VALUES (?, ?)", ("Test Patient Today", "1234567890"))
        patient_id = c.lastrowid

        # Insert appointment for today
        c.execute("INSERT INTO appointments (patient_id, doctor, appointment_date, created_at) VALUES (?, ?, datetime('now'), datetime('now'))",
                 (patient_id, "Dr. Today"))
        conn.commit()

        # Fetch it using sqlite to know the exact date that was inserted
        c.execute("SELECT appointment_date FROM appointments WHERE patient_id = ?", (patient_id,))
        app_date = c.fetchone()[0]
        conn.close()

        result = fetch_current_appointment()
        self.assertIsNotNone(result)
        self.assertEqual(result["patient_name"], "Test Patient Today")
        self.assertEqual(result["doctor"], "Dr. Today")
        self.assertEqual(result["time"], app_date)

if __name__ == '__main__':
    unittest.main()

