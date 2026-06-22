import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
import os

from main import app, startup_event


class TestAdminAuth(unittest.TestCase):
    def setUp(self):
        # Isolate database
        self.db_patcher = patch("database.DB_FILE", "test_clinic.db")
        self.db_patcher.start()

        # Ensure working directory is clinic_admin so templates resolve correctly
        self.old_cwd = os.getcwd()
        if not self.old_cwd.endswith("clinic_admin"):
            os.chdir("clinic_admin")

        startup_event()
        self.client = TestClient(app)

    def tearDown(self):
        self.db_patcher.stop()
        if os.path.exists("test_clinic.db"):
            os.remove("test_clinic.db")
        os.chdir(self.old_cwd)

    def test_unauthenticated_access(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 401)
        self.assertIn("WWW-Authenticate", response.headers)

        response = self.client.get("/api/current_appointment")
        self.assertEqual(response.status_code, 401)

        response = self.client.post(
            "/patients/add", data={"name": "Test", "phone": "123"}
        )
        self.assertEqual(response.status_code, 401)

    def test_authenticated_access(self):
        auth = ("admin", "admin")

        # Dashboard
        response = self.client.get("/", auth=auth)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Денталия-2", response.text)

        # API
        response = self.client.get("/api/current_appointment", auth=auth)
        self.assertEqual(response.status_code, 200)

        # POST
        response = self.client.post(
            "/patients/add",
            data={"name": "Test Patient", "phone": "123"},
            auth=auth,
            allow_redirects=False,
        )
        self.assertEqual(response.status_code, 303)


if __name__ == "__main__":
    unittest.main()
