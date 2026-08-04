import unittest
from datetime import datetime, date, timedelta
import random
from unittest.mock import patch, MagicMock

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import delay

class TestDelay(unittest.TestCase):
    def setUp(self):
        self.rng = random.Random(42)

    def test_should_wait_for_more(self):
        self.assertTrue(delay.should_wait_for_more(5.0))
        self.assertFalse(delay.should_wait_for_more(16.0))

    @patch("delay.hours.is_booking_open", return_value=True)
    def test_first_reply_working_hours(self, mock_is_open):
        received = datetime(2026, 8, 5, 12, 0, 0)
        plan = delay.plan_reply("Привет", is_first_reply=True, received_at=received, rng=self.rng)

        self.assertGreaterEqual(plan.delay_seconds, delay.FIRST_REPLY_RANGE[0])
        self.assertLessEqual(plan.delay_seconds, delay.FIRST_REPLY_RANGE[1])
        self.assertEqual(plan.send_at, received + timedelta(seconds=plan.delay_seconds))
        self.assertIn("первый ответ", plan.reason)
        self.assertFalse(plan.deferred_to_opening)

    @patch("delay.hours.is_booking_open", return_value=True)
    def test_followup_working_hours(self, mock_is_open):
        received = datetime(2026, 8, 5, 12, 0, 0)
        text = "Очень длинный текст " * 10
        plan = delay.plan_reply(text, is_first_reply=False, received_at=received, rng=self.rng)

        typing_time = delay._typing_seconds(text)
        min_expected = delay.FOLLOWUP_RANGE[0] + typing_time
        max_expected = delay.FOLLOWUP_RANGE[1] + typing_time

        self.assertGreaterEqual(plan.delay_seconds, min_expected)
        self.assertLessEqual(plan.delay_seconds, max_expected)
        self.assertIn("ответ в диалоге", plan.reason)

    @patch("delay.hours.is_booking_open", return_value=False)
    @patch("delay.hours.next_booking_day")
    def test_outside_working_hours(self, mock_next_day, mock_is_open):
        mock_next_day.return_value = MagicMock(
            day=date(2026, 8, 6),
            opens=datetime(2026, 8, 6, 9, 0, 0).time()
        )

        received = datetime(2026, 8, 5, 23, 0, 0)
        plan = delay.plan_reply("Привет", is_first_reply=True, received_at=received, rng=self.rng)

        self.assertTrue(plan.deferred_to_opening)

        opening_datetime = datetime(2026, 8, 6, 9, 0, 0, tzinfo=received.tzinfo)

        min_send = opening_datetime + timedelta(seconds=delay.AFTER_HOURS_OFFSET_RANGE[0])
        max_send = opening_datetime + timedelta(seconds=delay.AFTER_HOURS_OFFSET_RANGE[1])

        self.assertGreaterEqual(plan.send_at, min_send)
        self.assertLessEqual(plan.send_at, max_send)
        self.assertIn("отложено до открытия", plan.reason)

    @patch("delay.hours.is_booking_open", return_value=False)
    @patch("delay.hours.next_booking_day", return_value=None)
    def test_outside_working_hours_no_schedule(self, mock_next_day, mock_is_open):
        received = datetime(2026, 8, 5, 23, 0, 0)
        plan = delay.plan_reply("Привет", is_first_reply=True, received_at=received, rng=self.rng)

        self.assertIn("график не подтверждён", plan.reason)

if __name__ == "__main__":
    unittest.main()
