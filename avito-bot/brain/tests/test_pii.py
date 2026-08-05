import logging
import os
from unittest import mock

import pytest
from pii import (
    PiiLogFilter,
    find_phones,
    has_pii,
    normalize_phone,
    phone_hash,
    scrub,
)

# clinic numbers:
# primary: +7 (846) 922-99-26 -> +78469229926 (local tail: 922-99-26)
# secondary: +7 (927) 712-99-26 -> +79277129926 (local tail: 712-99-26)

def test_normalize_phone():
    assert normalize_phone("+7 999 123-45-67") == "+79991234567"
    assert normalize_phone("89991234567") == "+79991234567"
    assert normalize_phone("9991234567") == "+79991234567"
    assert normalize_phone("922-99-26") is None  # Local form returns None
    assert normalize_phone("not a phone") is None


def test_find_phones():
    text = "Call me at +7 999 123-45-67 or 8 (900) 000-00-00. Also my clinic is +7 (846) 922-99-26 and local 922-99-26."
    phones = find_phones(text)

    assert "+79991234567" in phones
    assert "+79000000000" in phones

    # clinic phones shouldn't be extracted
    assert "+78469229926" not in phones
    assert "922-99-26" not in phones


def test_scrub():
    text = "Patient email is test@example.com and phone +7 999 123-45-67. Clinic phone: +7 (846) 922-99-26 and 922-99-26."
    scrubbed = scrub(text)

    assert "test@example.com" not in scrubbed
    assert "[email]" in scrubbed

    assert "+7 999 123-45-67" not in scrubbed
    assert "[телефон]" in scrubbed

    # clinic phones should be preserved
    assert "+7 (846) 922-99-26" in scrubbed
    assert "922-99-26" in scrubbed


def test_has_pii():
    assert has_pii("Patient email is test@example.com") is True
    assert has_pii("Patient phone is +7 999 123-45-67") is True
    assert has_pii("Hello, my number is 922-99-26") is False  # Clinic number
    assert has_pii("Hello, how much is the procedure?") is False


def test_phone_hash():
    # stable hash for normal phone
    hash1 = phone_hash("+7 999 123-45-67")
    hash2 = phone_hash("89991234567")
    assert hash1 == hash2
    assert len(hash1) == 16

    # raises error on invalid phone
    with pytest.raises(ValueError):
        phone_hash("922-99-26")

    # tests pepper environment variable
    with mock.patch.dict(os.environ, {"PII_PHONE_PEPPER": "secret_pepper"}):
        hash3 = phone_hash("+7 999 123-45-67")
        assert hash3 != hash1


def test_pii_log_filter():
    logger = logging.getLogger("test_pii_logger")
    logger.setLevel(logging.INFO)

    # prevent multiple handlers in case test runs multiple times
    logger.handlers.clear()

    handler = logging.StreamHandler()
    filter_ = PiiLogFilter()
    handler.addFilter(filter_)
    logger.addHandler(handler)

    record1 = logging.LogRecord("name", logging.INFO, "pathname", 1, "User %s has phone %s", ("test", "+7 999 123-45-67"), None)
    assert filter_.filter(record1) is True

    assert "User test has phone [телефон]" in record1.msg
    assert record1.args == ()  # args wiped out

    # Test record without PII is untouched
    record2 = logging.LogRecord("name", logging.INFO, "pathname", 1, "Clinic phone is %s", ("+7 (846) 922-99-26",), None)
    assert filter_.filter(record2) is True

    assert record2.msg == "Clinic phone is %s"
    assert record2.args == ("+7 (846) 922-99-26",)
