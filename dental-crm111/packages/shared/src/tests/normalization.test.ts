import { test, describe } from 'node:test';
import assert from 'node:assert';
import { normalizeDentalSpeechTranscript } from '../index.js';

describe('normalizeDentalSpeechTranscript', () => {
  test('normalizes whitespace and section headings', () => {
    const input = "\tЖалобы\r\n\r\nнет.  Объективно: \n \nзуб 11.\n\n\nПлан: лечение\t";
    const result = normalizeDentalSpeechTranscript(input, "universal");
    assert.ok(result.normalizedText.includes("Жалобы: нет"));
    assert.ok(result.normalizedText.includes("Объективно: зуб 11"));
    assert.ok(result.normalizedText.includes("План: лечение"));
  });

  test('normalizes various transcript shapes', () => {
    const t1 = "   Жалобы:    кариес  \n Объективно :    пломба";
    const r1 = normalizeDentalSpeechTranscript(t1, "universal");
    assert.ok(r1.normalizedText.includes("Жалобы: кариес"));
    assert.ok(r1.normalizedText.includes("Объективно: пломба"));

    const t2 = "Жалобы: нет. Объективно: зуб 11. DS: кариес. План: лечение.";
    const r2 = normalizeDentalSpeechTranscript(t2, "universal");
    assert.ok(r2.normalizedText.includes("Жалобы: нет"));
    assert.ok(r2.normalizedText.includes("Объективно: зуб 11"));
    assert.ok(r2.normalizedText.includes("DS: кариес"));
    assert.ok(r2.normalizedText.includes("План: лечение"));
  });
});
