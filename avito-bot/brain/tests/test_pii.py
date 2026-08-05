# -*- coding: utf-8 -*-
"""Тесты скраббера персональных данных (152-ФЗ). Запуск: python brain/tests/test_pii.py"""
from __future__ import annotations

import logging
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pii  # noqa: E402
from pii import scrub, find_phones, phone_hash, has_pii, own_phones, _own_local_tails, PiiLogFilter  # noqa: E402


class Checks:
    """Счётчик проверок. Печатает каждую строкой, копит провалы, считает итог."""

    def __init__(self) -> None:
        self.total = 0
        self.failures: list[str] = []

    def ok(self, label: str, condition: bool, detail: str = "") -> bool:
        self.total += 1
        if not condition:
            self.failures.append(f"{label}{': ' + detail if detail else ''}")
        print(f"  {'ок  ' if condition else 'ФЕЙЛ'} {label}"
              f"{'' if condition or not detail else '  -- ' + detail}")
        return condition

    def eq(self, label: str, got: object, want: object) -> bool:
        return self.ok(label, got == want, f"ждали {want!r}, получили {got!r}")

    def raises(self, label: str, exc: type[BaseException], fn, *args, **kwargs) -> bool:
        try:
            fn(*args, **kwargs)
        except exc:
            return self.ok(label, True)
        except BaseException as other:  # noqa: BLE001
            return self.ok(label, False, f"ждали {exc.__name__}, получили "
                                         f"{type(other).__name__}: {other}")
        return self.ok(label, False, f"ждали {exc.__name__}, исключения не было")

    def section(self, title: str) -> None:
        print(f"\n--- {title} ---")


def check_scrub(c: Checks) -> None:
    c.section("Скраббинг текста")
    c.eq("email вырезается", scrub("Моя почта test@example.com"), "Моя почта [email]")
    c.eq("телефон с 8 вырезается", scrub("Звоните 89991234567"), "Звоните [телефон]")
    c.eq("телефон с +7 и пробелами вырезается", scrub("Звоните +7 999 123 45 67"), "Звоните [телефон]")
    c.eq("местный 7-значный номер вырезается", scrub("Звоните 123-45-67"), "Звоните [телефон]")
    c.eq("текст без ПД не меняется", scrub("Просто текст без данных"), "Просто текст без данных")

    # Наши телефоны
    our_phone = list(own_phones())[0]
    our_local_tail = list(_own_local_tails())[0]
    our_local = f"{our_local_tail[:3]}-{our_local_tail[3:5]}-{our_local_tail[5:]}"

    c.eq("наш телефон (полный) не скрабится", scrub(f"Наш номер: {our_phone}"), f"Наш номер: {our_phone}")
    c.eq("наш телефон (короткий) не скрабится", scrub(f"Наш номер: {our_local}"), f"Наш номер: {our_local}")

def check_has_pii(c: Checks) -> None:
    c.section("Определение наличия ПД (has_pii)")
    c.eq("has_pii с ПД -> True", has_pii("Звоните 89991234567"), True)
    c.eq("has_pii без ПД -> False", has_pii("Просто текст"), False)
    our_phone = list(own_phones())[0]
    c.eq("has_pii с нашим номером -> False", has_pii(f"Наш номер: {our_phone}"), False)

def check_find_phones(c: Checks) -> None:
    c.section("Поиск телефонов (find_phones)")
    c.eq("находит телефон в тексте", find_phones("Мой 89991234567"), ["+79991234567"])
    our_phone = list(own_phones())[0]
    c.eq("игнорирует наши телефоны", find_phones(f"Наш номер: {our_phone}"), [])

def check_phone_hash(c: Checks) -> None:
    c.section("Хэширование телефонов (phone_hash)")
    if "PII_PHONE_PEPPER" in os.environ:
        del os.environ["PII_PHONE_PEPPER"]

    hash1 = phone_hash("+79991234567")
    hash2 = phone_hash("89991234567")
    c.eq("одинаковый хэш для разных форматов одного номера", hash1, hash2)
    c.eq("длина хэша 16 символов", len(hash1), 16)
    c.raises("ошибка при неверном номере", ValueError, phone_hash, "123")

def check_log_filter(c: Checks) -> None:
    c.section("Логирование (PiiLogFilter)")
    class DummyRecord:
        def __init__(self, msg, args, exc_text=None):
            self.msg = msg
            self.args = args
            self.exc_text = exc_text
        def getMessage(self):
            return self.msg % self.args if self.args else str(self.msg)

    filter = PiiLogFilter()

    # 1. ПД в сообщении без аргументов
    record = DummyRecord("Тут телефон +79991234567", ())
    filter.filter(record)
    c.eq("msg отскраблен", record.msg, "Тут телефон [телефон]")

    # 2. ПД в аргументах
    record2 = DummyRecord("Телефон пациента: %s", ("+79991234567",))
    filter.filter(record2)
    c.eq("msg подменён на отскрабленный", record2.msg, "Телефон пациента: [телефон]")
    c.eq("args очищены", record2.args, ())

def run() -> int:
    c = Checks()
    check_scrub(c)
    check_has_pii(c)
    check_find_phones(c)
    check_phone_hash(c)
    check_log_filter(c)

    print(f"\nИТОГ: {c.total - len(c.failures)}/{c.total}")
    for failure in c.failures:
        print(f"  {failure}")
    return 1 if c.failures else 0


if __name__ == "__main__":
    raise SystemExit(run())
