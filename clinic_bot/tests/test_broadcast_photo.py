import unittest
import sys
import os
import asyncio
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bot import broadcast_photo

class TestBroadcastPhoto(unittest.IsolatedAsyncioTestCase):
    @patch('bot.db')
    @patch('bot.bot')
    async def test_broadcast_photo_optimal(self, mock_bot, mock_db):
        mock_db.get_users_by_role.return_value = [100, 101, 102]

        mock_msg = MagicMock()
        mock_msg.photo = [MagicMock(file_id="cached_file_id")]

        mock_bot.send_photo = AsyncMock(return_value=mock_msg)
        mock_bot.send_message = AsyncMock()

        photo_bytes = b"fake bytes"
        caption = "Test caption"
        report_text = "Test report"

        await broadcast_photo(photo_bytes, caption, report_text, role='doctor')

        self.assertEqual(mock_bot.send_photo.call_count, 3)

        # Verify the first call uses BufferedInputFile
        first_call_kwargs = mock_bot.send_photo.call_args_list[0].kwargs
        self.assertNotEqual(first_call_kwargs['photo'], "cached_file_id")

        # Verify subsequent calls use the cached file_id
        second_call_kwargs = mock_bot.send_photo.call_args_list[1].kwargs
        self.assertEqual(second_call_kwargs['photo'], "cached_file_id")

        third_call_kwargs = mock_bot.send_photo.call_args_list[2].kwargs
        self.assertEqual(third_call_kwargs['photo'], "cached_file_id")

if __name__ == '__main__':
    unittest.main()
