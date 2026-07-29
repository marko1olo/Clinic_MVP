-- Схема состояния бота. Применяется целиком при каждом открытии базы
-- (CREATE ... IF NOT EXISTS), поэтому файл обязан быть идемпотентным: ни одного
-- DROP, ни одного INSERT с данными, ни одной операции, которая при повторном
-- прогоне что-то теряет.
--
-- PRAGMA journal_mode и PRAGMA foreign_keys здесь НЕТ намеренно. foreign_keys —
-- настройка соединения, а не файла: применённая один раз при создании схемы, она
-- молча выключится у каждого следующего соединения, и внешние ключи перестанут
-- проверяться, о чём никто не узнает. Обе PRAGMA выставляет db.py на каждом
-- открытии.

-- --------------------------------------------------------------------------
-- Диалоги. Одна строка на чат Авито.
-- --------------------------------------------------------------------------
-- Номера телефонов пациентов в этой таблице нет и не будет — только phone_hash.
-- Номер остаётся в переписке Авито, второй копии он не требует, а база без
-- персональных данных радикально проще по 152-ФЗ: нет ПД — нет обязанностей по
-- их защите, уведомлений в РКН и рисков при утечке файла базы.
-- CHECK ниже — не украшение: он физически не даст записать в эту колонку
-- «+79271234567» или «8 927 712 99 26» (плюс, пробелы и цифры 8/9 вне 0-9a-f
-- отсекаются GLOB, а 10-11 цифр не проходят по длине). Требование выражено
-- схемой, а не дисциплиной вызывающего кода.
CREATE TABLE IF NOT EXISTS dialogs (
    chat_id                  TEXT    PRIMARY KEY NOT NULL,
    first_seen_at            TEXT    NOT NULL,
    patient_last_message_at  TEXT,
    our_last_message_at      TEXT,
    patient_messages         INTEGER NOT NULL DEFAULT 0,
    our_messages             INTEGER NOT NULL DEFAULT 0,
    followups_sent           INTEGER NOT NULL DEFAULT 0,
    last_followup_at         TEXT,
    -- NULL = не перехвачен / не на паузе. Дата в будущем = до этого момента.
    -- Бессрочно = дата-страж 9999-12-31 (db.py: FOREVER), чтобы «совсем» и
    -- «не выставлено» были разными состояниями, а не одним NULL.
    takeover_until           TEXT,
    ai_paused_until          TEXT,
    phone_hash               TEXT,
    CHECK (phone_hash IS NULL
           OR (length(phone_hash) BETWEEN 16 AND 64
               AND phone_hash NOT GLOB '*[^0-9a-f]*')),
    CHECK (patient_messages >= 0 AND our_messages >= 0 AND followups_sent >= 0)
);
-- Индекс по chat_id не создаётся отдельно: PRIMARY KEY на TEXT — это готовый
-- sqlite_autoindex, и все обращения к диалогу идут ровно по нему.

-- --------------------------------------------------------------------------
-- Дедупликация входящих. Единственное, что стоит между пациентом и повторной
-- отправкой того же ответа.
-- --------------------------------------------------------------------------
-- external_id — id сообщения на стороне Авито. PRIMARY KEY здесь несёт всю
-- нагрузку идемпотентности: проверка «SELECT, потом INSERT» на уровне кода
-- ломается, когда поллер перезапустился и на секунду работает в двух копиях —
-- между SELECT и INSERT успевает вклиниться второй процесс, и оба решают, что
-- сообщение новое. UNIQUE в схеме не ломается никогда: второй INSERT проиграет
-- внутри одной атомарной операции SQLite.
CREATE TABLE IF NOT EXISTS seen (
    external_id TEXT NOT NULL PRIMARY KEY,
    chat_id     TEXT NOT NULL REFERENCES dialogs(chat_id) ON DELETE CASCADE,
    at          TEXT NOT NULL,   -- время сообщения по данным Авито
    recorded_at TEXT NOT NULL    -- когда его увидели мы; расхождение = лаг поллера
);
-- Индекса по seen.chat_id нет намеренно. Это самая горячая на запись таблица
-- (строка на каждое опрошенное сообщение), а запросов «все сообщения чата» в
-- API нет: история диалога живёт в Авито. ON DELETE CASCADE отработает сканом,
-- но диалоги не удаляются.

-- --------------------------------------------------------------------------
-- Черновики администратору.
-- --------------------------------------------------------------------------
-- status пуст только в одном значении — 'pending'; остальные четыре совпадают с
-- action в resolve_draft. Пара CHECK ниже держит инвариант «решённый черновик
-- имеет время решения» и «правка не может быть пустой»: если правка потеряет
-- текст, отправлять будет нечего, и это должно упасть здесь, а не в send.mjs.
CREATE TABLE IF NOT EXISTS drafts (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id       TEXT    NOT NULL REFERENCES dialogs(chat_id) ON DELETE CASCADE,
    text          TEXT    NOT NULL,
    kind          TEXT    NOT NULL,
    reason        TEXT    NOT NULL,
    status        TEXT    NOT NULL DEFAULT 'pending',
    created_at    TEXT    NOT NULL,
    resolved_at   TEXT,
    resolved_by   TEXT,
    final_text    TEXT,
    tg_message_id INTEGER,
    CHECK (status IN ('pending', 'sent', 'edited', 'ignored', 'expired')),
    CHECK (length(text) > 0),
    CHECK ((status = 'pending') = (resolved_at IS NULL)),
    CHECK (status <> 'edited' OR (final_text IS NOT NULL AND length(final_text) > 0))
);
-- Частичный индекс ровно под pending_drafts(): в нём лежат только неразобранные
-- черновики, а их единицы, тогда как разобранных со временем будут тысячи.
CREATE INDEX IF NOT EXISTS drafts_pending
    ON drafts(created_at) WHERE status = 'pending';
-- UNIQUE, а не просто индекс: одно сообщение в Telegram соответствует одному
-- черновику. Иначе «Правка» ответом на сообщение бота могла бы отредактировать
-- чужой ответ пациенту. NULL в SQLite не конфликтуют между собой, поэтому
-- непривязанных черновиков может быть сколько угодно.
CREATE UNIQUE INDEX IF NOT EXISTS drafts_by_tg_message
    ON drafts(tg_message_id);
-- Под «есть ли у этого чата неотвеченный черновик» и под каскад по внешнему ключу.
CREATE INDEX IF NOT EXISTS drafts_by_chat
    ON drafts(chat_id, created_at);

-- --------------------------------------------------------------------------
-- Аудит решений.
-- --------------------------------------------------------------------------
-- Внешнего ключа на dialogs здесь нет сознательно: аудит обязан принимать
-- событие раньше, чем появился диалог (отброшенный спам, ошибка ключа LLM,
-- запуск процесса), и вообще без chat_id. Аудит, который отказался записать
-- событие из-за ссылочной целостности, бесполезен именно в тот момент, когда
-- нужен больше всего.
-- payload — JSON. Вызывающий обязан прогнать текст пациента через pii.scrub()
-- ДО передачи: store не является фильтром ПД и не пытается им быть.
CREATE TABLE IF NOT EXISTS audit (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    at      TEXT    NOT NULL,
    event   TEXT    NOT NULL,
    chat_id TEXT,
    payload TEXT,
    CHECK (length(event) > 0),
    CHECK (payload IS NULL OR json_valid(payload))
);
-- Индекса по audit нет: единственное чтение — recent_audit(), это ORDER BY id
-- DESC по самому rowid. Появится экран «аудит одного чата» — тогда и добавить
-- audit(chat_id, id), не раньше.

PRAGMA user_version = 1;
