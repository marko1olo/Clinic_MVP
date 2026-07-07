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
import clinic_admin.main
from clinic_admin.main import app

class TestMain(unittest.TestCase):
    def setUp(self):
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

from main import app

class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

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
        pass

    def test_add_patient(self):
        response = self.client.post(
            "/patients/add",
            data={"name": "John Doe", "phone": "123-456-7890"}
        )

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

        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT doctor, appointment_date FROM appointments WHERE patient_id=?", (patient_id,))
        appointment = c.fetchone()
        conn.close()

        self.assertIsNotNone(appointment)
        self.assertEqual(appointment["doctor"], "Dr. Smith")
        self.assertEqual(appointment["appointment_date"], "2023-12-01T10:00:00")

    def test_get_current_appointment(self):
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


    def test_verify_password(self):
        from clinic_admin.main import _verify_password
        from fastapi.security import HTTPBasicCredentials
        from fastapi import HTTPException

        expected_username = "admin"
        expected_password = "password"

        # Correct username and password - should not raise
        creds_correct = HTTPBasicCredentials(username="admin", password="password")
        _verify_password(creds_correct, expected_username, expected_password)

        # Incorrect password
        creds_wrong_pass = HTTPBasicCredentials(username="admin", password="wrong")
        with self.assertRaises(HTTPException) as context:
            _verify_password(creds_wrong_pass, expected_username, expected_password)
        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Incorrect username or password")

        # Incorrect username
        creds_wrong_user = HTTPBasicCredentials(username="wrong", password="password")
        with self.assertRaises(HTTPException) as context:
            _verify_password(creds_wrong_user, expected_username, expected_password)
        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Incorrect username or password")

        # Both incorrect
        creds_both_wrong = HTTPBasicCredentials(username="wrong", password="wrong")
        with self.assertRaises(HTTPException) as context:
            _verify_password(creds_both_wrong, expected_username, expected_password)
        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Incorrect username or password")

    def test_get_current_username(self):
        from clinic_admin.main import get_current_username
        from fastapi.security import HTTPBasicCredentials
        from fastapi import HTTPException

        os.environ["ADMIN_USERNAME"] = "admin"
        os.environ["ADMIN_PASSWORD"] = "admin"

        # Valid credentials
        creds = HTTPBasicCredentials(username="admin", password="admin")
        self.assertEqual(get_current_username(creds), "admin")

        # Invalid password
        creds_invalid = HTTPBasicCredentials(username="admin", password="wrong")
        with self.assertRaises(HTTPException) as context:
            get_current_username(creds_invalid)
        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Incorrect username or password")

        # Invalid username
        creds_invalid_usr = HTTPBasicCredentials(username="wrong", password="admin")
        with self.assertRaises(HTTPException) as context:
            get_current_username(creds_invalid_usr)
        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Incorrect username or password")

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

if __name__ == '__main__':
    unittest.main()

import pytest
from datetime import datetime, timedelta
import uuid
import sqlite3

import main
import database

client = TestClient(main.app)

@pytest.fixture
def db_name():
    return f"file:memdb_{uuid.uuid4().hex}?mode=memory&cache=shared"

@pytest.fixture
def db_conn(db_name):
    conn = sqlite3.connect(db_name, uri=True)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            last_visit TEXT,
            notes TEXT,
            created_at TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor TEXT,
            appointment_date TEXT NOT NULL,
            status TEXT DEFAULT 'scheduled',
            created_at TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    ''')
    conn.commit()
    yield conn

@pytest.fixture(autouse=True)
def override_get_connection(monkeypatch, db_name, db_conn):
    def mock_get_connection():
        conn = sqlite3.connect(db_name, uri=True)

    monkeypatch.setattr(main, "get_connection", mock_get_connection)
    monkeypatch.setattr(database, "get_connection", mock_get_connection)


def test_get_current_appointment_empty_db(db_conn):
    response = client.get("/api/current_appointment")
    assert response.status_code == 200
    assert response.json() == {"error": "No appointments today"}

def test_get_current_appointment_today(db_conn):
    c = db_conn.cursor()
    c.execute("INSERT INTO patients (name, phone) VALUES ('John Doe', '1234567890')")
    patient_id = c.lastrowid

    now = datetime.now()
    appointment_time = now.strftime('%Y-%m-%d %H:%M:%S')

    c.execute('''
        INSERT INTO appointments (patient_id, doctor, appointment_date)
        VALUES (?, ?, ?)
    ''', (patient_id, 'Dr. Smith', appointment_time))
    appointment_id = c.lastrowid
    db_conn.commit()

    response = client.get("/api/current_appointment")
    assert response.status_code == 200

    assert data["appointment_id"] == appointment_id
    assert data["patient_name"] == "John Doe"
    assert data["doctor"] == "Dr. Smith"
    assert data["time"] == appointment_time

def test_get_current_appointment_yesterday(db_conn):
    c = db_conn.cursor()
    c.execute("INSERT INTO patients (name, phone) VALUES ('Jane Doe', '0987654321')")
    patient_id = c.lastrowid

    yesterday = datetime.now() - timedelta(days=1)
    appointment_time = yesterday.strftime('%Y-%m-%d %H:%M:%S')

    c.execute('''
        INSERT INTO appointments (patient_id, doctor, appointment_date)
        VALUES (?, ?, ?)
    ''', (patient_id, 'Dr. Jones', appointment_time))
    db_conn.commit()

    response = client.get("/api/current_appointment")
    assert response.status_code == 200
    assert response.json() == {"error": "No appointments today"}
