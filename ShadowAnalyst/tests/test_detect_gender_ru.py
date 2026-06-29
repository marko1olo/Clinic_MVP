import unittest
from ShadowAnalyst.gui.app import detect_gender_ru

class TestDetectGenderRu(unittest.TestCase):
    def test_empty_input(self):
        """Test empty string and whitespace-only strings."""
        self.assertEqual(detect_gender_ru(""), "Не указан")
        self.assertEqual(detect_gender_ru("   "), "Не указан")
        self.assertEqual(detect_gender_ru("\n\t"), "Не указан")

    def test_male_patronymic(self):
        """Test male patronymics (points_m += 5)."""
        self.assertEqual(detect_gender_ru("Иванович"), "Мужской")
        self.assertEqual(detect_gender_ru("Андреевич"), "Мужской")
        self.assertEqual(detect_gender_ru("Ильич"), "Мужской")

    def test_female_patronymic(self):
        """Test female patronymics (points_f += 5)."""
        self.assertEqual(detect_gender_ru("Ивановна"), "Женский")
        self.assertEqual(detect_gender_ru("Андреевна"), "Женский")
        self.assertEqual(detect_gender_ru("Ильинична"), "Женский")

    def test_male_last_name(self):
        """Test male last names (points_m += 3)."""
        self.assertEqual(detect_gender_ru("Иванов"), "Мужской")
        self.assertEqual(detect_gender_ru("Андреев"), "Мужской")
        self.assertEqual(detect_gender_ru("Никитин"), "Мужской")
        self.assertEqual(detect_gender_ru("Достоевский"), "Мужской")
        self.assertEqual(detect_gender_ru("Смелый"), "Мужской")

    def test_female_last_name(self):
        """Test female last names (points_f += 3)."""
        self.assertEqual(detect_gender_ru("Иванова"), "Женский")
        self.assertEqual(detect_gender_ru("Андреева"), "Женский")
        self.assertEqual(detect_gender_ru("Никитина"), "Женский")
        self.assertEqual(detect_gender_ru("Достоевская"), "Женский")

    def test_known_male_name(self):
        """Test names from the known male list (points_m += 4)."""
        self.assertEqual(detect_gender_ru("Никита"), "Мужской")
        self.assertEqual(detect_gender_ru("Саша"), "Мужской")
        self.assertEqual(detect_gender_ru("Женя"), "Мужской") # this is in male list

    def test_known_female_name(self):
        """Test names from the known female list (points_f += 4)."""
        self.assertEqual(detect_gender_ru("Маша"), "Женский")
        self.assertEqual(detect_gender_ru("Оля"), "Женский")
        self.assertEqual(detect_gender_ru("Юля"), "Женский")

    def test_male_consonant_ending(self):
        """Test fallback to male for consonant endings (points_m += 1.5)."""
        self.assertEqual(detect_gender_ru("Олег"), "Мужской")
        self.assertEqual(detect_gender_ru("Максим"), "Мужской")
        self.assertEqual(detect_gender_ru("Денис"), "Мужской")

    def test_female_vowel_ending(self):
        """Test fallback to female for vowel endings (points_f += 1.5)."""
        self.assertEqual(detect_gender_ru("Анна"), "Женский")
        self.assertEqual(detect_gender_ru("Мария"), "Женский") # я ending is caught by 'я' check

    def test_full_male_name(self):
        """Test full name of a male."""
        self.assertEqual(detect_gender_ru("Иванов Иван Иванович"), "Мужской")
        # mixed case
        self.assertEqual(detect_gender_ru("СМИРНОВ петр алексеевич"), "Мужской")

    def test_full_female_name(self):
        """Test full name of a female."""
        self.assertEqual(detect_gender_ru("Иванова Мария Ивановна"), "Женский")
        self.assertEqual(detect_gender_ru("Смирнова Анна Алексеевна"), "Женский")

    def test_tie_condition(self):
        """Test conditions where points are equal."""
        # Саша (male list: +4), Маша (female list: +4) -> 4 == 4 -> "Не указан"
        self.assertEqual(detect_gender_ru("Саша Маша"), "Не указан")
        # Иванов (male last name: +3), Иванова (female last name: +3) -> 3 == 3 -> "Не указан"
        self.assertEqual(detect_gender_ru("Иванов Иванова"), "Не указан")

if __name__ == '__main__':
    unittest.main()
