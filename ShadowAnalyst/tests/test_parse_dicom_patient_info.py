import sys
import unittest
from unittest.mock import MagicMock, patch
import datetime

# Add path so gui.app can be imported
sys.path.insert(0, "ShadowAnalyst")
from gui.app import _parse_dicom_patient_info

class TestParseDicomPatientInfo(unittest.TestCase):
    def setUp(self):
        self.mock_pydicom = MagicMock()
        # Mock pydicom module in sys.modules
        self.patcher = patch.dict(sys.modules, {'pydicom': self.mock_pydicom})
        self.patcher.start()

    def tearDown(self):
        self.patcher.stop()

    def test_happy_path(self):
        mock_ds = MagicMock()
        mock_ds.PatientName = "Ivanov^Ivan^Ivanovich"
        mock_ds.PatientSex = "M"
        mock_ds.PatientAge = "035Y"
        self.mock_pydicom.dcmread.return_value = mock_ds

        info = {}
        _parse_dicom_patient_info("dummy.dcm", info)

        self.assertEqual(info.get("patient_name"), "Ivanov Ivan Ivanovich")
        self.assertEqual(info.get("patient_gender"), "Мужской")
        self.assertEqual(info.get("patient_age"), 35)
        self.mock_pydicom.dcmread.assert_called_once_with("dummy.dcm", stop_before_pixels=True)

    def test_female_gender_and_months_age(self):
        mock_ds = MagicMock()
        mock_ds.PatientName = "Petrova^Anna"
        mock_ds.PatientSex = "F"
        mock_ds.PatientAge = "011M" # Age in months
        self.mock_pydicom.dcmread.return_value = mock_ds

        info = {}
        _parse_dicom_patient_info("dummy.dcm", info)

        self.assertEqual(info.get("patient_name"), "Petrova Anna")
        self.assertEqual(info.get("patient_gender"), "Женский")
        self.assertEqual(info.get("patient_age"), 0) # Non-year unit should result in 0

    def test_fallback_age_from_birthdate(self):
        mock_ds = MagicMock()
        mock_ds.PatientName = "Smith^John"
        mock_ds.PatientSex = "O" # Other gender not explicitly handled

        # Missing PatientAge, present PatientBirthDate
        del mock_ds.PatientAge
        mock_ds.PatientBirthDate = "19900512"
        self.mock_pydicom.dcmread.return_value = mock_ds

        info = {}
        _parse_dicom_patient_info("dummy.dcm", info)

        current_year = datetime.datetime.now().year
        expected_age = current_year - 1990

        self.assertEqual(info.get("patient_name"), "Smith John")
        self.assertNotIn("patient_gender", info) # 'O' shouldn't add a gender key
        self.assertEqual(info.get("patient_age"), expected_age)

    def test_missing_data(self):
        mock_ds = MagicMock()
        # Ensure all these attributes trigger AttributeError or return empty when getattr is called
        del mock_ds.PatientName
        del mock_ds.PatientSex
        del mock_ds.PatientAge
        del mock_ds.PatientBirthDate
        self.mock_pydicom.dcmread.return_value = mock_ds

        info = {"initial": "data"}
        _parse_dicom_patient_info("dummy.dcm", info)

        # Only "initial" should be present, as parsing found nothing to add
        self.assertEqual(info, {"initial": "data"})

    def test_exception_handling(self):
        self.mock_pydicom.dcmread.side_effect = Exception("DICOM Read Error")

        info = {}
        # Should not raise exception
        _parse_dicom_patient_info("dummy.dcm", info)

        # Info should remain unmodified
        self.assertEqual(info, {})

if __name__ == '__main__':
    unittest.main()
