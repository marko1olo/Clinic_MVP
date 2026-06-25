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
        db.add_user(12345, 'doctor', 'Test Doctor')

        # Test retrieving the user's role
        role = db.get_user_role(12345)
        self.assertEqual(role, 'doctor')

    def test_get_user_role_not_found(self):
        # Test retrieving the role for a chat_id that doesn't exist
        role = db.get_user_role(99999)
        self.assertIsNone(role)

    def test_get_users_by_role_existing(self):
        # Add a few users
        db.add_user(111, 'doctor', 'Doctor 1')
        db.add_user(222, 'doctor', 'Doctor 2')
        db.add_user(333, 'admin', 'Admin 1')

        # Test retrieving users by role
        users = db.get_users_by_role('doctor')
        self.assertEqual(sorted(users), [111, 222])

        admin_users = db.get_users_by_role('admin')
        self.assertEqual(sorted(admin_users), [333])

    def test_get_users_by_role_not_found(self):
        # Test retrieving users for a role that doesn't exist
        users = db.get_users_by_role('patient')
        self.assertEqual(users, [])

if __name__ == '__main__':
    unittest.main()
