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

    def test_get_user_role_existing(self):
        # Add a user to the temporary database
        db.add_user(12345, 'doctor_user', 'Test Doctor', 'doctor')

        # Test retrieving the user's role
        role = db.get_user_role(12345)
        self.assertEqual(role, 'doctor')

    def test_get_user_role_not_found(self):
        # Test retrieving the role for a chat_id that doesn't exist
        role = db.get_user_role(99999)
        self.assertIsNone(role)

    def test_add_user_replace_existing(self):
        # Add a user initially
        db.add_user(101010, 'user_initial', 'Initial Name', 'user')
        role1 = db.get_user_role(101010)
        self.assertEqual(role1, 'user')

        # Add the same user with a different role and name (triggering REPLACE)
        db.add_user(101010, 'user_updated', 'Updated Name', 'admin')
        role2 = db.get_user_role(101010)
        self.assertEqual(role2, 'admin')

        # Verify no duplicate entries created
        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT COUNT(*) as count FROM users WHERE user_id = ?', (101010,))
        count = c.fetchone()['count']
        conn.close()
        self.assertEqual(count, 1)

    def test_add_user_default_role(self):
        # Add a user without specifying the role
        db.add_user(202020, 'doctor_unspec', 'Doctor Name')

        # Verify the role defaults to "user" in the DB
        conn = db.get_connection()
        c = conn.cursor()
        c.execute('SELECT role FROM users WHERE user_id = ?', (202020,))
        role = c.fetchone()['role']
        conn.close()
        self.assertEqual(role, "user")

    def test_add_user_large_chat_id(self):
        # Add a user with a large user_id (e.g. 64-bit integer limits)
        large_id = 9223372036854775807 # Max 64-bit signed integer
        db.add_user(large_id, 'large_admin', 'Large ID Admin', 'admin')

        role = db.get_user_role(large_id)
        self.assertEqual(role, 'admin')

if __name__ == '__main__':
    unittest.main()
