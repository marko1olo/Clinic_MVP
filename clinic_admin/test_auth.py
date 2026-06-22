import unittest
import os
import base64
from fastapi.testclient import TestClient
from main import app
import database

class TestAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Change dir so Jinja2Templates can find "templates"
        cls.old_dir = os.getcwd()
        os.chdir('clinic_admin')

        # Patch database to use in-memory SQLite for testing
        cls.old_db = database.DB_FILE
        database.DB_FILE = ":memory:"
        database.init_db()

    @classmethod
    def tearDownClass(cls):
        database.DB_FILE = cls.old_db
        os.chdir(cls.old_dir)

    def setUp(self):
        # Need to ensure init_db() creates tables in the exact connection
        # used by get_connection if it's :memory: because :memory: is per-connection.
        # But instead we can just use a temporary file.
        import tempfile
        self.temp_db_fd, self.temp_db_path = tempfile.mkstemp()
        database.DB_FILE = self.temp_db_path
        database.init_db()
        self.client = TestClient(app)

    def tearDown(self):
        os.close(self.temp_db_fd)
        os.unlink(self.temp_db_path)

    def test_unauthenticated_access(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.headers.get("WWW-Authenticate"), "Basic")

    def test_authenticated_access(self):
        # default user/pass is admin/admin
        auth_string = base64.b64encode(b"admin:admin").decode("utf-8")
        headers = {"Authorization": f"Basic {auth_string}"}
        response = self.client.get("/", headers=headers)
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()
