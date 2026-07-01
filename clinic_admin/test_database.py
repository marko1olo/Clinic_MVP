import clinic_admin.database
import unittest
from unittest.mock import patch
import sqlite3
import os
import tempfile

class TestDatabase(unittest.TestCase):
    def setUp(self):
        # Create a temporary file for the database
        self.db_fd, self.db_path = tempfile.mkstemp()

        # Save the original DB_FILE
        self.original_db_file = clinic_admin.database.DB_FILE

        # Point the database to the temporary file
        clinic_admin.database.DB_FILE = self.db_path

    def tearDown(self):
        # Restore the original DB_FILE
        clinic_admin.database.DB_FILE = self.original_db_file

        # Close and remove the temporary file
        os.close(self.db_fd)
        os.unlink(self.db_path)

    @patch('sqlite3.connect')
    def test_get_connection(self, mock_connect):
        # Call the function
        conn = clinic_admin.database.get_connection()

        # Verify sqlite3.connect was called with the correct argument
        mock_connect.assert_called_once_with(clinic_admin.database.DB_FILE)

        # Verify it returns the mocked connection object
        self.assertEqual(conn, mock_connect.return_value)

        # Verify the row factory is set
        self.assertEqual(conn.row_factory, sqlite3.Row)

    @patch('sqlite3.connect')
    def test_get_connection_error(self, mock_connect):
        # Setup mock to raise an exception
        mock_connect.side_effect = sqlite3.Error("Mocked database error")

        # Verify that the exception is raised when get_connection is called
        with self.assertRaises(sqlite3.Error):
            clinic_admin.database.get_connection()

    def test_init_db(self):
        # Initialize the database
        clinic_admin.database.init_db()

        # Connect to verify tables were created
        conn = clinic_admin.database.get_connection()
        c = conn.cursor()

        # Check if patients table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='patients'")
        self.assertIsNotNone(c.fetchone())

        # Check if appointments table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'")
        self.assertIsNotNone(c.fetchone())

        # Check patients table schema
        c.execute("PRAGMA table_info(patients)")
        columns = [row['name'] for row in c.fetchall()]
        self.assertIn('id', columns)
        self.assertIn('name', columns)
        self.assertIn('phone', columns)
        self.assertIn('last_visit', columns)
        self.assertIn('notes', columns)
        self.assertIn('created_at', columns)

        # Check appointments table schema
        c.execute("PRAGMA table_info(appointments)")
        columns = [row['name'] for row in c.fetchall()]
        self.assertIn('id', columns)
        self.assertIn('patient_id', columns)
        self.assertIn('doctor', columns)
        self.assertIn('appointment_date', columns)
        self.assertIn('status', columns)
        self.assertIn('created_at', columns)

        conn.close()

if __name__ == '__main__':
    unittest.main()
