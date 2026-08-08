import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "gate"))

import intent
from intent import Kind, Route, Decision

class TestIntent(unittest.TestCase):
    def test_normalize(self):
        self.assertEqual(intent.normalize("Ещё"), "еще")
        self.assertEqual(intent.normalize("Привет, как дела?!"), "привет как дела")
        self.assertEqual(intent.normalize("  Много   пробелов  "), "много пробелов")

    def test_hits(self):
        self.assertEqual(intent._hits("какой у вас адрес", (r"\bадрес\b",)), [r"\bадрес\b"])
        self.assertEqual(intent._hits("доктор", (r"\bкт\b",)), [])

    def test_classify_junk(self):
        self.assertEqual(intent.classify("").route, Route.IGNORE)
        self.assertEqual(intent.classify("a").route, Route.IGNORE)
        self.assertEqual(intent.classify("Предлагаю продвижение SEO").kind, Kind.JUNK)

    def test_classify_safe_fact(self):
        d = intent.classify("какой адрес?")
        self.assertEqual(d.route, Route.AUTO)
        self.assertEqual(d.kind, Kind.SAFE_FACT)

    def test_classify_long_safe_fact(self):
        text = "какой у вас адрес? " + "очень " * 50
        d = intent.classify(text)
        self.assertEqual(d.route, Route.DRAFT)
        self.assertEqual(d.kind, Kind.SAFE_FACT)
        self.assertIn("вероятно, там ещё и жалоба", d.reason)

    def test_classify_price(self):
        d = intent.classify("сколько стоит вылечить кариес")
        self.assertEqual(d.route, Route.DRAFT)
        self.assertEqual(d.kind, Kind.PRICE)

    def test_classify_medical(self):
        d = intent.classify("у меня болит зуб")
        self.assertEqual(d.route, Route.DRAFT)
        self.assertEqual(d.kind, Kind.MEDICAL)

    def test_classify_booking(self):
        d = intent.classify("можно записаться на завтра")
        self.assertEqual(d.route, Route.DRAFT)
        self.assertEqual(d.kind, Kind.BOOKING)

    def test_classify_no_quote_topic(self):
        d = intent.classify("сколько стоят брекеты")
        self.assertEqual(d.route, Route.DRAFT)
        self.assertEqual(d.kind, Kind.NO_QUOTE_TOPIC)

    def test_classify_unknown(self):
        d = intent.classify("как зовут врача")
        self.assertEqual(d.route, Route.DRAFT)
        self.assertEqual(d.kind, Kind.UNKNOWN)

if __name__ == "__main__":
    unittest.main()
