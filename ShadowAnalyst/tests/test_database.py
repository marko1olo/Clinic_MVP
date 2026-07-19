import unittest
import os
import tempfile
from unittest.mock import patch

from gui.database import (
    init_db,
    get_db_connection,
    save_scan,
    get_all_scans,
    delete_scan,
    update_scan,
    find_project_root
)

class TestFindProjectRoot(unittest.TestCase):
    @patch('gui.database.os.path.exists')
    @patch('gui.database.sys')
    def test_frozen_finds_config(self, mock_sys, mock_exists):
        mock_sys.frozen = True
        mock_sys.executable = '/app/dist/main.exe'

        def exists_side_effect(path):
            path = path.replace('\\', '/')
            return path == '/app/config.json'

        mock_exists.side_effect = exists_side_effect

        result = find_project_root()
        self.assertEqual(result.replace('\\', '/'), '/app')

    @patch('gui.database.os.path.exists')
    @patch('gui.database.sys')
    @patch('gui.database.__file__', '/app/gui/database.py')
    def test_not_frozen_finds_config(self, mock_sys, mock_exists):
        mock_sys.frozen = False

        def exists_side_effect(path):
            path = path.replace('\\', '/')
            return path == '/app/config.json'

        mock_exists.side_effect = exists_side_effect

        result = find_project_root()
        self.assertEqual(result.replace('\\', '/'), '/app')

    @patch('gui.database.os.path.exists')
    @patch('gui.database.os.getcwd')
    @patch('gui.database.sys')
    @patch('gui.database.__file__', '/some/random/gui/database.py')
    def test_finds_config_via_getcwd(self, mock_sys, mock_getcwd, mock_exists):
        mock_sys.frozen = False
        mock_getcwd.return_value = '/app/current/dir'

        def exists_side_effect(path):
            path = path.replace('\\', '/')
            return path == '/app/config.json'

        mock_exists.side_effect = exists_side_effect

        result = find_project_root()
        self.assertEqual(result.replace('\\', '/'), '/app')

    @patch('gui.database.os.path.exists')
    @patch('gui.database.sys')
    @patch('gui.database.__file__', '/app/ShadowAnalyst/gui/database.py')
    def test_fallback_not_frozen(self, mock_sys, mock_exists):
        mock_sys.frozen = False
        mock_exists.return_value = False

        result = find_project_root()
        self.assertEqual(result.replace('\\', '/'), '/app')

    @patch('gui.database.os.path.exists')
    @patch('gui.database.sys')
    def test_fallback_frozen(self, mock_sys, mock_exists):
        mock_sys.frozen = True
        mock_sys.executable = '/app/dist/main.exe'
        mock_exists.return_value = False

        result = find_project_root()
        self.assertEqual(result.replace('\\', '/'), '/app')

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

    def test_init_db(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='scans'")
        table = cursor.fetchone()
        self.assertIsNotNone(table)
        self.assertEqual(table['name'], 'scans')

        # Verify columns
        cursor.execute("PRAGMA table_info(scans)")
        columns = {row['name']: row['type'] for row in cursor.fetchall()}
        conn.close()

        expected_columns = {
            'id': 'INTEGER',
            'patient_name': 'TEXT',
            'patient_age': 'INTEGER',
            'patient_gender': 'TEXT',
            'original_image': 'TEXT',
            'enhanced_image': 'TEXT',
            'ai_image': 'TEXT',
            'brightness': 'INTEGER',
            'contrast': 'INTEGER',
            'inverted': 'BOOLEAN',
            'scale': 'REAL',
            'translate_x': 'REAL',
            'translate_y': 'REAL',
            'slider_position': 'REAL',
            'summary': 'TEXT',
            'report': 'TEXT',
            'audio_url': 'TEXT',
            'created_at': 'TIMESTAMP'
        }
        for col, col_type in expected_columns.items():
            self.assertIn(col, columns)
            self.assertEqual(columns[col], col_type)

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

    def test_init_db_migration(self):
        # Create a new temp DB for this test
        db_fd, db_path = tempfile.mkstemp()

        try:
            with patch('gui.database.DB_PATH', db_path):
                # Create old schema manually (without ai_image column)
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE scans (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        patient_name TEXT,
                        patient_age INTEGER,
                        patient_gender TEXT,
                        original_image TEXT,
                        enhanced_image TEXT,
                        brightness INTEGER DEFAULT 100,
                        contrast INTEGER DEFAULT 100,
                        inverted BOOLEAN DEFAULT 0,
                        scale REAL DEFAULT 1.0,
                        translate_x REAL DEFAULT 0.0,
                        translate_y REAL DEFAULT 0.0,
                        slider_position REAL DEFAULT 50.0,
                        summary TEXT,
                        report TEXT,
                        audio_url TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.commit()
                conn.close()

                # Run init_db which should trigger the migration
                init_db()

                # Verify that the column ai_image was added
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("PRAGMA table_info(scans)")
                columns = {row['name']: row['type'] for row in cursor.fetchall()}
                conn.close()

                self.assertIn('ai_image', columns)
                self.assertEqual(columns['ai_image'], 'TEXT')
        finally:
            os.close(db_fd)
            try:
                os.unlink(db_path)
            except OSError:
                pass

if __name__ == '__main__':
    unittest.main()
