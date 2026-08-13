# -*- coding: utf-8 -*-
"""Тесты роутера. Запуск: python -X utf8 brain/tests/test_router.py"""
from __future__ import annotations

import sys
from pathlib import Path
from datetime import datetime, timezone
from unittest.mock import MagicMock, AsyncMock, patch

import pytest

_BRAIN = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_BRAIN))
sys.path.insert(0, str(_BRAIN / "gate"))

import router
from intent import Kind, Route, Decision
from guard import Verdict


class MockResult:
    def __init__(self, text, failure=None, model="test-model"):
        self.text = text
        self.failure = failure
        self.model = model


@pytest.fixture
def store():
    s = MagicMock()
    s.mark_seen.return_value = True
    s.is_ai_active.return_value = True
    return s


@pytest.fixture
def incoming():
    return router.Incoming("chat1", "ext1", "hello", datetime(2025, 1, 1, 12, 0, 0, tzinfo=timezone.utc))


@pytest.mark.asyncio
async def test_debounce(store, incoming):
    with patch("router.delay_mod.should_wait_for_more", return_value=True):
        outcome = await router.handle(incoming, store)
        assert outcome.route == "skip"
        assert outcome.kind == "debounce"


@pytest.mark.asyncio
async def test_duplicate(store, incoming):
    store.mark_seen.return_value = False
    with patch("router.delay_mod.should_wait_for_more", return_value=False):
        outcome = await router.handle(incoming, store)
        assert outcome.route == "skip"
        assert outcome.kind == "duplicate"


@pytest.mark.asyncio
async def test_ai_paused(store, incoming):
    store.is_ai_active.return_value = False
    with patch("router.delay_mod.should_wait_for_more", return_value=False):
        outcome = await router.handle(incoming, store)
        assert outcome.route == "skip"
        assert outcome.kind == "ai_paused"
        store.audit.assert_called_with("ai_silent", chat_id="chat1", payload={"reason": "перехват или пауза"})


@pytest.mark.asyncio
async def test_intent_ignore(store, incoming):
    with patch("router.delay_mod.should_wait_for_more", return_value=False), \
         patch("router.intent_mod.classify", return_value=Decision(Route.IGNORE, Kind.JUNK, "junk")):
        outcome = await router.handle(incoming, store)
        assert outcome.route == "ignore"
        assert outcome.kind == "junk"
        store.audit.assert_called_with("ignored", chat_id="chat1", payload={"kind": "junk"})


@pytest.mark.asyncio
async def test_llm_auto(store, incoming):
    with patch("router.delay_mod.should_wait_for_more", return_value=False), \
         patch("router.intent_mod.classify", return_value=Decision(Route.AUTO, Kind.SAFE_FACT, "fact", topic="address")), \
         patch("router.llm.complete", new_callable=AsyncMock) as mock_llm, \
         patch("router.guard.check", return_value=Verdict(True)):
        mock_llm.return_value = MockResult("Here is the address")
        outcome = await router.handle(incoming, store)
        assert outcome.route == "auto"
        assert outcome.text == "Here is the address"


@pytest.mark.asyncio
async def test_llm_draft_by_intent(store, incoming):
    with patch("router.delay_mod.should_wait_for_more", return_value=False), \
         patch("router.intent_mod.classify", return_value=Decision(Route.DRAFT, Kind.PRICE, "price")), \
         patch("router.llm.complete", new_callable=AsyncMock) as mock_llm, \
         patch("router.guard.check", return_value=Verdict(True)):
        mock_llm.return_value = MockResult("The price is 100")
        outcome = await router.handle(incoming, store)
        assert outcome.route == "draft"


@pytest.mark.asyncio
async def test_llm_draft_by_veto(store, incoming):
    with patch("router.delay_mod.should_wait_for_more", return_value=False), \
         patch("router.intent_mod.classify", return_value=Decision(Route.AUTO, Kind.SAFE_FACT, "fact")), \
         patch("router.llm.complete", new_callable=AsyncMock) as mock_llm, \
         patch("router.guard.check", return_value=Verdict(False, violations=("bad",))):
        mock_llm.return_value = MockResult("Bad address")
        outcome = await router.handle(incoming, store)
        assert outcome.route == "draft"
        assert outcome.veto == ("bad",)


@pytest.mark.asyncio
async def test_degraded_auto(store, incoming):
    with patch("router.delay_mod.should_wait_for_more", return_value=False), \
         patch("router.intent_mod.classify", return_value=Decision(Route.AUTO, Kind.SAFE_FACT, "fact", topic="greeting")), \
         patch("router.llm.complete", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = MockResult(None, failure="api error")
        outcome = await router.handle(incoming, store)
        assert outcome.route == "auto"
        assert outcome.degraded is True
        assert outcome.text is not None


@pytest.mark.asyncio
async def test_degraded_draft(store, incoming):
    with patch("router.delay_mod.should_wait_for_more", return_value=False), \
         patch("router.intent_mod.classify", return_value=Decision(Route.DRAFT, Kind.PRICE, "price")), \
         patch("router.llm.complete", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = MockResult(None, failure="api error")
        outcome = await router.handle(incoming, store)
        assert outcome.route == "draft"
        assert outcome.degraded is True
        assert outcome.text is None


def test_outcome_property():
    outcome = router.Outcome("auto", None, None, "kind", "reason")
    assert outcome.will_reach_patient_without_human is True
    outcome_draft = router.Outcome("draft", None, None, "kind", "reason")
    assert outcome_draft.will_reach_patient_without_human is False


def test_canned_safe_answer_not_safe_fact():
    decision = Decision(Route.AUTO, Kind.UNKNOWN, "reason")
    assert router._canned_safe_answer(decision) is None


@patch("router.hours.describe_now", return_value="now")
@patch("router.hours.describe_schedule", return_value="schedule")
def test_canned_safe_answer_schedule(mock_sch, mock_now):
    decision = Decision(Route.AUTO, Kind.SAFE_FACT, "reason", topic="schedule")
    assert router._canned_safe_answer(decision) == "now schedule"


@patch("router.facts.clinic_contact_facts", return_value={"address": "addr", "district": "dist", "metro": "metro", "phone": "123"})
def test_canned_safe_answer_address(mock_facts):
    decision = Decision(Route.AUTO, Kind.SAFE_FACT, "reason", topic="address")
    assert "addr" in router._canned_safe_answer(decision)


@patch("router.facts.clinic_contact_facts", return_value={"address": "addr", "district": "dist", "metro": "metro", "phone": "123"})
def test_canned_safe_answer_parking(mock_facts):
    decision = Decision(Route.AUTO, Kind.SAFE_FACT, "reason", topic="parking")
    assert "Парковка" in router._canned_safe_answer(decision)


@patch("router.facts.clinic_contact_facts", return_value={"address": "addr", "district": "dist", "metro": "metro", "phone": "123"})
def test_canned_safe_answer_greeting(mock_facts):
    decision = Decision(Route.AUTO, Kind.SAFE_FACT, "reason", topic="greeting")
    assert "Здравствуйте" in router._canned_safe_answer(decision)


def test_canned_safe_answer_unknown_topic():
    decision = Decision(Route.AUTO, Kind.SAFE_FACT, "reason", topic="unknown")
    assert router._canned_safe_answer(decision) is None

if __name__ == "__main__":
    pytest.main([__file__])
