import unittest
import os
from fastapi.testclient import TestClient
from main import app, init_db
import sqlite3
import tempfile
import database

class TestMainAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create a temporary database for testing
        cls.db_fd, cls.db_path = tempfile.mkstemp()
        database.DB_FILE = cls.db_path

        # Initialize the temp DB
        init_db()

        cls.client = TestClient(app)

        # Set environment variables for credentials
        os.environ["ADMIN_USERNAME"] = "testadmin"
        os.environ["ADMIN_PASSWORD"] = "testpass"

    @classmethod
    def tearDownClass(cls):
        os.close(cls.db_fd)
        os.unlink(cls.db_path)

    def test_read_root_unauthorized(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Not authenticated"})

    def test_read_root_authorized(self):
        response = self.client.get("/", auth=("testadmin", "testpass"))
        self.assertEqual(response.status_code, 200)

    def test_add_patient_unauthorized(self):
        response = self.client.post("/patients/add", data={"name": "Test Patient", "phone": "12345"})
        self.assertEqual(response.status_code, 401)

    def test_add_patient_authorized(self):
        response = self.client.post("/patients/add", data={"name": "Test Patient", "phone": "12345"}, auth=("testadmin", "testpass"))
        # Returns RedirectResponse 303 on success
        self.assertEqual(response.status_code, 200) # TestClient follows redirects by default

    def test_add_appointment_unauthorized(self):
        response = self.client.post("/appointments/add", data={"patient_id": 1, "doctor": "Dr. Smith", "date": "2023-10-10"})
        self.assertEqual(response.status_code, 401)

    def test_get_current_appointment_unauthorized(self):
        response = self.client.get("/api/current_appointment")
        self.assertEqual(response.status_code, 401)

    def test_get_current_appointment_authorized(self):
        response = self.client.get("/api/current_appointment", auth=("testadmin", "testpass"))
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()
