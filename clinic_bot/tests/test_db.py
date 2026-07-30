import unittest
import tempfile
import os
from unittest.mock import patch

import clinic_bot.db as db

class TestDB(unittest.TestCase):
    def setUp(self):
        self.fd, self.temp_db = tempfile.mkstemp()
        # Patch the DB_FILE in clinic_bot.db to point to our temporary file
        self.patcher = patch('clinic_bot.db.DB_FILE', self.temp_db)
        self.patcher.start()

        # Initialize the test database schema
        db.init_db()

    def tearDown(self):
        # Stop patching
        self.patcher.stop()
        # Close any cached connections to the test db
        db.close_connections()
        # Clean up the temporary database file
        os.close(self.fd)
        os.unlink(self.temp_db)
    def test_add_user_insert(self):
        db.add_user(111, 'doctor', 'Doc One')
        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT role, name FROM users WHERE chat_id = ?', (111,))
        row = c.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row['role'], 'doctor')
        self.assertEqual(row['name'], 'Doc One')

    def test_add_user_replace(self):
        db.add_user(222, 'admin', 'Old Admin')
        db.add_user(222, 'doctor', 'New Doc')
        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT role, name FROM users WHERE chat_id = ?', (222,))
        row = c.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row['role'], 'doctor')
        self.assertEqual(row['name'], 'New Doc')

    def test_add_user_default_name(self):
        db.add_user(333, 'patient')
        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT role, name FROM users WHERE chat_id = ?', (333,))
        row = c.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row['role'], 'patient')
        self.assertEqual(row['name'], '')

    def test_add_users_empty_list(self):
        # Should not raise an exception
        try:
            db.add_users([])
        except Exception as e:
            self.fail(f"add_users raised Exception unexpectedly: {e}")

    def test_add_users_batch_insert(self):
        users_to_add = [
            (444, 'doctor', 'Doc Batch 1'),
            (555, 'patient', 'Patient Batch 1'),
            (666, 'admin', 'Admin Batch 1')
        ]
        db.add_users(users_to_add)

        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT chat_id, role, name FROM users WHERE chat_id IN (444, 555, 666) ORDER BY chat_id')
        rows = c.fetchall()

        self.assertEqual(len(rows), 3)
        self.assertEqual(rows[0]['role'], 'doctor')
        self.assertEqual(rows[0]['name'], 'Doc Batch 1')
        self.assertEqual(rows[1]['role'], 'patient')
        self.assertEqual(rows[1]['name'], 'Patient Batch 1')
        self.assertEqual(rows[2]['role'], 'admin')
        self.assertEqual(rows[2]['name'], 'Admin Batch 1')

    def test_add_users_replace(self):
        # Insert initial user
        db.add_user(777, 'admin', 'Original Admin')

        # Replace the user via batch insert
        users_to_update = [
            (777, 'doctor', 'Updated Doc'),
            (888, 'patient', 'New Patient')
        ]
        db.add_users(users_to_update)

        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT role, name FROM users WHERE chat_id = ?', (777,))
        row_777 = c.fetchone()
        self.assertIsNotNone(row_777)
        self.assertEqual(row_777['role'], 'doctor')
        self.assertEqual(row_777['name'], 'Updated Doc')

        c.execute('SELECT role, name FROM users WHERE chat_id = ?', (888,))
        row_888 = c.fetchone()
        self.assertIsNotNone(row_888)
        self.assertEqual(row_888['role'], 'patient')
        self.assertEqual(row_888['name'], 'New Patient')

    def test_get_user_role_existing(self):
        # Add a user to the temporary database
        db.add_user(12345, 'doctor', 'Test Doctor')

        # Test retrieving the user's role
        role = db.get_user_role(12345)
        self.assertEqual(role, 'doctor')

    def test_get_user_role_not_found(self):
        # Test retrieving the role for a chat_id that doesn't exist
        role = db.get_user_role(99999)
        self.assertIsNone(role)

    def test_get_users_by_role_existing(self):
        # Add multiple users to the temporary database
        db.add_user(1001, 'doctor', 'Dr. Smith')
        db.add_user(1002, 'admin', 'Admin Jane')
        db.add_user(1003, 'doctor', 'Dr. Jones')

        # Test retrieving users by role
        doctors = db.get_users_by_role('doctor')
        self.assertCountEqual(doctors, [1001, 1003])

        admins = db.get_users_by_role('admin')
        self.assertCountEqual(admins, [1002])

    def test_get_users_by_role_empty(self):
        # Add a user to ensure the DB isn't just completely empty
        db.add_user(1001, 'doctor', 'Dr. Smith')

        # Test retrieving a role that has no users
        patients = db.get_users_by_role('patient')
        self.assertEqual(patients, [])

    def test_close_connections(self):
        from unittest.mock import MagicMock

        # Close existing connection first to release file lock
        db.close_connections()

        # Create mock connections
        mock_conn1 = MagicMock()
        mock_conn2 = MagicMock()

        # Assign them to the thread-local storage
        db._local.conns = {'mock_db_1': mock_conn1, 'mock_db_2': mock_conn2}

        # Call the function being tested
        db.close_connections()

        # Assert that close was called on each mock connection
        mock_conn1.close.assert_called_once()
        mock_conn2.close.assert_called_once()

        # Assert that the conns dictionary was cleared
        self.assertEqual(len(db._local.conns), 0)
    def test_get_connection_thread_local(self):
        """Test that get_connection returns a thread-local SQLite connection."""
        import threading

        # Get connection in the main thread
        main_conn1 = db.get_connection()
        main_conn2 = db.get_connection()

        # Connections in the same thread should be the exact same object
        self.assertIs(main_conn1, main_conn2)

        thread_conn = None
        def thread_task():
            nonlocal thread_conn
            thread_conn = db.get_connection()
            db.close_connections() # close connection in this thread to release lock

        t = threading.Thread(target=thread_task)
        t.start()
        t.join()

        # The connection from the spawned thread must be different from the main thread's connection
        self.assertIsNotNone(thread_conn)
        self.assertIsNot(main_conn1, thread_conn)
if __name__ == '__main__':
    unittest.main()
