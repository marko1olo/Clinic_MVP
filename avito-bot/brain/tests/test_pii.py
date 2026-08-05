# -*- coding: utf-8 -*-
"""Тесты скраббера персональных данных (PII)."""
from __future__ import annotations

import logging
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pii  # noqa: E402


class TestPii(unittest.TestCase):
    def test_normalize_phone(self):
        self.assertEqual(pii.normalize_phone("+7 999 123-45-67"), "+79991234567")
        self.assertEqual(pii.normalize_phone("8 (999) 123 45 67"), "+79991234567")
        self.assertEqual(pii.normalize_phone("9991234567"), "+79991234567")
        self.assertIsNone(pii.normalize_phone("922-99-26"))
        self.assertIsNone(pii.normalize_phone("799912345678"))
        self.assertIsNone(pii.normalize_phone("не номер"))

    def test_scrub_and_has_pii(self):
        text_with_pii = "Мой телефон +7 999 123-45-67 и почта test@test.com"
        self.assertTrue(pii.has_pii(text_with_pii))
        scrubbed = pii.scrub(text_with_pii)
        self.assertIn(pii.PHONE_PLACEHOLDER, scrubbed)
        self.assertIn(pii.EMAIL_PLACEHOLDER, scrubbed)
        self.assertNotIn("+7 999 123-45-67", scrubbed)
        self.assertNotIn("test@test.com", scrubbed)

        text_no_pii = "Здравствуйте, как к вам записаться?"
        self.assertFalse(pii.has_pii(text_no_pii))
        self.assertEqual(pii.scrub(text_no_pii), text_no_pii)

    def test_own_phones_not_scrubbed(self):
        our_phones = list(pii.own_phones())
        if not our_phones:
            self.skipTest("нет собственных телефонов в фактах")
            return

        our_phone = our_phones[0]
        digits = "".join(filter(str.isdigit, our_phone))
        our_local = f"{digits[-7:-4]}-{digits[-4:-2]}-{digits[-2:]}"
        text_our_phone = f"Звоните нам {our_phone} или {our_local}"

        self.assertFalse(pii.has_pii(text_our_phone))
        self.assertEqual(pii.scrub(text_our_phone), text_our_phone)

    def test_find_phones(self):
        phones = pii.find_phones("Мой первый 89991234567 и второй +7(999)765-43-21. А еще раз первый 8 999 123 45 67")
        self.assertEqual(len(phones), 2)
        self.assertIn("+79991234567", phones)
        self.assertIn("+79997654321", phones)

    def test_phone_hash(self):
        hash1 = pii.phone_hash("+7 999 123-45-67")
        hash2 = pii.phone_hash("89991234567")
        self.assertEqual(hash1, hash2)
        self.assertEqual(len(hash1), pii.HASH_CHARS)

        with self.assertRaises(ValueError):
            pii.phone_hash("не номер")

    def test_pii_log_filter(self):
        logger = logging.getLogger("test_pii_logger")
        logger.setLevel(logging.INFO)

        # Remove any existing handlers
        logger.handlers = []

        class ListHandler(logging.Handler):
            def __init__(self):
                super().__init__()
                self.records = []
            def emit(self, record):
                self.records.append(record)

        handler = ListHandler()
        pii.attach(handler)
        logger.addHandler(handler)

        logger.info("Test %s", "test@test.com")
        record = handler.records[-1]
        self.assertIn(pii.EMAIL_PLACEHOLDER, record.msg)
        self.assertEqual(len(record.args), 0)

        exc_record = logging.LogRecord("name", logging.INFO, "path", 1, "test msg", (), None)
        exc_record.exc_text = "error with email test@test.com"
        pii._FILTER.filter(exc_record)
        self.assertIn(pii.EMAIL_PLACEHOLDER, exc_record.exc_text or "")


if __name__ == '__main__':
    unittest.main()
