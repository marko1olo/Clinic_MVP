import unittest
from unittest.mock import patch, mock_open, MagicMock
import requests

from download_samples import main

class TestDownloadSamples(unittest.TestCase):

    @patch('download_samples.requests.get')
    @patch('download_samples.os.makedirs')
    @patch('builtins.open', new_callable=mock_open)
    @patch('builtins.print')
    def test_main_happy_path(self, mock_print, mock_file, mock_makedirs, mock_requests_get):
        # Mock the search API response
        mock_api_response = MagicMock()
        mock_api_response.json.return_value = {
            'list': [
                {'imgLarge': '/item1.jpg'},
                {'imgLarge': '/item2.jpg'}
            ]
        }

        # Mock the image download responses
        mock_img_response1 = MagicMock()
        mock_img_response1.content = b'image_data_1'

        mock_img_response2 = MagicMock()
        mock_img_response2.content = b'image_data_2'

        # Set up side_effect for requests.get
        # First call: API search
        # Second call: Download image 1
        # Third call: Download image 2
        mock_requests_get.side_effect = [mock_api_response, mock_img_response1, mock_img_response2]

        # Run the function
        main()

        # Verify os.makedirs was called
        mock_makedirs.assert_called_once_with(r'C:\Clinic_MVP\Sample_Images', exist_ok=True)

        # Verify requests.get calls
        self.assertEqual(mock_requests_get.call_count, 3)
        mock_requests_get.assert_any_call('https://openi.nlm.nih.gov/api/search?query=periapical+radiograph&m=1&n=20', timeout=30)
        mock_requests_get.assert_any_call('https://openi.nlm.nih.gov/item1.jpg', timeout=15)
        mock_requests_get.assert_any_call('https://openi.nlm.nih.gov/item2.jpg', timeout=15)

        # Verify open and write calls
        self.assertEqual(mock_file.call_count, 2)
        handle = mock_file()
        self.assertEqual(handle.write.call_count, 2)

        # Verify print calls
        mock_print.assert_any_call('Downloaded xray_1.jpg')
        mock_print.assert_any_call('Downloaded xray_2.jpg')
        mock_print.assert_any_call('Done. Downloaded 2 medical images.')

    @patch('download_samples.requests.get')
    @patch('download_samples.os.makedirs')
    @patch('builtins.open', new_callable=mock_open)
    @patch('builtins.print')
    def test_main_error_path(self, mock_print, mock_file, mock_makedirs, mock_requests_get):
        # Mock the search API response
        mock_api_response = MagicMock()
        mock_api_response.json.return_value = {
            'list': [
                {'imgLarge': '/item1.jpg'},
                {'imgLarge': '/item2.jpg'}
            ]
        }

        # Mock the image download response - first one fails, second one succeeds
        mock_img_response2 = MagicMock()
        mock_img_response2.content = b'image_data_2'

        # Set up side_effect for requests.get
        # First call: API search
        # Second call: Download image 1 -> Raises Timeout
        # Third call: Download image 2 -> Succeeds
        mock_requests_get.side_effect = [
            mock_api_response,
            requests.exceptions.Timeout("Connection timed out"),
            mock_img_response2
        ]

        # Run the function
        main()

        # Verify os.makedirs was called
        mock_makedirs.assert_called_once_with(r'C:\Clinic_MVP\Sample_Images', exist_ok=True)

        # Verify requests.get calls
        self.assertEqual(mock_requests_get.call_count, 3)

        # Verify open and write calls - only one should succeed
        self.assertEqual(mock_file.call_count, 1)
        handle = mock_file()
        self.assertEqual(handle.write.call_count, 1)

        # Verify print calls
        mock_print.assert_any_call('Error downloading https://openi.nlm.nih.gov/item1.jpg: Connection timed out')
        mock_print.assert_any_call('Downloaded xray_1.jpg') # Since downloaded count didn't increment for the first one
        mock_print.assert_any_call('Done. Downloaded 1 medical images.')

if __name__ == '__main__':
    unittest.main()
