import unittest
import sys
sys.path.insert(0, "ShadowAnalyst")
from gui.app import parse_patient_from_filename

class TestParsePatientFromFilename(unittest.TestCase):
    def test_basic_male(self):
        # Male standard names
        res = parse_patient_from_filename("Иванов Иван 30 M.png")
        self.assertEqual(res["patient_name"], "Иван Иванов")
        self.assertEqual(res["patient_age"], 30)
        self.assertEqual(res["patient_gender"], "Мужской")

    def test_basic_female(self):
        # Female standard names
        res = parse_patient_from_filename("Иванова Анна 25 F.jpg")
        self.assertEqual(res["patient_name"], "Анна Иванова")
        self.assertEqual(res["patient_age"], 25)
        self.assertEqual(res["patient_gender"], "Женский")

    def test_age_out_of_bounds(self):
        res = parse_patient_from_filename("Смирнов Петр 150 M.png")
        self.assertEqual(res["patient_age"], None)

        res = parse_patient_from_filename("Смирнов Петр 0 M.png")
        self.assertEqual(res["patient_age"], None)

    def test_single_name(self):
        res = parse_patient_from_filename("Мария 20 F.png")
        self.assertEqual(res["patient_name"], "Мария")
        self.assertEqual(res["patient_age"], 20)

    def test_auto_gender_detect(self):
        # No gender specified, but 'ович' / 'ич' is male
        res = parse_patient_from_filename("Сидоров Сидор.png")
        self.assertEqual(res["patient_gender"], "Мужской")

        res = parse_patient_from_filename("Светлана.png")
        self.assertEqual(res["patient_gender"], "Женский")

    def test_empty_string(self):
        res = parse_patient_from_filename("")
        self.assertEqual(res["patient_name"], "")
        self.assertEqual(res["patient_age"], None)
        self.assertEqual(res["patient_gender"], "Не указан")

    def test_special_characters(self):
        # Testing parsing with different separators.
        # Note: the app logic specifically looks for Russian suffixes to swap names,
        # so for non-Russian suffixes it keeps the order as they appeared.
        # "Petrov Petr" doesn't trigger swap logic because it doesn't end in the exact Russian suffix.
        res = parse_patient_from_filename("Petrov_Petr-35_MALE.png")
        self.assertEqual(res["patient_name"], "Petrov Petr")
        self.assertEqual(res["patient_age"], 35)
        self.assertEqual(res["patient_gender"], "Мужской")

        # Test special characters with russian names
        res = parse_patient_from_filename("Смирнов_Петр-35_МУЖ.png")
        self.assertEqual(res["patient_name"], "Петр Смирнов")
        self.assertEqual(res["patient_age"], 35)
        self.assertEqual(res["patient_gender"], "Мужской")

    def test_multiple_spaces(self):
        res = parse_patient_from_filename("  Иванов   Иван    40   М  .png")
        self.assertEqual(res["patient_name"], "Иван Иванов")
        self.assertEqual(res["patient_age"], 40)
        self.assertEqual(res["patient_gender"], "Мужской")

    def test_gender_aliases(self):
        # M, М, MALE, МУЖ
        self.assertEqual(parse_patient_from_filename("Иван МУЖ.png")["patient_gender"], "Мужской")
        self.assertEqual(parse_patient_from_filename("Иван MALE.png")["patient_gender"], "Мужской")
        self.assertEqual(parse_patient_from_filename("Иван M.png")["patient_gender"], "Мужской")

        # F, Ж, FEMALE, ЖЕН
        self.assertEqual(parse_patient_from_filename("Анна ЖЕН.png")["patient_gender"], "Женский")
        self.assertEqual(parse_patient_from_filename("Анна FEMALE.png")["patient_gender"], "Женский")
        self.assertEqual(parse_patient_from_filename("Анна Ж.png")["patient_gender"], "Женский")

    def test_more_than_two_names(self):
        res = parse_patient_from_filename("Иванов Иван Иванович 30 M.png")
        # Logic says p1=Иванов, p2=Иван, so it ignores the third string, but let's see what it does actually.
        # name_parts will be ['Иванов', 'Иван', 'Иванович'].
        # if len(name_parts) >= 2 it takes first two.
        self.assertEqual(res["patient_name"], "Иван Иванов")

if __name__ == '__main__':
    unittest.main()
