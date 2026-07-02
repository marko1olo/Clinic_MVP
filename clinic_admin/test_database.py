from unittest.mock import patch
import sqlite3
import pytest
import clinic_admin.database

@pytest.fixture(autouse=True)
def setup_database(tmp_path):
    # Create a temporary file for the database
    db_path = str(tmp_path / "test_db.sqlite")

    # Save the original DB_FILE
    original_db_file = clinic_admin.database.DB_FILE

    # Point the database to the temporary file
    clinic_admin.database.DB_FILE = db_path

    yield

    # Restore the original DB_FILE
    clinic_admin.database.DB_FILE = original_db_file

@patch('sqlite3.connect')
def test_get_connection(mock_connect):
    # Call the function
    conn = clinic_admin.database.get_connection()

    # Verify sqlite3.connect was called with the correct argument
    mock_connect.assert_called_once_with(clinic_admin.database.DB_FILE)

    # Verify it returns the mocked connection object
    assert conn == mock_connect.return_value

    # Verify the row factory is set
    assert conn.row_factory == sqlite3.Row

@patch('sqlite3.connect')
def test_get_connection_error(mock_connect):
    # Setup mock to raise an exception
    mock_connect.side_effect = sqlite3.Error("Mocked database error")

    # Verify that the exception is raised when get_connection is called
    with pytest.raises(sqlite3.Error):
        clinic_admin.database.get_connection()

def test_init_db():
    # Initialize the database
    clinic_admin.database.init_db()

    # Connect to verify tables were created
    conn = clinic_admin.database.get_connection()
    c = conn.cursor()

    # Check if patients table exists
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='patients'")
    assert c.fetchone() is not None

    # Check if appointments table exists
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'")
    assert c.fetchone() is not None

    # Check patients table schema
    c.execute("PRAGMA table_info(patients)")
    columns = [row['name'] for row in c.fetchall()]
    assert 'id' in columns
    assert 'name' in columns
    assert 'phone' in columns
    assert 'last_visit' in columns
    assert 'notes' in columns
    assert 'created_at' in columns

    # Check appointments table schema
    c.execute("PRAGMA table_info(appointments)")
    columns = [row['name'] for row in c.fetchall()]
    assert 'id' in columns
    assert 'patient_id' in columns
    assert 'doctor' in columns
    assert 'appointment_date' in columns
    assert 'status' in columns
    assert 'created_at' in columns

    conn.close()
