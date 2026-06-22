import { test, describe } from 'node:test';
import assert from 'node:assert';
import { safeParseJsonObject } from '../polish.js';

describe('Speech Polish - safeParseJsonObject', () => {
  test('parses valid JSON directly', () => {
    const validJson = '{"normalizedTranscript": "test", "warnings": []}';
    const result = safeParseJsonObject(validJson);
    assert.deepStrictEqual(result, { normalizedTranscript: 'test', warnings: [] });
  });

  test('falls back to regex when JSON is wrapped in text', () => {
    const wrappedJson = 'Here is the result: {"normalizedTranscript": "test", "warnings": []} and some more text';
    const result = safeParseJsonObject(wrappedJson);
    assert.deepStrictEqual(result, { normalizedTranscript: 'test', warnings: [] });
  });

  test('throws error when no valid JSON object can be extracted', () => {
    const invalidInput = 'This is just some text without any JSON object.';
    assert.throws(() => safeParseJsonObject(invalidInput), {
      message: 'Дополнительная очистка диктовки вернула нечитаемый структурированный ответ.'
    });
  });
});
