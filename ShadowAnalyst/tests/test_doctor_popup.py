import unittest
from doctor_popup import parse_findings

class TestParseFindings(unittest.TestCase):

    def test_parse_findings_empty_or_none(self):
        # Test None
        body, alert = parse_findings(None)
        self.assertEqual(body, ["Патологий не обнаружено. Норма."])
        self.assertEqual(alert, [])

        # Test empty string
        body, alert = parse_findings("")
        self.assertEqual(body, ["Патологий не обнаружено. Норма."])
        self.assertEqual(alert, [])

    def test_parse_findings_normal_exact(self):
        # Test exactly "Норма"
        body, alert = parse_findings("Норма")
        self.assertEqual(body, ["Патологий не обнаружено. Норма."])
        self.assertEqual(alert, [])

    def test_parse_findings_normal_variations(self):
        # Test lowercase "норма", it doesn't match exactly "Норма" but it doesn't have keywords
        body, alert = parse_findings("норма")
        self.assertEqual(body, ["норма"])
        self.assertEqual(alert, [])

        # Test " Норма ", it doesn't match exactly "Норма"
        body, alert = parse_findings(" Норма ")
        self.assertEqual(body, [" Норма "])
        self.assertEqual(alert, [])

    def test_parse_findings_no_alerts(self):
        # Test findings with normal text
        findings = "Зуб 11 в порядке\nЗуб 12: пломба, без патологий"
        body, alert = parse_findings(findings)
        self.assertEqual(body, ["Зуб 11 в порядке", "Зуб 12: пломба, без патологий"])
        self.assertEqual(alert, [])

    def test_parse_findings_with_caries(self):
        # Test findings containing "кариес" (case-insensitive)
        findings = "Зуб 11: обнаружен КАРИЕС\nЗуб 12: кариес на контактной поверхности"
        body, alert = parse_findings(findings)
        self.assertEqual(body, [])
        self.assertEqual(alert, ["Зуб 11: обнаружен КАРИЕС", "Зуб 12: кариес на контактной поверхности"])

    def test_parse_findings_with_inflammation(self):
        # Test findings containing "воспаление" (case-insensitive)
        findings = "Зуб 21: Воспаление десны"
        body, alert = parse_findings(findings)
        self.assertEqual(body, [])
        self.assertEqual(alert, ["Зуб 21: Воспаление десны"])

    def test_parse_findings_mixed(self):
        # Test mixed findings
        findings = "Зуб 11: Норма\nЗуб 12: глубокий кариес\nЗуб 13: пломба\nЗуб 14: воспаление корня"
        body, alert = parse_findings(findings)
        self.assertEqual(body, ["Зуб 11: Норма", "Зуб 13: пломба"])
        self.assertEqual(alert, ["Зуб 12: глубокий кариес", "Зуб 14: воспаление корня"])

    def test_parse_findings_empty_lines(self):
        # Test strings with empty lines
        findings = "Зуб 11: Норма\n\n\nЗуб 12: кариес\n "
        body, alert = parse_findings(findings)
        self.assertEqual(body, ["Зуб 11: Норма", "", "", " "])
        self.assertEqual(alert, ["Зуб 12: кариес"])

    def test_parse_findings_mixed_case(self):
        # Test mixed case for keywords
        findings = "Зуб 11: кАрИеС\nЗуб 12: вОсПаЛеНиЕ"
        body, alert = parse_findings(findings)
        self.assertEqual(body, [])
        self.assertEqual(alert, ["Зуб 11: кАрИеС", "Зуб 12: вОсПаЛеНиЕ"])

    def test_parse_findings_punctuation(self):
        # Test keywords with punctuation
        findings = "Зуб 11: кариес!\nЗуб 12: (воспаление)"
        body, alert = parse_findings(findings)
        self.assertEqual(body, [])
        self.assertEqual(alert, ["Зуб 11: кариес!", "Зуб 12: (воспаление)"])

    def test_parse_findings_invalid_type(self):
        # Test non-string inputs
        with self.assertRaises(AttributeError):
            parse_findings(123)
        with self.assertRaises(AttributeError):
            parse_findings(["Зуб 11"])

    def test_parse_findings_whitespace_only(self):
        # Test whitespace-only string
        body, alert = parse_findings("   ")
        self.assertEqual(body, ["   "])
        self.assertEqual(alert, [])



    def test_parse_findings_crlf(self):
        # Test CRLF line endings
        findings = "Line 1\r\nLine 2 кариес\r\nLine 3"
        body, alert = parse_findings(findings)
        self.assertEqual(body, ["Line 1\r", "Line 3"])
        self.assertEqual(alert, ["Line 2 кариес\r"])

    def test_parse_findings_multiple_keywords(self):
        # Test line with multiple keywords
        findings = "Зуб 11: кариес и воспаление"
        body, alert = parse_findings(findings)
        self.assertEqual(body, [])
        self.assertEqual(alert, ["Зуб 11: кариес и воспаление"])

    def test_parse_findings_substring(self):
        # Test substring matches
        findings = "антикариесный эффект"
        body, alert = parse_findings(findings)
        self.assertEqual(body, [])
        self.assertEqual(alert, ["антикариесный эффект"])

    def test_parse_findings_unicode(self):
        # Test Unicode/emoji
        findings = "🦷 кариес 😢"
        body, alert = parse_findings(findings)
        self.assertEqual(body, [])
        self.assertEqual(alert, ["🦷 кариес 😢"])

    def test_parse_findings_falsy_inputs(self):
        # False boolean
        body, alert = parse_findings(False)
        self.assertEqual(body, ["Патологий не обнаружено. Норма."])
        self.assertEqual(alert, [])

        # Zero integer
        body, alert = parse_findings(0)
        self.assertEqual(body, ["Патологий не обнаружено. Норма."])
        self.assertEqual(alert, [])

        # Empty list (evaluates to false but may fail split if it bypasses 'not findings' check)
        # Note: In the actual implementation, `if not findings` catches these falsy values
        body, alert = parse_findings([])
        self.assertEqual(body, ["Патологий не обнаружено. Норма."])
        self.assertEqual(alert, [])

if __name__ == '__main__':
    unittest.main()
