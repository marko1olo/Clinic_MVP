import clinic_admin.database
import unittest
import os
import tempfile
import clinic_admin.inject_old_data

class TestInjectOldData(unittest.TestCase):
    def setUp(self):
        # Create a temporary file for the database
        self.db_fd, self.db_path = tempfile.mkstemp()

        # Save original DB_FILE values
        self.original_db_file_database = clinic_admin.database.DB_FILE
        self.original_db_file_inject = clinic_admin.inject_old_data.DB_FILE

        # Point the database to the temporary file
        clinic_admin.database.DB_FILE = self.db_path
        clinic_admin.inject_old_data.DB_FILE = self.db_path

        # Initialize the database to create tables
        clinic_admin.database.init_db()

    def tearDown(self):
        # Restore original DB_FILE values
        clinic_admin.database.DB_FILE = self.original_db_file_database
        clinic_admin.inject_old_data.DB_FILE = self.original_db_file_inject

        # Close and remove the temporary file
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def test_get_existing_names_empty_list(self):
        import sqlite3
        conn = sqlite3.connect(':memory:')
        c = conn.cursor()

        # Test with empty list
        existing_names = clinic_admin.inject_old_data._get_existing_names(c, [])
        self.assertEqual(existing_names, set())

        # Test with None
        existing_names_none = clinic_admin.inject_old_data._get_existing_names(c, None)
        self.assertEqual(existing_names_none, set())

        conn.close()

    def test_get_existing_names_with_data(self):
        import sqlite3
        conn = sqlite3.connect(':memory:')
        c = conn.cursor()
        c.execute('CREATE TABLE patients (name TEXT)')

        # Insert test data
        test_patients = [("Patient One",), ("Patient Two",)]
        c.executemany("INSERT INTO patients (name) VALUES (?)", test_patients)
        conn.commit()

        # Test finding existing names
        names_to_check = ["Patient One", "Patient Three"]
        existing_names = clinic_admin.inject_old_data._get_existing_names(c, names_to_check)

        # Should only find "Patient One"
        self.assertEqual(existing_names, {"Patient One"})

        # Test finding all names
        all_names = clinic_admin.inject_old_data._get_existing_names(c, ["Patient One", "Patient Two"])
        self.assertEqual(all_names, {"Patient One", "Patient Two"})

        conn.close()

    def test_inject_dummy_data(self):
        # 1. Inject data
        clinic_admin.inject_old_data.inject_dummy_data()

        conn = clinic_admin.database.get_connection()
        c = conn.cursor()

        # Verify patients were added
        c.execute("SELECT name, phone FROM patients")
        patients = c.fetchall()
        self.assertEqual(len(patients), 3)

        expected_patients = {
            "Смирнов Алексей": "+79991234567",
            "Козлова Елена": "+79123456789",
            "Петров Дмитрий": "+79001112233"
        }

        for p in patients:
            name, phone = p["name"], p["phone"]
            self.assertIn(name, expected_patients)
            self.assertEqual(phone, expected_patients[name])

        # Verify appointments were added
        c.execute("SELECT doctor, status FROM appointments")
        appointments = c.fetchall()
        self.assertEqual(len(appointments), 3)

        for a in appointments:
            self.assertEqual(a["doctor"], "Др. Хаус")
            self.assertEqual(a["status"], "completed")

        conn.close()

    def test_inject_dummy_data_idempotent(self):
        # Inject data first time
        clinic_admin.inject_old_data.inject_dummy_data()

        # Inject data second time
        clinic_admin.inject_old_data.inject_dummy_data()

        conn = clinic_admin.database.get_connection()
        c = conn.cursor()

        # Check if rows are duplicated (should still be 3)
        c.execute("SELECT COUNT(*) as count FROM patients")
        self.assertEqual(c.fetchone()["count"], 3)

        c.execute("SELECT COUNT(*) as count FROM appointments")
        self.assertEqual(c.fetchone()["count"], 3)

        conn.close()

if __name__ == "__main__":
    unittest.main()
