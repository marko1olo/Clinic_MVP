import unittest
import sys
from unittest.mock import MagicMock

# Mock problematic dependencies to test merge_unique_keys
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()
sys.modules['edge_tts'] = MagicMock()

from gui.app import merge_unique_keys

class TestMergeUniqueKeys(unittest.TestCase):
    def test_merge_unique_keys_empty(self):
        """Test with empty lists."""
        self.assertEqual(merge_unique_keys([], []), [])

    def test_merge_unique_keys_no_overlap(self):
        """Test with disjoint lists."""
        self.assertEqual(merge_unique_keys(['a', 'b'], ['c', 'd']), ['a', 'b', 'c', 'd'])

    def test_merge_unique_keys_full_overlap(self):
        """Test with identical lists."""
        self.assertEqual(merge_unique_keys(['a', 'b'], ['a', 'b']), ['a', 'b'])

    def test_merge_unique_keys_partial_overlap(self):
        """Test with partially overlapping lists."""
        self.assertEqual(merge_unique_keys(['a', 'b', 'c'], ['c', 'd', 'e']), ['a', 'b', 'c', 'd', 'e'])

    def test_merge_unique_keys_order_preserved(self):
        """Test that the order is preserved."""
        self.assertEqual(merge_unique_keys(['c', 'a'], ['b', 'c', 'a', 'd']), ['c', 'a', 'b', 'd'])

if __name__ == '__main__':
    unittest.main()
