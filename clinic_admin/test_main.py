import os
import sys
import unittest
import tempfile
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
        import clinic_admin.main
        clinic_admin.main.get_connection = self.original_get_connection
        clinic_admin.database.DB_FILE = self.original_db_file
        os.close(self.db_fd)
        os.unlink(self.db_path)

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

    def test_insert_appointment_function(self):
        from clinic_admin.main import insert_appointment
        from clinic_admin.database import get_connection

        # Setup a test patient directly
        conn = get_connection()
        c = conn.cursor()
        c.execute("INSERT INTO patients (name, phone) VALUES ('Test Patient Insert', '123456')")
        conn.commit()

        # Get the ID of the newly inserted patient
        patient_id = c.lastrowid
        conn.close()

        # Call the function to test
        test_doctor = "Dr. Strange"
        test_date = "2024-01-01T12:00"
        insert_appointment(patient_id, test_doctor, test_date)

        # Verify the appointment is correctly inserted
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM appointments WHERE patient_id = ? AND doctor = ?", (patient_id, test_doctor))
        appointment = c.fetchone()

        self.assertIsNotNone(appointment)
        self.assertEqual(appointment["patient_id"], patient_id)
        self.assertEqual(appointment["doctor"], test_doctor)
        self.assertEqual(appointment["appointment_date"], test_date)
        self.assertIsNotNone(appointment["created_at"])

        conn.close()


if __name__ == '__main__':
    unittest.main()

