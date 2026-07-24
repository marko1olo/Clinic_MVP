import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
import sqlite3
import uuid

import main
import database

client = TestClient(main.app)

@pytest.fixture
def db_name():
    return f"file:memdb_{uuid.uuid4().hex}?mode=memory&cache=shared"

@pytest.fixture
def db_conn(db_name):
    conn = sqlite3.connect(db_name, uri=True)
    conn.row_factory = sqlite3.Row
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
    conn.close()

@pytest.fixture(autouse=True)
def override_get_connection(monkeypatch, db_name, db_conn):
    def mock_get_connection():
        conn = sqlite3.connect(db_name, uri=True)
        conn.row_factory = sqlite3.Row
        return conn

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
    data = response.json()

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
