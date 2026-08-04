import unittest
from unittest.mock import patch
import sqlite3
import os
import tempfile
import clinic_admin.database

class TestDatabase(unittest.TestCase):
    def setUp(self):
        # Create a temporary file for testing
        self.db_fd, self.db_path = tempfile.mkstemp()
        self.original_db_file = clinic_admin.database.DB_FILE
        clinic_admin.database.DB_FILE = self.db_path

    def tearDown(self):
        clinic_admin.database.DB_FILE = self.original_db_file
        try:
            os.close(self.db_fd)
            os.unlink(self.db_path)
        except OSError:
            pass

    @patch('clinic_admin.database.sqlite3.connect')
    def test_get_connection_mock(self, mock_connect):
        # Call the function
        conn = clinic_admin.database.get_connection()

        # Verify sqlite3.connect was called with the correct argument
        mock_connect.assert_called_once_with(clinic_admin.database.DB_FILE)

        # Verify it returns the mocked connection object
        self.assertEqual(conn, mock_connect.return_value)

    def test_get_connection(self):
        conn = clinic_admin.database.get_connection()
        self.assertIsInstance(conn, sqlite3.Connection)
        self.assertEqual(conn.row_factory, sqlite3.Row)
        conn.close()

    @patch('clinic_admin.database.sqlite3.connect')
    @patch('clinic_admin.database.logging.error')
    def test_get_connection_error(self, mock_logging_error, mock_connect):
        # Setup mock to raise an exception
        mock_connect.side_effect = sqlite3.Error("Mocked database error")

        # Verify that the exception is raised when get_connection is called
        with self.assertRaises(sqlite3.Error):
            clinic_admin.database.get_connection()

        # Verify logging.error was called
        mock_logging_error.assert_called_once()
        self.assertIn("Mocked database error", mock_logging_error.call_args[0][0])

    def test_init_db(self):
        clinic_admin.database.init_db()
        conn = clinic_admin.database.get_connection()
        c = conn.cursor()

        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='patients'")
        self.assertIsNotNone(c.fetchone())

        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'")
        self.assertIsNotNone(c.fetchone())

        c.execute("PRAGMA table_info(patients)")
        columns = [row['name'] for row in c.fetchall()]
        self.assertIn('id', columns)
        self.assertIn('name', columns)
        self.assertIn('phone', columns)
        self.assertIn('last_visit', columns)
        self.assertIn('notes', columns)
        self.assertIn('created_at', columns)

        c.execute("PRAGMA table_info(appointments)")
        columns = [row['name'] for row in c.fetchall()]
        self.assertIn('id', columns)
        self.assertIn('patient_id', columns)
        self.assertIn('doctor', columns)
        self.assertIn('appointment_date', columns)
        self.assertIn('status', columns)
        self.assertIn('created_at', columns)

        conn.close()

    def test_phone_validation(self):
        clinic_admin.database.init_db()
        conn = clinic_admin.database.get_connection()
        c = conn.cursor()

        good_phones = ['+79991234567', '+7 (999) 000-00-00', '123-456-7890', '12345', '(123) 456 7890', None]
        bad_phones = ['+79991234567A', '<script>', '000000000000000000000', '', '1234', 'abcde']

        for p in good_phones:
            try:
                c.execute("INSERT INTO patients (name, phone) VALUES (?, ?)", ("Test", p))
                conn.commit()
            except sqlite3.IntegrityError:
                self.fail(f"Valid phone number {p} failed validation.")

        for p in bad_phones:
            with self.assertRaises(sqlite3.IntegrityError, msg=f"Invalid phone number {p} should have failed validation."):
                c.execute("INSERT INTO patients (name, phone) VALUES (?, ?)", ("Test", p))

        conn.close()

if __name__ == '__main__':
    unittest.main()
