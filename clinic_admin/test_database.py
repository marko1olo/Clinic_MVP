import unittest
from unittest.mock import patch, MagicMock
import sqlite3

from clinic_admin.database import get_connection, DB_FILE

class TestDatabase(unittest.TestCase):
    @patch('clinic_admin.database.sqlite3.connect')
    def test_get_connection(self, mock_connect):
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        conn = get_connection()

        mock_connect.assert_called_once_with(DB_FILE)
        self.assertEqual(conn.row_factory, sqlite3.Row)
        self.assertEqual(conn, mock_conn)

if __name__ == '__main__':
    unittest.main()
