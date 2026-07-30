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

    @patch('gui.database.os.path.exists')
    @patch('gui.database.sys')
    def test_fallback_not_in_special_dirs(self, mock_sys, mock_exists):
        mock_sys.frozen = True
        mock_sys.executable = '/app/someotherdir/main.exe'
        mock_exists.return_value = False

        result = find_project_root()
        self.assertEqual(result.replace('\\', '/'), '/app/someotherdir')


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

    def test_save_scan_defaults(self):
        data = {}
        scan_id = save_scan(data)
        self.assertIsNotNone(scan_id)

        scans = get_all_scans()
        self.assertEqual(len(scans), 1)
        scan = scans[0]
        self.assertEqual(scan['patient_name'], "")
        self.assertIsNone(scan['patient_age'])
        self.assertEqual(scan['patient_gender'], "Не указан")
        self.assertEqual(scan['original_image'], "")
        self.assertEqual(scan['enhanced_image'], "")
        self.assertEqual(scan['ai_image'], "")
        self.assertEqual(scan['brightness'], 100)
        self.assertEqual(scan['contrast'], 100)
        self.assertEqual(bool(scan['inverted']), False)
        self.assertEqual(scan['scale'], 1.0)
        self.assertEqual(scan['translate_x'], 0.0)
        self.assertEqual(scan['translate_y'], 0.0)
        self.assertEqual(scan['slider_position'], 50.0)
        self.assertEqual(scan['summary'], "")
        self.assertEqual(scan['report'], "")
        self.assertEqual(scan['audio_url'], "")

    def test_save_scan_all_fields(self):
        data = {
            "patient_name": "Test Patient",
            "patient_age": 45,
            "patient_gender": "Female",
            "original_image": "orig.png",
            "enhanced_image": "enh.png",
            "ai_image": "ai.png",
            "brightness": 120,
            "contrast": 110,
            "inverted": True,
            "scale": 1.5,
            "translate_x": 10.0,
            "translate_y": -5.0,
            "slider_position": 75.0,
            "summary": "Test Summary",
            "report": "Test Report",
            "audio_url": "test_audio.mp3"
        }
        scan_id = save_scan(data)
        self.assertIsNotNone(scan_id)

        scans = get_all_scans()
        self.assertEqual(len(scans), 1)
        scan = scans[0]
        self.assertEqual(scan['patient_name'], "Test Patient")
        self.assertEqual(scan['patient_age'], 45)
        self.assertEqual(scan['patient_gender'], "Female")
        self.assertEqual(scan['original_image'], "orig.png")
        self.assertEqual(scan['enhanced_image'], "enh.png")
        self.assertEqual(scan['ai_image'], "ai.png")
        self.assertEqual(scan['brightness'], 120)
        self.assertEqual(scan['contrast'], 110)
        self.assertEqual(bool(scan['inverted']), True)
        self.assertEqual(scan['scale'], 1.5)
        self.assertEqual(scan['translate_x'], 10.0)
        self.assertEqual(scan['translate_y'], -5.0)
        self.assertEqual(scan['slider_position'], 75.0)
        self.assertEqual(scan['summary'], "Test Summary")
        self.assertEqual(scan['report'], "Test Report")
        self.assertEqual(scan['audio_url'], "test_audio.mp3")

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

    def test_init_db_migration_error_path(self):
        from unittest.mock import MagicMock
        with patch('gui.database.sqlite3.connect') as mock_connect:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            # Setup fetchall to return columns WITHOUT ai_image so ALTER TABLE triggers
            mock_cursor.fetchall.return_value = [
                (0, 'id', 'INTEGER', 1, None, 1),
                (1, 'patient_name', 'TEXT', 0, None, 0)
            ]

            import sqlite3
            def execute_side_effect(query, *args, **kwargs):
                if "ALTER TABLE scans ADD COLUMN ai_image TEXT" in query:
                    raise sqlite3.OperationalError("duplicate column name: ai_image")
            mock_cursor.execute.side_effect = execute_side_effect

            init_db()

            mock_cursor.execute.assert_any_call("ALTER TABLE scans ADD COLUMN ai_image TEXT")
            mock_conn.commit.assert_called_once()
            mock_conn.close.assert_called_once()

    def test_init_db_migration_error_path_raise(self):
        from unittest.mock import MagicMock
        with patch('gui.database.sqlite3.connect') as mock_connect:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            # Setup fetchall to return columns WITHOUT ai_image so ALTER TABLE triggers
            mock_cursor.fetchall.return_value = [
                (0, 'id', 'INTEGER', 1, None, 1),
                (1, 'patient_name', 'TEXT', 0, None, 0)
            ]

            import sqlite3
            def execute_side_effect(query, *args, **kwargs):
                if "ALTER TABLE scans ADD COLUMN ai_image TEXT" in query:
                    raise sqlite3.OperationalError("some other error")
            mock_cursor.execute.side_effect = execute_side_effect

            with self.assertRaises(sqlite3.OperationalError):
                init_db()

    def test_db_path_fallback(self):
        # We need to reload the gui.database module with mocked os.path.isdir to reach line 41
        import importlib
        import gui.database
        with patch('gui.database.os.path.isdir', return_value=False):
            # Also patch os.path.exists to true for shadow_analyst_dir because the condition is "exists AND isdir"
            with patch('gui.database.os.path.exists', return_value=True):
                # When we reload, it will re-execute the module-level code
                try:
                    importlib.reload(gui.database)
                    self.assertTrue(gui.database.DB_PATH.endswith("shadow_analyst.db"))
                    self.assertNotIn("ShadowAnalyst/shadow_analyst.db", gui.database.DB_PATH.replace("\\", "/"))
                finally:
                    # Reload again without mocks to restore original state for other tests
                    importlib.reload(gui.database)

if __name__ == '__main__':
    unittest.main()
