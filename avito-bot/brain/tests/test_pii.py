# -*- coding: utf-8 -*-
"""Тесты скраббера ПД. Запуск: python -m unittest avito-bot/brain/tests/test_pii.py"""
from __future__ import annotations

import logging
import os
import sys
import unittest
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pii  # noqa: E402


class CaptureHandler(logging.Handler):
    def __init__(self) -> None:
        super().__init__()
        self.records: list[logging.LogRecord] = []

    def emit(self, record: logging.LogRecord) -> None:
        self.records.append(record)


class TestPii(unittest.TestCase):

    def test_normalize_phone(self):
        self.assertEqual(pii.normalize_phone("+7 999 123-45-67"), "+79991234567")
        self.assertEqual(pii.normalize_phone("8 (999) 123-45-67"), "+79991234567")
        self.assertEqual(pii.normalize_phone("9991234567"), "+79991234567")
        self.assertIsNone(pii.normalize_phone("922-99-26"))
        self.assertIsNone(pii.normalize_phone("не номер"))

    def test_scrub(self):
        self.assertEqual(pii.scrub("Мой номер 8 999 123-45-67, звоните"), "Мой номер [телефон], звоните")
        self.assertEqual(pii.scrub("Моя почта test@example.com"), "Моя почта [email]")
        self.assertEqual(pii.scrub("ivan89991234567@mail.ru"), "[email]")
        self.assertEqual(pii.scrub("Звоните +7 (846) 922-99-26"), "Звоните +7 (846) 922-99-26")
        self.assertEqual(pii.scrub("Звоните 922-99-26"), "Звоните 922-99-26")
        self.assertEqual(pii.scrub("Мой номер 123-45-67"), "Мой номер [телефон]")
        self.assertEqual(pii.scrub("Жалоба на зуб"), "Жалоба на зуб")
        self.assertEqual(pii.scrub("Авито id 1234567890"), "Авито id [телефон]")

    def test_find_phones(self):
        phones = pii.find_phones("Мой номер 8 999 123-45-67 и 89991234567, а ваш 922-99-26")
        self.assertEqual(phones, ["+79991234567"])

    def test_has_pii(self):
        self.assertTrue(pii.has_pii("89991234567"))
        self.assertTrue(pii.has_pii("a@b.ru"))
        self.assertFalse(pii.has_pii("Привет"))
        self.assertFalse(pii.has_pii("922-99-26"))

    def test_phone_hash(self):
        h1 = pii.phone_hash("8 999 123-45-67")
        h2 = pii.phone_hash("+79991234567")
        self.assertEqual(h1, h2)
        self.assertEqual(len(h1), 16)

        with patch.dict(os.environ, {"PII_PHONE_PEPPER": "pepper"}):
            h3 = pii.phone_hash("+79991234567")
            self.assertNotEqual(h1, h3)

        with self.assertRaises(ValueError):
            pii.phone_hash("123")

    def test_pii_log_filter(self):
        logger = logging.getLogger("test_pii_logger")
        logger.setLevel(logging.INFO)
        handler = CaptureHandler()
        pii.attach(handler)
        logger.addHandler(handler)

        logger.info("Мой номер 89991234567")
        self.assertEqual(handler.records[-1].msg, "Мой номер [телефон]")

        logger.info("Мой номер %s", "89991234567")
        self.assertEqual(handler.records[-1].msg, "Мой номер [телефон]")
        self.assertEqual(handler.records[-1].args, ())

        logger.info("Без ПД %s", "тут")
        self.assertEqual(handler.records[-1].args, ("тут",))

        logger.info("тел +7 999 %s-45-67", "123")
        self.assertEqual(handler.records[-1].msg, "тел [телефон]")

        logger.info("Плохой формат и номер 89991234567 %d")
        self.assertEqual(handler.records[-1].msg, "Плохой формат и номер [телефон] %d")


if __name__ == "__main__":
    unittest.main()
