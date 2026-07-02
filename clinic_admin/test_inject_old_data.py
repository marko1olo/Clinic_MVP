import pytest
import clinic_admin.inject_old_data
import clinic_admin.database

@pytest.fixture(autouse=True)
def setup_database(tmp_path):
    # Create a temporary file for the database
    db_path = str(tmp_path / "test_db.sqlite")

    # Save original DB_FILE values
    original_db_file_database = clinic_admin.database.DB_FILE
    original_db_file_inject = clinic_admin.inject_old_data.DB_FILE

    # Point the database to the temporary file
    clinic_admin.database.DB_FILE = db_path
    clinic_admin.inject_old_data.DB_FILE = db_path

    # Initialize the database to create tables
    clinic_admin.database.init_db()

    yield

    # Restore original DB_FILE values
    clinic_admin.database.DB_FILE = original_db_file_database
    clinic_admin.inject_old_data.DB_FILE = original_db_file_inject

def test_inject_dummy_data():
    # 1. Inject data
    clinic_admin.inject_old_data.inject_dummy_data()

    conn = clinic_admin.database.get_connection()
    c = conn.cursor()

    # Verify patients were added
    c.execute("SELECT name, phone FROM patients")
    patients = c.fetchall()
    assert len(patients) == 3

    expected_patients = {
        "Смирнов Алексей": "+79991234567",
        "Козлова Елена": "+79123456789",
        "Петров Дмитрий": "+79001112233"
    }

    for p in patients:
        name, phone = p["name"], p["phone"]
        assert name in expected_patients
        assert phone == expected_patients[name]

    # Verify appointments were added
    c.execute("SELECT doctor, status FROM appointments")
    appointments = c.fetchall()
    assert len(appointments) == 3

    for a in appointments:
        assert a["doctor"] == "Др. Хаус"
        assert a["status"] == "completed"

    conn.close()

def test_inject_dummy_data_idempotent():
    # Inject data first time
    clinic_admin.inject_old_data.inject_dummy_data()

    # Inject data second time
    clinic_admin.inject_old_data.inject_dummy_data()

    conn = clinic_admin.database.get_connection()
    c = conn.cursor()

    # Check if rows are duplicated (should still be 3)
    c.execute("SELECT COUNT(*) as count FROM patients")
    assert c.fetchone()["count"] == 3

    c.execute("SELECT COUNT(*) as count FROM appointments")
    assert c.fetchone()["count"] == 3

    conn.close()
