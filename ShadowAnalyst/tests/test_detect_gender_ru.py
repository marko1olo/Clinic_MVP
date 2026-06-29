import unittest

from gui.app import detect_gender_ru

class TestDetectGenderRu(unittest.TestCase):
    def test_empty_and_whitespace(self):
        self.assertEqual(detect_gender_ru(""), "Не указан")
        self.assertEqual(detect_gender_ru("   "), "Не указан")

    def test_patronymic_endings(self):
        # Male patronymic
        self.assertEqual(detect_gender_ru("Иванович"), "Мужской") # ович
        self.assertEqual(detect_gender_ru("Алексеевич"), "Мужской") # евич
        self.assertEqual(detect_gender_ru("Ильич"), "Мужской") # ич

        # Female patronymic
        self.assertEqual(detect_gender_ru("Ивановна"), "Женский") # овна
        self.assertEqual(detect_gender_ru("Алексеевна"), "Женский") # евна
        self.assertEqual(detect_gender_ru("Ильична"), "Женский") # ична

    def test_surname_endings(self):
        # Female surnames
        self.assertEqual(detect_gender_ru("Иванова"), "Женский") # ова
        self.assertEqual(detect_gender_ru("Смирнова"), "Женский") # ова
        self.assertEqual(detect_gender_ru("Лебедева"), "Женский") # ева
        self.assertEqual(detect_gender_ru("Ильина"), "Женский") # ина
        self.assertEqual(detect_gender_ru("Крупская"), "Женский") # ая

        # Male surnames
        self.assertEqual(detect_gender_ru("Иванов"), "Мужской") # ов
        self.assertEqual(detect_gender_ru("Лебедев"), "Мужской") # ев
        self.assertEqual(detect_gender_ru("Ильин"), "Мужской") # ин
        self.assertEqual(detect_gender_ru("Достоевский"), "Мужской") # ий
        self.assertEqual(detect_gender_ru("Черный"), "Мужской") # ый

    def test_explicit_names(self):
        # Known male names that might otherwise be classified as female due to endings
        self.assertEqual(detect_gender_ru("Никита"), "Мужской")
        self.assertEqual(detect_gender_ru("Илья"), "Мужской")
        self.assertEqual(detect_gender_ru("Саша"), "Мужской")
        self.assertEqual(detect_gender_ru("Женя"), "Мужской")

        # Known female names
        self.assertEqual(detect_gender_ru("Маша"), "Женский")
        self.assertEqual(detect_gender_ru("Люба"), "Женский")

    def test_last_letter_fallback(self):
        # Ends in 'а', 'я' (not in explicitly known names list)
        self.assertEqual(detect_gender_ru("Алиса"), "Женский") # а
        self.assertEqual(detect_gender_ru("Мария"), "Женский") # я

        # Ends in consonants
        self.assertEqual(detect_gender_ru("Адам"), "Мужской") # м
        self.assertEqual(detect_gender_ru("Максим"), "Мужской") # м
        self.assertEqual(detect_gender_ru("Джон"), "Мужской") # н

        # Unknown/Unmapped letters (e.g. 'ь', 'о', 'е', 'и', 'у', 'э', 'ю', 'ы')
        self.assertEqual(detect_gender_ru("Микадо"), "Не указан") # о
        self.assertEqual(detect_gender_ru("Игорь"), "Не указан") # ь

    def test_full_names(self):
        self.assertEqual(detect_gender_ru("Иванов Иван Иванович"), "Мужской")
        self.assertEqual(detect_gender_ru("Иванова Анна Ивановна"), "Женский")
        # Mixed capitalization
        self.assertEqual(detect_gender_ru("СМИРНОВА МАРИЯ"), "Женский")
        self.assertEqual(detect_gender_ru("пЕТРОВ пЕТР"), "Мужской")

    def test_ties(self):
        # Male surname + female name = 1.5 M, 1.5 F -> Не указан
        # Actually: 'Браун' ends in 'н' -> M +1.5. 'Алиса' ends in 'а' -> F +1.5. M=1.5, F=1.5 -> Tie.
        self.assertEqual(detect_gender_ru("Браун Алиса"), "Не указан")

if __name__ == '__main__':
    unittest.main()
