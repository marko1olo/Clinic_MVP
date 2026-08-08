import unittest
from unittest.mock import patch, mock_open, call, MagicMock
import os
import requests

from ShadowAnalyst.download_samples import download_samples

class TestDownloadSamples(unittest.TestCase):

    @patch('ShadowAnalyst.download_samples.requests.get')
    @patch('ShadowAnalyst.download_samples.os.makedirs')
    @patch('builtins.open', new_callable=mock_open)
    @patch('builtins.print')
    def test_download_samples_success(self, mock_print, mock_file, mock_makedirs, mock_get):
        # Setup mock responses
        # First request for the list
        mock_list_response = MagicMock()
        mock_list_response.json.return_value = {
            'list': [
                {'imgLarge': '/img1.jpg'},
                {'imgLarge': '/img2.jpg'},
                # 8 more to reach 10
                {'imgLarge': '/img3.jpg'},
                {'imgLarge': '/img4.jpg'},
                {'imgLarge': '/img5.jpg'},
                {'imgLarge': '/img6.jpg'},
                {'imgLarge': '/img7.jpg'},
                {'imgLarge': '/img8.jpg'},
                {'imgLarge': '/img9.jpg'},
                {'imgLarge': '/img10.jpg'},
                {'imgLarge': '/img11.jpg'} # Should not be downloaded
            ]
        }

        # Subsequent requests for images
        mock_img_response = MagicMock()
        mock_img_response.content = b'fake_image_data'

        # Configure the side_effect for requests.get
        # The first call returns the list response, all subsequent return the image response
        def side_effect(url, **kwargs):
            if 'api/search' in url:
                return mock_list_response
            return mock_img_response

        mock_get.side_effect = side_effect

        # Run the function
        download_samples()

        # Verify os.makedirs was called
        mock_makedirs.assert_called_once_with(r'C:\Clinic_MVP\Sample_Images', exist_ok=True)

        # Verify that we downloaded exactly 10 images
        self.assertEqual(mock_get.call_count, 11) # 1 for list, 10 for images

        # Verify file writing
        self.assertEqual(mock_file.call_count, 10)

        # Verify print statement
        mock_print.assert_any_call('Done. Downloaded 10 medical images.')

    @patch('ShadowAnalyst.download_samples.requests.get')
    @patch('ShadowAnalyst.download_samples.os.makedirs')
    @patch('builtins.open', new_callable=mock_open)
    @patch('builtins.print')
    def test_download_samples_exception_handling(self, mock_print, mock_file, mock_makedirs, mock_get):
        # Setup mock responses
        mock_list_response = MagicMock()
        mock_list_response.json.return_value = {
            'list': [
                {'imgLarge': '/img1.jpg'},
                {'imgLarge': '/img2.jpg'}
            ]
        }

        # First image fails, second succeeds
        mock_img_response_success = MagicMock()
        mock_img_response_success.content = b'fake_image_data'

        def side_effect(url, **kwargs):
            if 'api/search' in url:
                return mock_list_response
            elif 'img1.jpg' in url:
                raise requests.exceptions.RequestException("Network error")
            return mock_img_response_success

        mock_get.side_effect = side_effect

        # Run the function
        download_samples()

        # Verify file writing happened only once (for the second image)
        self.assertEqual(mock_file.call_count, 1)

        # Verify print statement for the error
        mock_print.assert_any_call('Error downloading https://openi.nlm.nih.gov/img1.jpg: Network error')
        mock_print.assert_any_call('Done. Downloaded 1 medical images.')

    @patch('ShadowAnalyst.download_samples.requests.get')
    @patch('ShadowAnalyst.download_samples.os.makedirs')
    @patch('builtins.print')
    def test_download_samples_empty_list(self, mock_print, mock_makedirs, mock_get):
        # Setup mock responses for empty list
        mock_list_response = MagicMock()
        mock_list_response.json.return_value = {} # No 'list' key
        mock_get.return_value = mock_list_response

        # Run the function
        download_samples()

        # Verify get was called once
        mock_get.assert_called_once()
