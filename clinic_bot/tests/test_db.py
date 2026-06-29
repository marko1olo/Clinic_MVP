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

if __name__ == '__main__':
    unittest.main()
