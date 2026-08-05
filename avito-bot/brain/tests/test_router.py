# -*- coding: utf-8 -*-
"""Тесты роутера. Запуск: python -m unittest avito-bot/brain/tests/test_router.py"""
from __future__ import annotations

import sys
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "gate"))

import router  # noqa: E402
from router import Incoming  # noqa: E402
from intent import Decision, Route, Kind  # noqa: E402
from llm.client import LlmResult  # noqa: E402
from guard import Verdict  # noqa: E402
from delay import Plan  # noqa: E402
from zoneinfo import ZoneInfo # noqa: E402
import hours # noqa: E402


class MockStore:
    def __init__(self):
        self.mark_seen = MagicMock(return_value=True)
        self.touch_dialog = MagicMock()
        self.is_ai_active = MagicMock(return_value=True)
        self.audit = MagicMock()


def make_incoming(text: str = "test") -> Incoming:
    return Incoming(
        chat_id="chat1",
        external_id="ext1",
        text=text,
        at=datetime(2026, 8, 5, 12, 0, 0, tzinfo=hours.tz()),
    )


class TestRouter(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.store = MockStore()

    @patch("delay.should_wait_for_more", return_value=True)
    async def test_debounce(self, mock_delay):
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "skip")
        self.assertTrue(out.reason.startswith("пациент писал"))

    @patch("delay.should_wait_for_more", return_value=False)
    async def test_duplicate(self, mock_delay):
        self.store.mark_seen.return_value = False
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "skip")
        self.assertTrue(out.reason.startswith("сообщение ext1 уже обработано"))

    @patch("delay.should_wait_for_more", return_value=False)
    async def test_ai_paused(self, mock_delay):
        self.store.is_ai_active.return_value = False
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "skip")
        self.assertIn("диалог у администратора", out.reason)

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify", return_value=Decision(route=Route.IGNORE, kind=Kind.JUNK, reason="junk", topic=None))
    async def test_ignore_rule(self, mock_intent, mock_delay):
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "ignore")
        self.assertEqual(out.reason, "junk")

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify", return_value=Decision(route=Route.AUTO, kind=Kind.SAFE_FACT, reason="safe", topic="address"))
    @patch("llm.client.complete", return_value=LlmResult(text=None, model="", provider="", attempts=1, latency_ms=10, failure="rate_limit"))
    @patch("delay.plan_reply", return_value=Plan(send_at=datetime(2026, 8, 5, 12, 1, 0), delay_seconds=60, reason="test"))
    async def test_canned_safe_answer(self, mock_plan, mock_llm, mock_intent, mock_delay):
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "auto")
        self.assertIsNotNone(out.text)
        self.assertIn("Мы на ", out.text)
        self.assertTrue(out.degraded)

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify", return_value=Decision(route=Route.DRAFT, kind=Kind.PRICE, reason="price", topic="caries"))
    @patch("llm.client.complete", return_value=LlmResult(text=None, model="", provider="", attempts=1, latency_ms=10, failure="rate_limit"))
    async def test_llm_failure_draft(self, mock_llm, mock_intent, mock_delay):
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "draft")
        self.assertTrue(out.degraded)
        self.assertIn("LLM недоступна", out.reason)

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify", return_value=Decision(route=Route.AUTO, kind=Kind.SAFE_FACT, reason="safe", topic="address"))
    @patch("llm.client.complete", return_value=LlmResult(text="Hello", model="gpt-4o", provider="openai", attempts=1, latency_ms=100, failure=None))
    @patch("guard.check", return_value=Verdict(ok=True))
    @patch("delay.plan_reply", return_value=Plan(send_at=datetime(2026, 8, 5, 12, 1, 0), delay_seconds=60, reason="test"))
    async def test_happy_path(self, mock_plan, mock_guard, mock_llm, mock_intent, mock_delay):
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "auto")
        self.assertEqual(out.text, "Hello")

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify", return_value=Decision(route=Route.AUTO, kind=Kind.SAFE_FACT, reason="safe", topic="address"))
    @patch("llm.client.complete", return_value=LlmResult(text="Bad response", model="gpt-4o", provider="openai", attempts=1, latency_ms=100, failure=None))
    @patch("guard.check", return_value=Verdict(ok=False, violations=("bad link",)))
    @patch("delay.plan_reply", return_value=Plan(send_at=datetime(2026, 8, 5, 12, 1, 0), delay_seconds=60, reason="test"))
    async def test_guard_veto(self, mock_plan, mock_guard, mock_llm, mock_intent, mock_delay):
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "draft")
        self.assertIn("вето: ", out.reason)

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify", return_value=Decision(route=Route.DRAFT, kind=Kind.PRICE, reason="price check", topic="caries"))
    @patch("llm.client.complete", return_value=LlmResult(text="Good response", model="gpt-4o", provider="openai", attempts=1, latency_ms=100, failure=None))
    @patch("guard.check", return_value=Verdict(ok=True))
    @patch("delay.plan_reply", return_value=Plan(send_at=datetime(2026, 8, 5, 12, 1, 0), delay_seconds=60, reason="test"))
    async def test_ceiling_draft(self, mock_plan, mock_guard, mock_llm, mock_intent, mock_delay):
        inc = make_incoming()
        out = await router.handle(inc, self.store)
        self.assertEqual(out.route, "draft")
        self.assertEqual(out.text, "Good response")

if __name__ == "__main__":
    unittest.main()