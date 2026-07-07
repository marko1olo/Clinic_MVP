import pytest
from gui.app import detect_gender_ru

@pytest.mark.parametrize("name, expected", [
    ("", "Не указан"),
    ("   ", "Не указан"),
])
def test_empty_and_whitespace(name, expected):
    assert detect_gender_ru(name) == expected

@pytest.mark.parametrize("name, expected", [
    # Male patronymic
    ("Иванович", "Мужской"), # ович
    ("Алексеевич", "Мужской"), # евич
    ("Ильич", "Мужской"), # ич
    # Female patronymic
    ("Ивановна", "Женский"), # овна
    ("Алексеевна", "Женский"), # евна
    ("Ильична", "Женский"), # ична
])
def test_patronymic_endings(name, expected):
    assert detect_gender_ru(name) == expected

@pytest.mark.parametrize("name, expected", [
    # Female surnames
    ("Иванова", "Женский"), # ова
    ("Смирнова", "Женский"), # ова
    ("Лебедева", "Женский"), # ева
    ("Ильина", "Женский"), # ина
    ("Крупская", "Женский"), # ая
    # Male surnames
    ("Иванов", "Мужской"), # ов
    ("Лебедев", "Мужской"), # ев
    ("Ильин", "Мужской"), # ин
    ("Достоевский", "Мужской"), # ий
    ("Черный", "Мужской"), # ый
])
def test_surname_endings(name, expected):
    assert detect_gender_ru(name) == expected

@pytest.mark.parametrize("name, expected", [
    # Known male names that might otherwise be classified as female due to endings
    ("Никита", "Мужской"),
    ("Илья", "Мужской"),
    ("Саша", "Мужской"),
    ("Женя", "Мужской"),
    # Known female names
    ("Маша", "Женский"),
    ("Люба", "Женский"),
])
def test_explicit_names(name, expected):
    assert detect_gender_ru(name) == expected

@pytest.mark.parametrize("name, expected", [
    # Ends in 'а', 'я' (not in explicitly known names list)
    ("Алиса", "Женский"), # а
    ("Мария", "Женский"), # я
    # Ends in consonants
    ("Адам", "Мужской"), # м
    ("Максим", "Мужской"), # м
    ("Джон", "Мужской"), # н
    # Unknown/Unmapped letters (e.g. 'ь', 'о', 'е', 'и', 'у', 'э', 'ю', 'ы')
    ("Микадо", "Не указан"), # о
    ("Игорь", "Не указан"), # ь
])
def test_last_letter_fallback(name, expected):
    assert detect_gender_ru(name) == expected

@pytest.mark.parametrize("name, expected", [
    ("Иванов Иван Иванович", "Мужской"),
    ("Иванова Анна Ивановна", "Женский"),
    # Mixed capitalization
    ("СМИРНОВА МАРИЯ", "Женский"),
    ("пЕТРОВ пЕТР", "Мужской"),
])
def test_full_names(name, expected):
    assert detect_gender_ru(name) == expected

@pytest.mark.parametrize("name, expected", [
    # Male surname + female name = 1.5 M, 1.5 F -> Не указан
    # Actually: 'Браун' ends in 'н' -> M +1.5. 'Алиса' ends in 'а' -> F +1.5. M=1.5, F=1.5 -> Tie.
    ("Браун Алиса", "Не указан"),
])
def test_ties(name, expected):
    assert detect_gender_ru(name) == expected
