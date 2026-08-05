import unittest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timezone, timedelta
import sys
from pathlib import Path

_BRAIN = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_BRAIN))

from router import Incoming, handle, Outcome
from intent import Kind, Route, Decision
from guard import Verdict

class TestRouter(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.store = MagicMock()
        self.store.mark_seen.return_value = True
        self.store.is_ai_active.return_value = True
        self.now = datetime.now(timezone.utc)
        self.incoming = Incoming(
            chat_id="chat_1",
            external_id="msg_1",
            text="Hello",
            at=self.now,
            history=()
        )

    @patch("hours.now")
    @patch("delay.should_wait_for_more")
    async def test_debounce_skip(self, mock_should_wait, mock_now):
        """1. Дебаунс: если delay.should_wait_for_more говорит ждать -> skip"""
        mock_should_wait.return_value = True
        mock_now.return_value = self.now + timedelta(seconds=2)

        outcome = await handle(self.incoming, self.store)

        self.assertEqual(outcome.route, "skip")
        self.assertEqual(outcome.kind, "debounce")
        self.assertIsNone(outcome.text)

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("hours.now")
    async def test_duplicate_skip(self, mock_now, mock_should_wait):
        """2. Дедуп: если сообщение уже было -> skip"""
        mock_now.return_value = self.now
        self.store.mark_seen.return_value = False

        outcome = await handle(self.incoming, self.store)

        self.assertEqual(outcome.route, "skip")
        self.assertEqual(outcome.kind, "duplicate")
        self.store.mark_seen.assert_called_once_with("msg_1", "chat_1", self.now)

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("hours.now")
    async def test_ai_paused_skip(self, mock_now, mock_should_wait):
        """3. Человек за рулём (ИИ отключен) -> skip"""
        mock_now.return_value = self.now
        self.store.is_ai_active.return_value = False

        outcome = await handle(self.incoming, self.store)

        self.assertEqual(outcome.route, "skip")
        self.assertEqual(outcome.kind, "ai_paused")
        self.store.audit.assert_called_with("ai_silent", chat_id="chat_1", payload={"reason": "перехват или пауза"})

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify")
    @patch("hours.now")
    async def test_intent_ignore(self, mock_now, mock_classify, mock_should_wait):
        """Если intent говорит IGNORE -> ignore"""
        mock_now.return_value = self.now
        mock_classify.return_value = Decision(route=Route.IGNORE, kind=Kind.JUNK, reason="спам")

        outcome = await handle(self.incoming, self.store)

        self.assertEqual(outcome.route, "ignore")
        self.assertEqual(outcome.kind, Kind.JUNK.value)
        self.store.audit.assert_called_with("ignored", chat_id="chat_1", payload={"kind": Kind.JUNK.value})

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify")
    @patch("llm.client.complete", new_callable=AsyncMock)
    @patch("hours.now")
    async def test_llm_failure_with_canned_answer(self, mock_now, mock_complete, mock_classify, mock_should_wait):
        """5. Деградированный режим с белым списком (LLM сломалась, intent разрешает)"""
        mock_now.return_value = self.now
        mock_classify.return_value = Decision(route=Route.AUTO, kind=Kind.SAFE_FACT, reason="факт", topic="greeting")

        # LLM failure result
        mock_complete.return_value = MagicMock(text=None, failure="timeout")

        with patch("router._canned_safe_answer", return_value="Здравствуйте.") as mock_canned, \
             patch("delay.plan_reply", return_value=MagicMock(send_at=self.now)) as mock_plan:

            outcome = await handle(self.incoming, self.store)

            self.assertEqual(outcome.route, "auto")
            self.assertEqual(outcome.text, "Здравствуйте.")
            self.assertTrue(outcome.degraded)
            self.store.audit.assert_called_with("degraded_auto", chat_id="chat_1", payload={"failure": "timeout"})

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify")
    @patch("llm.client.complete", new_callable=AsyncMock)
    @patch("hours.now")
    async def test_llm_failure_without_canned_answer(self, mock_now, mock_complete, mock_classify, mock_should_wait):
        """5. Деградированный режим без белого списка (LLM сломалась)"""
        mock_now.return_value = self.now
        mock_classify.return_value = Decision(route=Route.AUTO, kind=Kind.MEDICAL, reason="симптом")

        # LLM failure result
        mock_complete.return_value = MagicMock(text=None, failure="timeout")

        with patch("router._canned_safe_answer", return_value=None):
            outcome = await handle(self.incoming, self.store)

            self.assertEqual(outcome.route, "draft")
            self.assertIsNone(outcome.text)
            self.assertTrue(outcome.degraded)
            self.store.audit.assert_called_with("degraded_draft", chat_id="chat_1", payload={"failure": "timeout"})

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify")
    @patch("llm.client.complete", new_callable=AsyncMock)
    @patch("guard.check")
    @patch("hours.now")
    async def test_llm_success_veto_fails(self, mock_now, mock_guard, mock_complete, mock_classify, mock_should_wait):
        """6. Успешная генерация, но вето роняет в черновик"""
        mock_now.return_value = self.now
        mock_classify.return_value = Decision(route=Route.AUTO, kind=Kind.MEDICAL, reason="ок")
        mock_complete.return_value = MagicMock(text="Это стоит 15000", model="gemini")
        mock_guard.return_value = Verdict(ok=False, violations=("цена",))

        with patch("delay.plan_reply", return_value=MagicMock(send_at=self.now)):
            outcome = await handle(self.incoming, self.store)

            self.assertEqual(outcome.route, "draft")
            self.assertEqual(outcome.text, "Это стоит 15000")
            self.assertEqual(outcome.veto, ("цена",))
            self.assertTrue(self.store.audit.call_args_list[-1][0][0] == "veto")

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify")
    @patch("llm.client.complete", new_callable=AsyncMock)
    @patch("guard.check")
    @patch("hours.now")
    async def test_llm_success_auto(self, mock_now, mock_guard, mock_complete, mock_classify, mock_should_wait):
        """6. Успех и вето пройдено, intent позволяет AUTO"""
        mock_now.return_value = self.now
        mock_classify.return_value = Decision(route=Route.AUTO, kind=Kind.SAFE_FACT, reason="ок")
        mock_complete.return_value = MagicMock(text="Хороший ответ", model="gemini")
        mock_guard.return_value = Verdict(ok=True)

        with patch("delay.plan_reply", return_value=MagicMock(send_at=self.now)):
            outcome = await handle(self.incoming, self.store)

            self.assertEqual(outcome.route, "auto")
            self.assertEqual(outcome.text, "Хороший ответ")
            self.assertEqual(outcome.veto, ())

    @patch("delay.should_wait_for_more", return_value=False)
    @patch("intent.classify")
    @patch("llm.client.complete", new_callable=AsyncMock)
    @patch("guard.check")
    @patch("hours.now")
    async def test_llm_success_intent_ceiling(self, mock_now, mock_guard, mock_complete, mock_classify, mock_should_wait):
        """6. Успех и вето пройдено, но intent разрешает только DRAFT (ceiling)"""
        mock_now.return_value = self.now
        # intent says DRAFT
        mock_classify.return_value = Decision(route=Route.DRAFT, kind=Kind.PRICE, reason="прайс")
        mock_complete.return_value = MagicMock(text="Хороший ответ про цену", model="gemini")
        mock_guard.return_value = Verdict(ok=True)

        with patch("delay.plan_reply", return_value=MagicMock(send_at=self.now)):
            outcome = await handle(self.incoming, self.store)

            self.assertEqual(outcome.route, "draft")
            self.assertEqual(outcome.text, "Хороший ответ про цену")
            self.assertTrue("решает администратор" in outcome.reason)


if __name__ == "__main__":
    unittest.main()
