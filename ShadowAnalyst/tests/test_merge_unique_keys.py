import pytest
from app import merge_unique_keys

def test_merge_unique_keys_empty_lists():
    assert merge_unique_keys([], []) == []

def test_merge_unique_keys_disjoint_lists():
    assert merge_unique_keys([1, 2], [3, 4]) == [1, 2, 3, 4]

def test_merge_unique_keys_overlapping():
    assert merge_unique_keys([1, 2, 3], [3, 4, 5]) == [1, 2, 3, 4, 5]

def test_merge_unique_keys_all_duplicate():
    assert merge_unique_keys([1, 2, 3], [1, 2, 3]) == [1, 2, 3]

def test_merge_unique_keys_order_preservation():
    assert merge_unique_keys(["a", "b"], ["c", "b", "d"]) == ["a", "b", "c", "d"]

def test_merge_unique_keys_mixed_types():
    assert merge_unique_keys([1, "a"], ["b", 1]) == [1, "a", "b"]

def test_merge_unique_keys_empty_env():
    assert merge_unique_keys([1, 2], []) == [1, 2]

def test_merge_unique_keys_empty_config():
    assert merge_unique_keys([], [1, 2]) == [1, 2]
