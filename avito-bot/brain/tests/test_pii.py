# -*- coding: utf-8 -*-
"""Тесты скраббера персональных данных. Запуск: python brain/tests/test_pii.py"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pii  # noqa: E402


def run() -> int:
    failures: list[str] = []

    def check(label: str, condition: bool, detail: str = "") -> None:
        if condition:
            print(f"  ок   {label}")
        else:
            print(f"  ФЕЙЛ {label} — {detail}")
            failures.append(label)

    print("--- normalize_phone ---")

    # 1. 11-digit numbers starting with 7 or 8 -> +7XXXXXXXXXX
    check("11 цифр, начинается с 7, с плюсом", pii.normalize_phone("+7 999 123-45-67") == "+79991234567")
    check("11 цифр, начинается с 8, без плюса", pii.normalize_phone("89991234567") == "+79991234567")
    check("11 цифр, начинается с 7, скобки и тире", pii.normalize_phone("7 (999) 123-45-67") == "+79991234567")

    # 2. 10-digit numbers -> +7XXXXXXXXXX
    check("10 цифр, без кода страны", pii.normalize_phone("9991234567") == "+79991234567")
    check("10 цифр, со скобками и пробелами", pii.normalize_phone("(999) 123 45 67") == "+79991234567")

    # 3. 7-digit numbers -> None
    check("7 цифр (местный номер), тире", pii.normalize_phone("922-99-26") is None, str(pii.normalize_phone("922-99-26")))
    check("7 цифр, сплошной", pii.normalize_phone("9229926") is None)

    # 4. Invalid lengths -> None
    check("9 цифр", pii.normalize_phone("999123456") is None)
    check("12 цифр", pii.normalize_phone("+799912345678") is None)
    check("11 цифр, но начинается с 9", pii.normalize_phone("99991234567") is None)

    # 5. Garbage and empty -> None
    check("буквы", pii.normalize_phone("абвгдежзийк") is None)
    check("пустая строка", pii.normalize_phone("") is None)
    check("смесь", pii.normalize_phone("телефон: (999) 123-45-67") == "+79991234567")

    total = 13
    print(f"\nИТОГ: {total - len(failures)}/{total}")
    for f in failures:
        print(f"  провал: {f}")
    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(run())
