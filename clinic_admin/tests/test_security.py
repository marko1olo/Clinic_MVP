import unittest
from fastapi.testclient import TestClient
import os

# Set working directory to clinic_admin to correctly resolve 'templates' and 'database.py'
os.environ['DB_FILE'] = ':memory:'
os.chdir(os.path.join(os.path.dirname(__file__), '..'))

from main import app

class TestSecurity(unittest.TestCase):
    def setUp(self):
        # Initialize in-memory db
        from database import init_db
        init_db()

        # Now that DB is initialized for the session, initialize the TestClient
        self.client = TestClient(app)

    def test_patients_add_unauthorized(self):
        response = self.client.post("/patients/add", data={"name": "test", "phone": "123"})
        self.assertEqual(response.status_code, 401)

    def test_appointments_add_unauthorized(self):
        response = self.client.post("/appointments/add", data={"patient_id": 1, "doctor": "doc", "date": "2023-10-10"})
        self.assertEqual(response.status_code, 401)

    def test_root_unauthorized(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 401)

    def test_patients_add_authorized(self):
        # We test that we don't get a 401. If we get a validation error (422) or a success/redirect, it means auth worked.
        response = self.client.post("/patients/add", data={"name": "test_auth_user"}, auth=("admin", "admin"))
        self.assertNotEqual(response.status_code, 401)

    def test_api_current_appointment_no_auth_required(self):
        response = self.client.get("/api/current_appointment")
        # Ensure it doesn't return 401. It might return 200 with an error dict or success.
        self.assertNotEqual(response.status_code, 401)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
