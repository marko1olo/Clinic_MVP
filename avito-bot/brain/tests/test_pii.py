# -*- coding: utf-8 -*-
"""Тесты скраббера персональных данных. Запуск: python brain/tests/test_pii.py"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pii  # noqa: E402

NORMALIZE_CASES: list[tuple[str, str | None]] = [
    # 11-digit numbers starting with 7 or 8 -> normalized
    ("+7 846 922-99-26", "+78469229926"),
    ("8 (846) 922-99-26", "+78469229926"),
    ("78469229926", "+78469229926"),
    ("88469229926", "+78469229926"),
    ("+7 (999) 123-45-67", "+79991234567"),
    ("89991234567", "+79991234567"),

    # 7-digit local numbers -> None
    ("922-99-26", None),
    ("9229926", None),

    # Strings without numbers -> None
    ("no numbers here", None),

    # Invalid lengths -> None
    ("123", None), # too short
    ("1234567890123", None), # too long

    # 11-digit numbers starting with something other than 7 or 8 -> None
    ("+1 555 123-4567", None),
]

def run() -> int:
    failures: list[str] = []

    print("--- normalize_phone ---")
    for raw, want in NORMALIZE_CASES:
        got = pii.normalize_phone(raw)
        ok = got == want
        if not ok:
            failures.append(f"normalize_phone({raw!r}): ждали {want}, получили {got}")
        print(f"  {'ок  ' if ok else 'ФЕЙЛ'} {raw:<20} -> {got}")

    print(f"\nИТОГ: {len(NORMALIZE_CASES) - len(failures)}/{len(NORMALIZE_CASES)}")
    for f in failures:
        print(f"  {f}")
    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(run())
