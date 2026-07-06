from ShadowAnalyst.doctor_popup import parse_findings

def test_parse_findings_empty_or_none():
    # Test None
    body, alert = parse_findings(None)
    assert body == ["Патологий не обнаружено. Норма."]
    assert alert == []

    # Test empty string
    body, alert = parse_findings("")
    assert body == ["Патологий не обнаружено. Норма."]
    assert alert == []

def test_parse_findings_normal_exact():
    # Test exactly "Норма"
    body, alert = parse_findings("Норма")
    assert body == ["Патологий не обнаружено. Норма."]
    assert alert == []

def test_parse_findings_no_alerts():
    # Test findings with normal text
    findings = "Зуб 11 в порядке\nЗуб 12: пломба, без патологий"
    body, alert = parse_findings(findings)
    assert body == ["Зуб 11 в порядке", "Зуб 12: пломба, без патологий"]
    assert alert == []

def test_parse_findings_with_caries():
    # Test findings containing "кариес" (case-insensitive)
    findings = "Зуб 11: обнаружен КАРИЕС\nЗуб 12: кариес на контактной поверхности"
    body, alert = parse_findings(findings)
    assert body == []
    assert alert == ["Зуб 11: обнаружен КАРИЕС", "Зуб 12: кариес на контактной поверхности"]

def test_parse_findings_with_inflammation():
    # Test findings containing "воспаление" (case-insensitive)
    findings = "Зуб 21: Воспаление десны"
    body, alert = parse_findings(findings)
    assert body == []
    assert alert == ["Зуб 21: Воспаление десны"]

def test_parse_findings_mixed():
    # Test mixed findings
    findings = "Зуб 11: Норма\nЗуб 12: глубокий кариес\nЗуб 13: пломба\nЗуб 14: воспаление корня"
    body, alert = parse_findings(findings)
    assert body == ["Зуб 11: Норма", "Зуб 13: пломба"]
    assert alert == ["Зуб 12: глубокий кариес", "Зуб 14: воспаление корня"]
