import unittest
import os
import tempfile
import clinic_admin.inject_old_data
import clinic_admin.database

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

    def test_insert_appointments(self):
        from datetime import datetime, timedelta
        from unittest.mock import MagicMock
        from clinic_admin.inject_old_data import _insert_appointments

        c_mock = MagicMock()
        inserted_ids = [1, 2]
        now = datetime(2023, 10, 27, 12, 0, 0)

        _insert_appointments(c_mock, inserted_ids, now)

        old_date = (now - timedelta(days=210)).isoformat()
        expected_query = (
            "INSERT INTO appointments (patient_id, doctor, "
            "appointment_date, status, created_at) VALUES (?, ?, ?, ?, ?)"
        )
        expected_data = [
            (1, "Др. Хаус", old_date, "completed", now.isoformat()),
            (2, "Др. Хаус", old_date, "completed", now.isoformat()),
        ]

        c_mock.executemany.assert_called_once_with(expected_query, expected_data)

    def test_insert_appointments_empty(self):
        from datetime import datetime
        from unittest.mock import MagicMock
        from clinic_admin.inject_old_data import _insert_appointments

        c_mock = MagicMock()
        now = datetime(2023, 10, 27, 12, 0, 0)

        _insert_appointments(c_mock, [], now)

        expected_query = (
            "INSERT INTO appointments (patient_id, doctor, "
            "appointment_date, status, created_at) VALUES (?, ?, ?, ?, ?)"
        )
        c_mock.executemany.assert_called_once_with(expected_query, [])

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

    def test_insert_patients(self):
        conn = clinic_admin.database.get_connection()
        c = conn.cursor()

        now = "2023-10-27T10:00:00"
        new_patients_data = [
            ("New Patient 1", "+79000000001", now),
            ("New Patient 2", "+79000000002", now)
        ]

        inserted_ids = clinic_admin.inject_old_data._insert_patients(c, new_patients_data)

        self.assertEqual(len(inserted_ids), 2)
        self.assertIsInstance(inserted_ids[0], int)
        self.assertIsInstance(inserted_ids[1], int)

        c.execute("SELECT name, phone, created_at FROM patients WHERE id IN (?, ?)", (inserted_ids[0], inserted_ids[1]))
        patients = c.fetchall()
        self.assertEqual(len(patients), 2)

        fetched_data = [(p["name"], p["phone"], p["created_at"]) for p in patients]
        for data in new_patients_data:
            self.assertIn(data, fetched_data)

        conn.close()


    def test_main_execution(self):
        import runpy
        import os
        from unittest.mock import patch
        import io

        with patch.dict(os.environ, {"DB_FILE": self.db_path}):
            with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
                runpy.run_path('clinic_admin/inject_old_data.py', run_name='__main__')
                self.assertIn("Dummy marketing data injected.", mock_stdout.getvalue())

if __name__ == "__main__":
    unittest.main()
