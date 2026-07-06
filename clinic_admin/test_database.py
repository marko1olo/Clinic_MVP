import clinic_admin.database as database
import unittest
from unittest.mock import patch
import sqlite3
import os
import tempfile
import subprocess
import sys

class TestDatabase(unittest.TestCase):
    def setUp(self):
        # Create a temporary file for the database
        self.db_fd, self.db_path = tempfile.mkstemp()

        # Save the original DB_FILE
        self.original_db_file = database.DB_FILE

        # Point the database to the temporary file
        database.DB_FILE = self.db_path

    def tearDown(self):
        # Restore the original DB_FILE
        database.DB_FILE = self.original_db_file

        # Close and remove the temporary file
        os.close(self.db_fd)
        os.unlink(self.db_path)

    @patch('sqlite3.connect')
    def test_get_connection(self, mock_connect):
        # Call the function
        conn = database.get_connection()

        # Verify sqlite3.connect was called with the correct argument
        mock_connect.assert_called_once_with(database.DB_FILE)

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
            database.get_connection()

    def test_init_db(self):
        # Initialize the database
        database.init_db()

        # Connect to verify tables were created
        conn = database.get_connection()
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

    @patch('clinic_admin.database.get_connection')
    def test_init_db_calls_commit_and_close(self, mock_get_connection):
        # Setup mock connection and cursor
        mock_conn = mock_get_connection.return_value
        mock_cursor = mock_conn.cursor.return_value

        # Call the function
        database.init_db()

        # Verify get_connection was called
        mock_get_connection.assert_called_once()

        # Verify cursor was created
        mock_conn.cursor.assert_called_once()

        # Verify execute was called at least twice (for both tables)
        self.assertGreaterEqual(mock_cursor.execute.call_count, 2)

        # Verify commit and close were called on the connection
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()

    def test_main_block(self):
        # We can test the __main__ block behavior via a subprocess,
        # ensuring it works without messing up the current environment.
        # However, to avoid creating 'clinic.db' in the root, we'll patch the file itself in a temporary dir
        env = os.environ.copy()
        env['PYTHONPATH'] = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_db_path = os.path.join(temp_dir, 'clinic.db')
            script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'database.py'))

            # Create a wrapped script in temp_dir that points DB_FILE to temp_db_path
            wrapped_script_path = os.path.join(temp_dir, 'wrapped_database.py')
            with open(wrapped_script_path, 'w') as f:
                f.write(f'''
import sys
sys.path.insert(0, "{os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))}")
import clinic_admin.database as database
database.DB_FILE = r"{temp_db_path}"
import runpy
runpy.run_path("{script_path}", run_name="__main__", init_globals={{"DB_FILE": r"{temp_db_path}"}})
''')

            result = subprocess.run(
                [sys.executable, wrapped_script_path],
                capture_output=True,
                text=True,
                env=env,
                cwd=temp_dir
            )

            self.assertEqual(result.returncode, 0)
            self.assertIn("Database initialized.", result.stdout)
            self.assertTrue(os.path.exists(temp_db_path))

if __name__ == '__main__':
    unittest.main()
