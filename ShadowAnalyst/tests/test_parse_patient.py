import unittest
from gui.app import parse_patient_from_filename

class TestParsePatientFromFilename(unittest.TestCase):
    def test_empty_filename(self):
        result = parse_patient_from_filename("")
        self.assertEqual(result["patient_name"], "")
        self.assertIsNone(result["patient_age"])
        self.assertEqual(result["patient_gender"], "Не указан")

    def test_only_separators(self):
        result = parse_patient_from_filename("___---   .jpg")
        self.assertEqual(result["patient_name"], "")
        self.assertIsNone(result["patient_age"])
        self.assertEqual(result["patient_gender"], "Не указан")

    def test_out_of_bounds_age_zero(self):
        result = parse_patient_from_filename("Ivan_0.jpg")
        self.assertEqual(result["patient_name"], "Ivan")
        self.assertIsNone(result["patient_age"])
        self.assertEqual(result["patient_gender"], "Не указан")

    def test_out_of_bounds_age_too_large(self):
        result = parse_patient_from_filename("Ivan_120.jpg")
        self.assertEqual(result["patient_name"], "Ivan")
        self.assertIsNone(result["patient_age"])
        self.assertEqual(result["patient_gender"], "Не указан")

    def test_out_of_bounds_age_too_large_2(self):
        result = parse_patient_from_filename("Ivan_150.jpg")
        self.assertEqual(result["patient_name"], "Ivan")
        self.assertIsNone(result["patient_age"])
        self.assertEqual(result["patient_gender"], "Не указан")

    def test_invalid_gender_marker(self):
        result = parse_patient_from_filename("Ivan_X_45.jpg")
        self.assertEqual(result["patient_name"], "Ivan X")
        self.assertEqual(result["patient_age"], 45)
        # The detect_gender_ru doesn't work for non-cyrillic
        self.assertEqual(result["patient_gender"], "Не указан")

    def test_no_valid_parts(self):
        result = parse_patient_from_filename("!@#$%^&*().png")
        self.assertEqual(result["patient_name"], "")
        self.assertIsNone(result["patient_age"])
        self.assertEqual(result["patient_gender"], "Не указан")

    def test_valid_russian_male(self):
        result = parse_patient_from_filename("Иванов_Иван_45_М.dcm")
        self.assertEqual(result["patient_name"], "Иван Иванов")
        self.assertEqual(result["patient_age"], 45)
        self.assertEqual(result["patient_gender"], "Мужской")

    def test_valid_russian_female(self):
        result = parse_patient_from_filename("Иванова_Анна_30_Ж.dcm")
        self.assertEqual(result["patient_name"], "Анна Иванова")
        self.assertEqual(result["patient_age"], 30)
        self.assertEqual(result["patient_gender"], "Женский")

    def test_valid_english_male(self):
        result = parse_patient_from_filename("Smith_John_50_Male.jpg")
        self.assertEqual(result["patient_name"], "Smith John")
        self.assertEqual(result["patient_age"], 50)
        self.assertEqual(result["patient_gender"], "Мужской")

    def test_detect_gender_from_name_male(self):
        result = parse_patient_from_filename("Иванов_Иван_45.dcm")
        self.assertEqual(result["patient_name"], "Иван Иванов")
        self.assertEqual(result["patient_age"], 45)
        self.assertEqual(result["patient_gender"], "Мужской")

    def test_detect_gender_from_name_female(self):
        result = parse_patient_from_filename("Иванова_Анна_30.dcm")
        self.assertEqual(result["patient_name"], "Анна Иванова")
        self.assertEqual(result["patient_age"], 30)
        self.assertEqual(result["patient_gender"], "Женский")

    def test_single_name(self):
        result = parse_patient_from_filename("Alex_25_M.png")
        self.assertEqual(result["patient_name"], "Alex")
        self.assertEqual(result["patient_age"], 25)
        self.assertEqual(result["patient_gender"], "Мужской")

if __name__ == '__main__':
    unittest.main()
