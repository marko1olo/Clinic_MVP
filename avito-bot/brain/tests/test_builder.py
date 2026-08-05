import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta, date
import re
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from brain.prompt.builder import (
    build_system_prompt, build_user_prompt, Turn, _clean, _render_turn,
    FENCE, FENCE_END, MAX_TURN_CHARS, MAX_HISTORY_TURNS,
    _example_reply, _requested, _ending, _prices_block,
    _schedule_block, _contacts_block, _ortho_logistics_block,
    allowed_topics, known_topics
)
from brain.gate import hours

class Checks:
    def __init__(self):
        self.total = 0
        self.failures = []

    def section(self, name: str):
        print(f"\n[{name}]")

    def ok(self, desc: str, condition: bool, reason=""):
        self.total += 1
        prefix = "  + " if condition else "  - "
        print(f"{prefix}{desc}{' (' + reason + ')' if not condition and reason else ''}")
        if not condition:
            self.failures.append(desc)

    def eq(self, desc: str, actual, expected):
        self.ok(desc, actual == expected, f"получено {actual!r}, ожидалось {expected!r}")

    def raises(self, desc: str, exc_type, func, *args, **kwargs):
        self.total += 1
        try:
            func(*args, **kwargs)
        except exc_type:
            print(f"  + {desc}")
        except Exception as e:
            self.failures.append(desc)
            print(f"  - {desc} (упало с {type(e).__name__} вместо {exc_type.__name__})")
        else:
            self.failures.append(desc)
            print(f"  - {desc} (не упало)")

def check_build_system_prompt(c: Checks):
    c.section("build_system_prompt")
    moment = datetime.now(timezone(timedelta(hours=3)))
    prompt = build_system_prompt(topics=["consultation", "caries"], moment=moment)
    c.ok("system prompt builds without error", isinstance(prompt, str) and len(prompt) > 0)
    c.ok("system prompt contains brand", "Ты — администратор клиники" in prompt)

    # Check default moment behavior by monkey-patching or passing None
    prompt_no_moment = build_system_prompt(topics=["consultation"])
    c.ok("builds correctly when moment is None", isinstance(prompt_no_moment, str))

    # Test without timezone
    c.raises("moment without timezone raises ValueError", ValueError, build_system_prompt, topics=[], moment=datetime.now())

def check_build_user_prompt(c: Checks):
    c.section("build_user_prompt")
    moment = datetime.now(timezone(timedelta(hours=3)))
    history = [
        Turn(role="patient", text="Здравствуйте, сколько стоит?", at=moment - timedelta(minutes=5)),
        Turn(role="clinic", text="Добрый день! Осмотр бесплатный.", at=moment - timedelta(minutes=4)),
    ]
    prompt = build_user_prompt(history, "А лечить больно?")
    c.ok("user prompt builds correctly", isinstance(prompt, str) and len(prompt) > 0)
    c.ok("contains history text", "ИСТОРИЯ ДИАЛОГА" in prompt)
    c.ok("contains current message", "А лечить больно?" in prompt)

    # Empty history
    prompt_no_history = build_user_prompt([], "Привет")
    c.ok("empty history is handled", "Это первое сообщение в диалоге" in prompt_no_history)
    c.ok("contains current message for empty history", "Привет" in prompt_no_history)

    # Test error cases
    c.raises("single turn raises TypeError", TypeError, build_user_prompt, history[0], "incoming")
    c.raises("moment without tz raises ValueError", ValueError, build_user_prompt, [Turn(role="patient", text="1", at=datetime.now())], "test")
    c.raises("unknown role raises ValueError", ValueError, build_user_prompt, [Turn(role="unknown", text="1", at=moment)], "test")

def check_clean(c: Checks):
    c.section("_clean")
    c.eq("strips control characters", _clean("a\x00b\x1fc"), "a b c")
    c.eq("replaces carriage returns", _clean("a\r\nb\rc"), "a\nb\nc")
    c.eq("collapses newlines", _clean("a\n\n\n\nb"), "a\n\nb")
    c.eq("replaces FENCE tags", _clean(f"a {FENCE} b {FENCE_END} c"), "a « b » c")
    c.eq("truncates over MAX_TURN_CHARS", _clean("a" * (MAX_TURN_CHARS + 10)), "a" * MAX_TURN_CHARS + "…")
    c.eq("empty message handles well", _clean(""), "")
    c.eq("newlines are stripped", _clean("\n\n\n"), "")

def check_render_turn(c: Checks):
    c.section("_render_turn")
    moment = datetime.now(timezone(timedelta(hours=3)))
    t1 = Turn(role="patient", text="hello", at=moment)
    c.ok("renders patient", "Пациент: hello" in _render_turn(t1))

    t2 = Turn(role="clinic", text="hi", at=moment)
    c.ok("renders clinic", "Администратор: hi" in _render_turn(t2))

    t3 = Turn(role="patient", text="", at=moment)
    c.ok("empty text renders special message", "(сообщение без текста)" in _render_turn(t3))

def check_example_reply(c: Checks):
    c.section("_example_reply")
    reply_unknown = _example_reply(["unknown_topic"])
    c.ok("fallback if unknown topic", "Первичная консультация" in reply_unknown or "Точную сумму" in reply_unknown)
    c.ok("appends EXAMPLE_TAIL if needed", reply_unknown.rstrip().endswith("?"))

    reply_known = _example_reply(["caries"])
    c.ok("known topic uses say field", len(reply_known) > 0 and reply_known != reply_unknown)

def check_requested(c: Checks):
    c.section("_requested")
    topics = _requested(["caries", "unknown_topic"])
    c.ok("filters out unknown topics", "unknown_topic" not in topics)
    c.ok("keeps known topics", "caries" in topics)

def check_ending(c: Checks):
    c.section("_ending")
    ending = _ending("+79991234567")
    c.ok("ending contains phone number", "+79991234567" in ending)

def check_prices_block(c: Checks):
    c.section("_prices_block")
    block = _prices_block(["caries", "hygiene"])
    c.ok("prices block is not empty", len(block) > 0)
    c.ok("contains caries topic", "caries" in block or "кариес" in block.lower() or "лечение" in block.lower())

def check_schedule_block(c: Checks):
    c.section("_schedule_block")
    moment = datetime.now(timezone(timedelta(hours=3)))
    block = _schedule_block(moment)
    c.ok("schedule block has header", "ГРАФИК:" in block)

def check_contacts_block(c: Checks):
    c.section("_contacts_block")
    block = _contacts_block()
    c.ok("contacts block has phone", "КОНТАКТЫ" in block)

def check_ortho_logistics_block(c: Checks):
    c.section("_ortho_logistics_block")
    today = date(2023, 1, 1) # Use past date to test fallback or specific logic if needed
    block = _ortho_logistics_block(["orthodontics"], today)
    c.ok("ortho block generated for orthodontics", len(block) > 0)

    block_empty = _ortho_logistics_block(["caries"], today)
    c.eq("ortho block empty for caries", block_empty, "")

def check_topics(c: Checks):
    c.section("topics")
    c.ok("allowed_topics is not empty", len(allowed_topics()) > 0)
    c.ok("known_topics is not empty", len(known_topics()) > 0)
    c.ok("allowed subset of known", allowed_topics().issubset(known_topics()))

def run():
    c = Checks()
    check_build_system_prompt(c)
    check_build_user_prompt(c)
    check_clean(c)
    check_render_turn(c)
    check_example_reply(c)
    check_requested(c)
    check_ending(c)
    check_prices_block(c)
    check_schedule_block(c)
    check_contacts_block(c)
    check_ortho_logistics_block(c)
    check_topics(c)
    print(f"\nИТОГ: {c.total - len(c.failures)}/{c.total}")
    for f in c.failures:
        print(f"  {f}")
    return 1 if c.failures else 0

if __name__ == '__main__':
    raise SystemExit(run())
