import sys

content = open("avito-bot/brain/store/db.py").read()

search = """
    def chat_histories(self, targets: list[tuple[str, int]],
                       limit: int = 40) -> dict[tuple[str, int], list[InboxRow]]:
        \"\"\"Массовая загрузка истории диалогов для батча сообщений.

        Используется для предотвращения N+1 запросов при разборе входящих.
        targets — список пар (chat_id, before_position).
        Возвращает словарь, где ключ — пара (chat_id, before_position),
        а значение — список строк истории.
        \"\"\"
        if not targets:
            return {}

        queries = []
        params = []
        for chat_id, before_pos in targets:
            queries.append(
                "SELECT * FROM (SELECT ? AS _req_chat, ? AS _req_pos, *, rowid AS _rid "
                "FROM inbox WHERE chat_id = ? AND position < ? "
                "ORDER BY position DESC, _rid DESC LIMIT ?) "
            )
            params.extend((chat_id, before_pos, chat_id, before_pos, limit))
"""

replace = """
    def chat_histories(self, targets: list[tuple[str, int]],
                       limit: int = 40) -> dict[tuple[str, int], list[InboxRow]]:
        \"\"\"Массовая загрузка истории диалогов для батча сообщений.

        Используется для предотвращения N+1 запросов при разборе входящих.
        targets — список пар (chat_id, before_position).
        Возвращает словарь, где ключ — пара (chat_id, before_position),
        а значение — список строк истории.
        \"\"\"
        if not targets:
            return {}

        queries = []
        params = []
        for chat_id, before_pos in targets:
            queries.append(
                "SELECT * FROM (SELECT ? AS _req_chat, ? AS _req_pos, *, "
                "rowid AS _rid FROM inbox WHERE chat_id = ? AND position < ? "
                "ORDER BY position DESC, _rid DESC LIMIT ?) "
            )
            params.extend((chat_id, before_pos, chat_id, before_pos, limit))
"""

if search in content:
    content = content.replace(search, replace)
    with open("avito-bot/brain/store/db.py", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
