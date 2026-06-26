import os
import sys
import unittest
from fastapi.testclient import TestClient
from fastapi.security import HTTPBasicCredentials
from fastapi import HTTPException

# Add clinic_admin directory to sys.path to resolve database import
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from clinic_admin.main import app, get_current_username
from clinic_admin.database import init_db

class TestMain(unittest.TestCase):
    def setUp(self):
        init_db()
        self.client = TestClient(app)

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

    def test_get_current_username_correct(self):
        from unittest.mock import patch
        with patch.dict('os.environ', {'ADMIN_USERNAME': 'testuser', 'ADMIN_PASSWORD': 'testpass'}):
            creds = HTTPBasicCredentials(username="testuser", password="testpass")
            result = get_current_username(creds)
            self.assertEqual(result, "testuser")

    def test_get_current_username_incorrect(self):
        from unittest.mock import patch
        with patch.dict('os.environ', {'ADMIN_USERNAME': 'testuser', 'ADMIN_PASSWORD': 'testpass'}):
            creds = HTTPBasicCredentials(username="testuser", password="wrongpass")
            with self.assertRaises(HTTPException) as context:
                get_current_username(creds)
            self.assertEqual(context.exception.status_code, 401)
            self.assertEqual(context.exception.detail, "Incorrect username or password")

    def test_get_current_username_unconfigured(self):
        from unittest.mock import patch
        with patch.dict('os.environ', clear=True):
            creds = HTTPBasicCredentials(username="testuser", password="testpass")
            with self.assertRaises(HTTPException) as context:
                get_current_username(creds)

            self.assertEqual(context.exception.status_code, 500)
            self.assertEqual(context.exception.detail, "Admin credentials are not configured on the server")

if __name__ == '__main__':
    unittest.main()

