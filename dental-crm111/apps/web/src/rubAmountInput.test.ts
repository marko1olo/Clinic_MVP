import { test, describe } from 'node:test';
import assert from 'node:assert';
import { normalizeRubAmountInput, rubAmountInputMissingStep } from './rubAmountInput.js';

describe('normalizeRubAmountInput', () => {
  test('returns number for valid inputs', () => {
    assert.strictEqual(normalizeRubAmountInput('123'), 123);
    assert.strictEqual(normalizeRubAmountInput('1000'), 1000);
  });

  test('removes spaces and non-breaking spaces', () => {
    assert.strictEqual(normalizeRubAmountInput('1 234'), 1234);
    assert.strictEqual(normalizeRubAmountInput('1\u00A0234\u00A0567'), 1234567);
    assert.strictEqual(normalizeRubAmountInput('  123  '), 123);
  });

  test('returns null for empty or space-only strings', () => {
    assert.strictEqual(normalizeRubAmountInput(''), null);
    assert.strictEqual(normalizeRubAmountInput('   '), null);
    assert.strictEqual(normalizeRubAmountInput('\u00A0'), null);
  });

  test('returns null for non-digits', () => {
    assert.strictEqual(normalizeRubAmountInput('123a'), null);
    assert.strictEqual(normalizeRubAmountInput('abc'), null);
    assert.strictEqual(normalizeRubAmountInput('12.34'), null);
    assert.strictEqual(normalizeRubAmountInput('12,34'), null);
    assert.strictEqual(normalizeRubAmountInput('-100'), null); // Only positive ints per regex ^\d+$
  });

  test('handles zero', () => {
    assert.strictEqual(normalizeRubAmountInput('0'), 0);
  });

  test('returns null for unsafe integers', () => {
    const unsafeIntStr = (Number.MAX_SAFE_INTEGER + 1).toString();
    assert.strictEqual(normalizeRubAmountInput(unsafeIntStr), null);
  });
});

describe('rubAmountInputMissingStep', () => {
  test('returns default zeroMessage for empty strings', () => {
    assert.strictEqual(rubAmountInputMissingStep(''), 'укажите сумму больше нуля');
    assert.strictEqual(rubAmountInputMissingStep('   '), 'укажите сумму больше нуля');
  });

  test('returns custom zeroMessage for empty strings', () => {
    assert.strictEqual(rubAmountInputMissingStep('', 'custom zero'), 'custom zero');
  });

  test('returns default invalidMessage for invalid inputs', () => {
    assert.strictEqual(rubAmountInputMissingStep('abc'), 'укажите сумму целыми рублями без копеек');
    assert.strictEqual(rubAmountInputMissingStep('12.34'), 'укажите сумму целыми рублями без копеек');
    assert.strictEqual(rubAmountInputMissingStep('-100'), 'укажите сумму целыми рублями без копеек');
  });

  test('returns custom invalidMessage for invalid inputs', () => {
    assert.strictEqual(rubAmountInputMissingStep('abc', 'zero', 'custom invalid'), 'custom invalid');
  });

  test('returns zeroMessage for zero', () => {
    assert.strictEqual(rubAmountInputMissingStep('0'), 'укажите сумму больше нуля');
  });

  test('returns null for valid positive integers', () => {
    assert.strictEqual(rubAmountInputMissingStep('123'), null);
    assert.strictEqual(rubAmountInputMissingStep('1 000'), null);
  });
});
