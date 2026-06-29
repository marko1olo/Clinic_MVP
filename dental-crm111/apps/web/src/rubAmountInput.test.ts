import { test, describe } from 'node:test';
import assert from 'node:assert';
import { rubAmountInputMissingStep } from './rubAmountInput.js';

describe('rubAmountInputMissingStep', () => {
  const defaultZeroMessage = "укажите сумму больше нуля";
  const defaultInvalidMessage = "укажите сумму целыми рублями без копеек";

  test('returns zero message for empty or whitespace input', () => {
    assert.strictEqual(rubAmountInputMissingStep(''), defaultZeroMessage);
    assert.strictEqual(rubAmountInputMissingStep('   '), defaultZeroMessage);
    assert.strictEqual(rubAmountInputMissingStep('\t'), defaultZeroMessage);
  });

  test('returns invalid message for non-numeric or invalid formats', () => {
    assert.strictEqual(rubAmountInputMissingStep('abc'), defaultInvalidMessage);
    assert.strictEqual(rubAmountInputMissingStep('12.34'), defaultInvalidMessage); // Decimals not allowed
    assert.strictEqual(rubAmountInputMissingStep('12,34'), defaultInvalidMessage);
    assert.strictEqual(rubAmountInputMissingStep('1 2 3.4'), defaultInvalidMessage);
    assert.strictEqual(rubAmountInputMissingStep('-100'), defaultInvalidMessage); // Negative numbers are treated as invalid format
    assert.strictEqual(rubAmountInputMissingStep('-0'), defaultInvalidMessage);
  });

  test('returns zero message for 0', () => {
    assert.strictEqual(rubAmountInputMissingStep('0'), defaultZeroMessage);
    assert.strictEqual(rubAmountInputMissingStep('00'), defaultZeroMessage);
  });

  test('returns null for valid whole positive numbers', () => {
    assert.strictEqual(rubAmountInputMissingStep('100'), null);
    assert.strictEqual(rubAmountInputMissingStep('1'), null);
    assert.strictEqual(rubAmountInputMissingStep('999999'), null);
    assert.strictEqual(rubAmountInputMissingStep('1 000 000'), null); // With spaces (normalizeRubAmountInput strips spaces)
  });

  test('respects custom messages', () => {
    const customZero = "Custom zero";
    const customInvalid = "Custom invalid";

    assert.strictEqual(rubAmountInputMissingStep('', customZero, customInvalid), customZero);
    assert.strictEqual(rubAmountInputMissingStep('0', customZero, customInvalid), customZero);
    assert.strictEqual(rubAmountInputMissingStep('abc', customZero, customInvalid), customInvalid);
  });
});
