# 🦷 Avito Dental AI Assistant (Авито ИИ-Автоответчик)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![Node: 20+](https://img.shields.io/badge/Node-20%2B-green.svg)](https://nodejs.org/)
[![Tests: 425 Passed](https://img.shields.io/badge/Tests-425%2F425%20Passed-brightgreen.svg)](brain/tests/)

Автономная гибридная ИИ-система автоответов для мессенджера **Авито** медицинских и стоматологических клиник.

Сочетает понимание естественно-языковых диалогов на базе каскада LLM-моделей (Gemini / Llama 3) с **строгим детерминированным вето-контролем** цен, квалифицированным отбором симптомов и панелью одобрения администратора в **Telegram**.

---

## ⭐️ Основные возможности

1. **Гибридный режим ответа (Hybrid Auto/Draft)**:
   - **Безопасные факты (Auto)**: Адрес, парковка, часы работы, бесплатная первичная консультация отправляются пациенту автоматически с имитацией естественной паузы набора текста.
   - **Медицинские вопросы и цены (Draft)**: Вопросы про симптомы, кариес, ортодонтию и сложные визиты формируют интерактивный **черновик в Telegram-канал клиники**.

2. **Защита от галлюцинаций цен (Zero-Hallucination Veto)**:
   - Все предложенные нейросетью формулировки проходят через детерминированное вето (`brain/guard.py`).
   - Если модель называет цифру, отсутствующую в утверждённом прайс-листе `data/patient-quotes.json` (`quote_allowed: true`), авто-отправка мгновенно роняется в черновик администратору.

3. **Соответствие 152-ФЗ и приватность**:
   - Номера телефонов пациентов хэшируются (`phone_hash`).
   - Логи и аудиторские следы автоматически очищаются от персональных данных через скраббер `brain/pii.py`.
   - Внутренние телефоны клиники внесены в белый список и не затираются.

4. **Интерактивная Telegram-панель администратора**:
   - Кнопки: `[Отправить]`, `[Правка]`, `[Игнор]`, `[Перехватить диалог]`, `[Пауза ИИ]`.
   - Ответ администратора на сообщение с черновиком подменяет текст ИИ и отправляет его пациенту.

5. **Надёжная архитектура транспортов (Node + SQLite WAL)**:
   - Изолированный опросчик Авито на Node.js (`Playwright` + персистентный профиль Chromium) работает с той же SQLite базы данных, что и Python-ядро.
   - Поддержка встроенного `node:sqlite` (Node 22.5+/24) и `better-sqlite3`.

---

## 📐 Архитектура системы

```text
               ┌──────────────────────────────┐
               │    Авито Мессенджер (DOM)    │
               └──────────────┬───────────────┘
                              │  (Poll / Send)
                              ▼
               ┌──────────────────────────────┐
               │  capture/ (Node.js + Playwright) │
               └──────────────┬───────────────┘
                              │  (SQLite WAL: inbox / outbox)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       brain/ (Python)                       │
│                                                             │
│ 1. store.mark_seen  ──▶  2. intent.classify                 │
│                                 │                           │
│ 4. guard.check      ◀──  3. llm.complete (Cascade)          │
│    (Вето цен)               (Gemini / Llama 3)              │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       [AUTO: Безопасный факт]        [DRAFT: Цена / Симптом]
               │                              │
               ▼                              ▼
      Outbox ──▶ Send           Telegram Panel (Администратор)
                                    │  (Одобрение / Правка)
                                    ▼
                                  Outbox ──▶ Send
```

---

## 🛠️ Законы проекта

1. **Ни одна цена не произносится, если её нет в `data/patient-quotes.json` с `quote_allowed: true`.**
2. **Бот не ставит диагноз и не даёт врачебных обещаний.**
3. **Любое сомнение или неизвестная тема уходит человеку, а не пациенту.**
4. **Мгновенных ответов не бывает.** Ответ идет с задержкой 40–90 с (имитация человека).
5. **Вся конфигурация и факты клиники вынесены в `data/clinic-facts.json`.**

---

## 🚀 Быстрый старт

### 1. Требования
- Python 3.11+
- Node.js 20+

### 2. Установка зависимостей

```bash
# Клонирование репозитория
git clone https://github.com/your-org/avito-dental-ai-bot.git
cd avito-dental-ai-bot

# Установка зависимостей транспорта (Node.js)
cd capture
npm install --omit=optional
cd ..

# Установка зависимостей ядра (Python)
pip install dotenv httpx
```

### 3. Настройка окружения (`.env`)

Скопируйте образец `.env.example` в `.env`:

```bash
cp .env.example .env
```

Заполните переменные в `.env`:

```env
# Ключи API LLM-провайдеров (через запятую)
GOOGLE_API_KEYS=your_gemini_api_key_1,your_gemini_api_key_2
GROQ_API_KEYS=your_groq_api_key_1

# Telegram-бот и чат администраторов
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyZ
TELEGRAM_CHAT_ID=-100123456789

# Профиль браузера Авито
AVITO_PROFILE=C:\bots\avito-reply\.profile
AVITO_BOT_DB=C:\bots\avito-reply\state.db
AVITO_BOT_STATE_DIR=C:\bots\avito-reply\state

# Режим работы
AVITO_BOT_MODE=hybrid
```

---

## 🧪 Запуск unit-тестов (425 тестов)

Проект поставляется со 100% покрытием тестами без внешних сетевых зависимостей:

```bash
python -X utf8 brain/tests/test_gate.py       # Классификатор и часы работы
python -X utf8 brain/tests/test_guard.py      # Детерминированное вето цен
python -X utf8 brain/tests/test_facts.py      # Логистика и факты клиники
python -X utf8 brain/tests/test_followup.py   # Дожимы диалогов
python -X utf8 brain/tests/test_store.py      # SQLite WAL и 152-ФЗ
python -X utf8 brain/tests/test_client.py     # Каскад ротации LLM-ключей
python -X utf8 brain/tests/test_panel.py      # Telegram-панель администратора
```

---

## 📂 Структура проекта

```
.
├── brain/                   # Python-ядро логики и принятия решений
│   ├── gate/                # Часы работы (hours.py) и классификатор (intent.py)
│   ├── llm/                 # Каскадирование, ротация ключей (client.py, cascade.py)
│   ├── prompt/              # Динамическая сборка системных промптов (builder.py)
│   ├── store/               # База данных SQLite (db.py, schema.sql)
│   ├── tg/                  # Интерактивная Telegram-панель (api.py, panel.py)
│   ├── guard.py             # Детерминированное вето цен и диагнозов
│   ├── pii.py               # 152-ФЗ скраббер персональных данных
│   └── run.py               # Основной демон управления решениями
├── capture/                 # Node.js транспорт (Playwright DOM-опрос и отправка)
│   └── src/
│       ├── discover.mjs     # Разведчик вёрстки страниц Авито
│       ├── login.mjs        # Разовый интерактивный вход в аккаунт
│       ├── poll.mjs         # Сборщик входящих сообщений
│       ├── send.mjs         # Отправка одобренных ответов
│       └── run-poll.mjs     # Демон транспорта Авито
├── data/                    # Единственный источник правды по ценам и фактам
│   ├── clinic-facts.json    # Часы, адрес, контакты, правила
│   ├── patient-quotes.json  # Разрешённые котировки визитов
│   └── ortho-prices.json    # Внутренние прайсы (не публичные)
└── docs/                    # Техническая документация и контракты
    ├── CONTRACTS.md         # Спецификации интерфейсов модулей
    ├── dialogue-playbook.md # Плейбук построения диалогов
    └── sales-strategy.md   # Стратегия конверсии лидов
```

---

## 🏷️ GitHub Topics / Tags

`avito-bot` `ai-assistant` `dental-crm` `playwright` `llm-cascade` `gemini-api` `groq-api` `telegram-bot` `sqlite-wal` `python3` `nodejs` `zero-hallucination` `medical-ai`

---

## 📄 Лицензия

Распространяется под лицензией [MIT](LICENSE.md).
