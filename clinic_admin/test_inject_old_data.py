import unittest
import os
import clinic_admin.database
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
