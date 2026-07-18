import unittest
import os
import tempfile
import base64
from PIL import Image
from io import BytesIO

from ShadowAnalyst.watcher import prepare_image

class TestPrepareImage(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()

    def tearDown(self):
        self.temp_dir.cleanup()

    def create_dummy_image(self, size, mode, filename):
        file_path = os.path.join(self.temp_dir.name, filename)
        img = Image.new(mode, size, color='red')
        img.save(file_path)
        return file_path

    def test_prepare_image_small_image(self):
        # Create a small image (500x500)
        file_path = self.create_dummy_image((500, 500), 'RGB', 'small.jpg')

        # Process the image
        result = prepare_image(file_path)

        # Verify the result
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith("data:image/jpeg;base64,"))

        # Extract base64 part and decode to verify it's a valid image
        base64_data = result.split(",")[1]
        img_bytes = base64.b64decode(base64_data)

        with Image.open(BytesIO(img_bytes)) as img:
            self.assertEqual(img.size, (500, 500))
            self.assertEqual(img.format, "JPEG")

    def test_prepare_image_large_image(self):
        # Create a large image (1500x1500)
        file_path = self.create_dummy_image((1500, 1500), 'RGB', 'large.jpg')

        # Process the image
        result = prepare_image(file_path)

        # Verify the result
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith("data:image/jpeg;base64,"))

        # Extract base64 part and decode to verify resize logic
        base64_data = result.split(",")[1]
        img_bytes = base64.b64decode(base64_data)

        with Image.open(BytesIO(img_bytes)) as img:
            self.assertEqual(max(img.size), 1000)
            self.assertEqual(img.format, "JPEG")

    def test_prepare_image_non_rgb(self):
        # Create a non-RGB image (RGBA)
        file_path = self.create_dummy_image((500, 500), 'RGBA', 'non_rgb.png')

        # Process the image
        result = prepare_image(file_path)

        # Verify the result
        self.assertIsNotNone(result)
        self.assertTrue(result.startswith("data:image/jpeg;base64,"))

        # Extract base64 part and decode
        base64_data = result.split(",")[1]
        img_bytes = base64.b64decode(base64_data)

        with Image.open(BytesIO(img_bytes)) as img:
            self.assertEqual(img.mode, "RGB")
            self.assertEqual(img.format, "JPEG")

    def test_prepare_image_error(self):
        # Pass a non-existent file
        file_path = os.path.join(self.temp_dir.name, "non_existent.jpg")

        # Process the image
        result = prepare_image(file_path)

        # Verify the result
        self.assertIsNone(result)

    def test_prepare_image_invalid_file(self):
        # Pass an invalid file (not an image)
        file_path = os.path.join(self.temp_dir.name, "invalid.txt")
        with open(file_path, "w") as f:
            f.write("This is not an image")

        # Process the image
        result = prepare_image(file_path)

        # Verify the result
        self.assertIsNone(result)

if __name__ == '__main__':
    unittest.main()