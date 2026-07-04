import json
import os
import tempfile
from unittest.mock import patch, mock_open
import pytest

from gui.app import save_config

def test_save_config_success():
    cfg = {"test_key": "test_value"}
    with tempfile.TemporaryDirectory() as tmpdir:
        config_file_path = os.path.join(tmpdir, "config.json")

        # Patch the CONFIG_FILE variable in gui.app
        with patch("gui.app.CONFIG_FILE", config_file_path):
            save_config(cfg)

            # Verify the file was created and contains the right config
            assert os.path.exists(config_file_path)
            with open(config_file_path, "r", encoding="utf-8") as f:
                saved_cfg = json.load(f)

            assert saved_cfg == cfg

def test_save_config_error(capsys):
    cfg = {"test_key": "test_value"}

    # Mock open to raise an exception
    with patch("builtins.open", mock_open()) as mocked_open:
        mocked_open.side_effect = PermissionError("Permission denied")

        with patch("gui.app.CONFIG_FILE", "dummy.json"):
            save_config(cfg)

            # Verify exception was caught and printed
            captured = capsys.readouterr()
            assert "Error saving config atomically: Permission denied" in captured.out
