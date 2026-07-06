import unittest
import sys
import os
from unittest.mock import MagicMock

# Mock gui components before importing to avoid tkinter and other errors
sys.modules['tkinter'] = MagicMock()
sys.modules['webview'] = MagicMock()

# Ensure gui module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from gui.app import _parse_final_output

class TestParseFinalOutput(unittest.TestCase):

    def test_happy_path_both_tags(self):
        final_output = "<summary>This is a summary.</summary>\n<report>This is a detailed report.</report>"
        first_report = "Initial report"
        report, summary = _parse_final_output(final_output, first_report)
        self.assertEqual(summary, "This is a summary")
        self.assertEqual(report, "This is a detailed report.")

    def test_missing_report_tag(self):
        final_output = "<summary>This is a summary.</summary>"
        first_report = "Fallback initial report"
        report, summary = _parse_final_output(final_output, first_report)
        self.assertEqual(summary, "This is a summary")
        self.assertEqual(report, "Fallback initial report")

    def test_missing_summary_tag(self):
        final_output = "<report>This is a detailed report.</report>"
        first_report = "Initial report"
        report, summary = _parse_final_output(final_output, first_report)
        self.assertEqual(summary, "Снимок проанализирован ИИ-ассистентом")
        self.assertEqual(report, "This is a detailed report.")

    def test_missing_both_tags_multisentence(self):
        final_output = "Sentence one. Sentence two! Sentence three. Sentence four?"
        first_report = "Initial report"
        report, summary = _parse_final_output(final_output, first_report)
        self.assertEqual(summary, "Sentence one. Sentence two!")
        self.assertEqual(report, "Sentence three. Sentence four?")

    def test_missing_both_tags_single_sentence(self):
        final_output = "Just one sentence."
        first_report = "Initial report"
        report, summary = _parse_final_output(final_output, first_report)
        self.assertEqual(summary, "Just one sentence")
        self.assertEqual(report, "Just one sentence.")

    def test_cjk_stripping(self):
        final_output = "<summary>Summary with 中文 CJK.</summary>\n<report>Report with 漢字 CJK.</report>"
        first_report = "Initial report"
        report, summary = _parse_final_output(final_output, first_report)
        self.assertEqual(summary, "Summary with  CJK")
        self.assertEqual(report, "Report with  CJK.")

    def test_markdown_stripping_summary(self):
        final_output = "<summary>  # 1. * Summary text - * \n </summary>\n<report>Report text</report>"
        first_report = "Initial report"
        report, summary = _parse_final_output(final_output, first_report)
        self.assertEqual(summary, "Summary text")
        self.assertEqual(report, "Report text")

if __name__ == '__main__':
    unittest.main()
