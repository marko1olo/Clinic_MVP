import unittest
from unittest.mock import patch
from io import StringIO
import sys

import Scripts.research_vps

class TestResearchVpsEnv(unittest.TestCase):
    @patch.dict('os.environ', {}, clear=True)
    @patch('sys.stderr', new_callable=StringIO)
    def test_missing_env_vars(self, mock_stderr):
        with self.assertRaises(SystemExit) as cm:
            Scripts.research_vps.main()

        self.assertEqual(cm.exception.code, 1)
        self.assertIn("Error: VPS_HOST and either VPS_PASSWORD or VPS_KEY_PATH environment variables must be set.", mock_stderr.getvalue())

if __name__ == '__main__':
    unittest.main()
