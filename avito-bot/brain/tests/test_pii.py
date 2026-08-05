# -*- coding: utf-8 -*-
import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pii

def run() -> int:
    failures = []

    print("--- _safe_scrub error handling ---")
    with patch("pii.scrub", side_effect=Exception("mocked error")):
        result = pii._safe_scrub("some text")
        ok = result == pii.SCRUB_FAILED_PLACEHOLDER
        print(f"  {'ок  ' if ok else 'ФЕЙЛ'} _safe_scrub возвращает placeholder при Exception")
        if not ok:
            failures.append("_safe_scrub не вернул placeholder при ошибке")

    print(f"\nИТОГ: {1 - len(failures)}/1")
    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(run())
