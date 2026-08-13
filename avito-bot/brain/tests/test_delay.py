# -*- coding: utf-8 -*-
"""Тесты задержки ответов."""
from __future__ import annotations

import random
import unittest
from datetime import datetime, date, time
from unittest.mock import patch, MagicMock

# Using brain.delay requires PYTHONPATH=avito-bot
from brain import delay
from brain.gate.hours import DayStatus


class TestDelay(unittest.TestCase):
    def setUp(self):
        self.rng = random.Random(42)

    def test_typing_seconds(self):
        t_sec = delay._typing_seconds("1234567890123456789012345")
        self.assertAlmostEqual(t_sec, 6.0, places=1)
        self.assertEqual(delay._typing_seconds(""), 0.0)

    def test_jitter(self):
        j1 = delay._jitter(self.rng, 10.0, 20.0, None)
        self.assertTrue(10.0 <= j1 <= 20.0)

        j2 = delay._jitter(self.rng, 10.0, 20.0, 15.0)
        self.assertTrue(10.0 <= j2 <= 20.0)
        self.assertTrue(abs(j2 - 15.0) >= delay.MIN_DELTA_FROM_LAST)

    def test_should_wait_for_more(self):
        self.assertTrue(delay.should_wait_for_more(14.9))
        self.assertFalse(delay.should_wait_for_more(15.0))

    @patch('brain.delay.hours.is_booking_open')
    def test_plan_reply_first_working_hours(self, mock_is_open):
        mock_is_open.return_value = True
        now = datetime(2026, 8, 5, 12, 0, 0)

        plan = delay.plan_reply("Привет", is_first_reply=True, received_at=now, rng=self.rng)

        mock_is_open.assert_called_once()
        self.assertTrue(delay.FIRST_REPLY_RANGE[0] <= plan.delay_seconds <= delay.FIRST_REPLY_RANGE[1])
        self.assertIn("первый ответ", plan.reason)
        self.assertFalse(plan.deferred_to_opening)

    @patch('brain.delay.hours.is_booking_open')
    def test_plan_reply_followup_working_hours(self, mock_is_open):
        mock_is_open.return_value = True
        now = datetime(2026, 8, 5, 12, 0, 0)

        plan = delay.plan_reply("Длинный ответ " * 10, is_first_reply=False, received_at=now, rng=self.rng)
        self.assertTrue(plan.delay_seconds > delay.FOLLOWUP_RANGE[0])
        self.assertIn("ответ в диалоге", plan.reason)
        self.assertFalse(plan.deferred_to_opening)

    @patch('brain.delay.hours.is_booking_open')
    @patch('brain.delay.hours.next_booking_day')
    def test_plan_reply_after_hours_confirmed(self, mock_next_day, mock_is_open):
        mock_is_open.return_value = False
        mock_nxt = DayStatus(day=date(2026, 8, 6), open_for_booking=True, opens=time(9, 0), last_appointment=time(18, 0), certain=True, reason="ok")
        mock_next_day.return_value = mock_nxt

        now = datetime(2026, 8, 5, 20, 0, 0)
        plan = delay.plan_reply("Ок", is_first_reply=True, received_at=now, rng=self.rng)

        self.assertTrue(plan.deferred_to_opening)
        self.assertIn("06.08", plan.reason)

    @patch('brain.delay.hours.is_booking_open')
    @patch('brain.delay.hours.next_booking_day')
    def test_plan_reply_after_hours_unconfirmed(self, mock_next_day, mock_is_open):
        mock_is_open.return_value = False
        mock_next_day.return_value = None

        now = datetime(2026, 8, 5, 20, 0, 0)
        plan = delay.plan_reply("Ок", is_first_reply=True, received_at=now, rng=self.rng)

        self.assertFalse(plan.deferred_to_opening)
        self.assertIn("график не подтверждён", plan.reason)


if __name__ == '__main__':
    unittest.main()
