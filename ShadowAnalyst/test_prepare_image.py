from __future__ import annotations

import os
import tempfile
import unittest

from gui.app import prepare_image


class TestPrepareImage(unittest.TestCase):
    def setUp(self):
        # Create a temporary invalid file
        self.fd, self.temp_file_path = tempfile.mkstemp(suffix='.jpg')
        with os.fdopen(self.fd, 'w') as f:
            f.write('This is not a valid image file')

        self.fd_dcm, self.temp_file_path_dcm = tempfile.mkstemp(suffix='.dcm')
        with os.fdopen(self.fd_dcm, 'w') as f:
            f.write('This is not a valid DICOM file')

    def tearDown(self):
        os.remove(self.temp_file_path)
        os.remove(self.temp_file_path_dcm)

    def test_invalid_image(self):
        result = prepare_image(self.temp_file_path)
        self.assertIsNone(result)

    def test_invalid_dcm(self):
        result = prepare_image(self.temp_file_path_dcm)
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()
