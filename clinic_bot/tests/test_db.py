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
        # Clean up the temporary database file
        os.close(self.fd)
        os.unlink(self.temp_db)

    def test_add_user_new(self):
        # Add a new user
        db.add_user(11111, 'patient', 'New Patient')

        # Verify the user is added by getting connection and checking directly
        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE chat_id = ?', (11111,))
        row = c.fetchone()
        conn.close()

        self.assertIsNotNone(row)
        self.assertEqual(row['role'], 'patient')
        self.assertEqual(row['name'], 'New Patient')

    def test_add_user_replace(self):
        # Add initial user
        db.add_user(22222, 'patient', 'Old Patient')

        # Replace the same user with a new role and name
        db.add_user(22222, 'admin', 'Super Admin')

        # Verify the user was replaced properly
        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE chat_id = ?', (22222,))
        row = c.fetchone()

        # Make sure only one row exists
        c.execute('SELECT COUNT(*) as count FROM users WHERE chat_id = ?', (22222,))
        count = c.fetchone()['count']
        conn.close()

        self.assertEqual(count, 1)
        self.assertIsNotNone(row)
        self.assertEqual(row['role'], 'admin')
        self.assertEqual(row['name'], 'Super Admin')

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

if __name__ == '__main__':
    unittest.main()
