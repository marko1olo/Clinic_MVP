# -*- coding: utf-8 -*-
"""Тесты роутера. Запуск: pytest avito-bot/brain/tests/test_router.py"""
from __future__ import annotations

import sys
from pathlib import Path
import pytest

_BRAIN = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_BRAIN))
sys.path.insert(0, str(_BRAIN / "gate"))

import router
from intent import Route

@pytest.mark.parametrize("model_route, intent_route, expected", [
    (Route.AUTO, Route.AUTO, Route.AUTO),
    (Route.AUTO, Route.DRAFT, Route.DRAFT),
    (Route.AUTO, Route.IGNORE, Route.IGNORE),
    (Route.DRAFT, Route.AUTO, Route.DRAFT),
    (Route.DRAFT, Route.DRAFT, Route.DRAFT),
    (Route.DRAFT, Route.IGNORE, Route.IGNORE),
    (Route.IGNORE, Route.AUTO, Route.IGNORE),
    (Route.IGNORE, Route.DRAFT, Route.IGNORE),
    (Route.IGNORE, Route.IGNORE, Route.IGNORE),
])
def test_ceiling(model_route, intent_route, expected):
    """Маршрут не может быть свободнее того, что разрешил intent."""
    assert router._ceiling(model_route, intent_route) == expected
