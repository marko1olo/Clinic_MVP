import unittest
from unittest.mock import patch
import os
import tempfile
from fastapi.testclient import TestClient

# Mock the database file to use a temporary one
temp_db = tempfile.NamedTemporaryFile(delete=False)
temp_db.close()

with patch('database.DB_FILE', temp_db.name):
    import database
    from main import app, startup_event
    from database import init_db

class TestAdminDashboard(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # We need to change dir because Jinja2 templates expect 'templates' dir
        cls.orig_dir = os.getcwd()
        if os.path.exists("clinic_admin/templates"):
            os.chdir("clinic_admin")
        elif not os.path.exists("templates"):
            raise Exception("Cannot find templates directory")

        with patch('database.DB_FILE', temp_db.name):
            init_db()
            startup_event()
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        os.chdir(cls.orig_dir)
        if os.path.exists(temp_db.name):
            os.remove(temp_db.name)

    def test_read_root_no_auth(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 401)

    def test_read_root_with_auth(self):
        with patch('database.DB_FILE', temp_db.name):
            response = self.client.get("/", auth=("admin", "admin"))
        self.assertEqual(response.status_code, 200)

    def test_add_patient_no_auth(self):
        response = self.client.post("/patients/add", data={"name": "Test Patient", "phone": "123"})
        self.assertEqual(response.status_code, 401)

    def test_add_patient_with_auth(self):
        with patch('database.DB_FILE', temp_db.name):
            response = self.client.post("/patients/add", data={"name": "Test Patient", "phone": "123"}, auth=("admin", "admin"))
        self.assertEqual(response.status_code, 200)

    def test_add_appointment_no_auth(self):
        response = self.client.post("/appointments/add", data={"patient_id": 1, "doctor": "Dr. Smith", "date": "2023-01-01"})
        self.assertEqual(response.status_code, 401)
