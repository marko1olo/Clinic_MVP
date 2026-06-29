import unittest
import os
import tempfile
from unittest.mock import patch
import sqlite3

from gui.database import (
    init_db,
    get_db_connection,
    save_scan,
    get_all_scans,
    delete_scan,
    update_scan
)

class TestDatabase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp()
        self.patcher = patch('gui.database.DB_PATH', self.db_path)
        self.patcher.start()
        init_db()

    def tearDown(self):
        self.patcher.stop()
        os.close(self.db_fd)
        try:
            os.unlink(self.db_path)
        except OSError:
            pass

    @patch('gui.database.sqlite3.connect')
    def test_get_db_connection_error(self, mock_connect):
        mock_connect.side_effect = sqlite3.OperationalError("Mock connection error")
        with self.assertRaises(sqlite3.OperationalError):
            get_db_connection()

    def test_init_db(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='scans'")
        table = cursor.fetchone()
        conn.close()
        self.assertIsNotNone(table)
        self.assertEqual(table['name'], 'scans')

    def test_save_and_get_all_scans(self):
        data = {
            "patient_name": "John Doe",
            "patient_age": 30,
            "patient_gender": "Male",
            "brightness": 110,
            "contrast": 105,
            "summary": "Test summary"
        }
        scan_id = save_scan(data)
        self.assertIsNotNone(scan_id)

        scans = get_all_scans()
        self.assertEqual(len(scans), 1)
        self.assertEqual(scans[0]['patient_name'], "John Doe")
        self.assertEqual(scans[0]['patient_age'], 30)
        self.assertEqual(scans[0]['patient_gender'], "Male")
        self.assertEqual(scans[0]['brightness'], 110)
        self.assertEqual(scans[0]['contrast'], 105)
        self.assertEqual(scans[0]['summary'], "Test summary")

    def test_update_scan(self):
        data = {
            "patient_name": "Jane Doe",
            "patient_age": 25,
        }
        scan_id = save_scan(data)

        update_data = {
            "patient_name": "Jane Smith",
            "patient_age": 26,
            "brightness": 120,
            "contrast": 110
        }
        update_scan(scan_id, update_data)

        scans = get_all_scans()
        self.assertEqual(len(scans), 1)
        self.assertEqual(scans[0]['patient_name'], "Jane Smith")
        self.assertEqual(scans[0]['patient_age'], 26)
        self.assertEqual(scans[0]['brightness'], 120)

    def test_delete_scan(self):
        data = {
            "patient_name": "To be deleted"
        }
        scan_id = save_scan(data)

        scans_before = get_all_scans()
        self.assertEqual(len(scans_before), 1)

        delete_scan(scan_id)

        scans_after = get_all_scans()
        self.assertEqual(len(scans_after), 0)

if __name__ == '__main__':
    unittest.main()
