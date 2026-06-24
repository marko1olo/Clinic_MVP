import { test, describe } from 'node:test';
import assert from 'node:assert';
import { timingSafeSecretEqual } from '../utils/timingSafeSecretEqual.js';

describe('timingSafeSecretEqual', () => {
  test('returns true when the providedSecret matches the expectedSecret exactly', () => {
    assert.strictEqual(timingSafeSecretEqual('mysecret123', 'mysecret123'), true);
  });

  test('returns false when providedSecret is null', () => {
    assert.strictEqual(timingSafeSecretEqual(null, 'mysecret123'), false);
  });

  test('returns false when providedSecret is an empty string (even if expectedSecret is empty)', () => {
    assert.strictEqual(timingSafeSecretEqual('', ''), false);
  });

  test('returns false when secrets have different lengths', () => {
    assert.strictEqual(timingSafeSecretEqual('mysecret', 'mysecret123'), false);
    assert.strictEqual(timingSafeSecretEqual('mysecret1234', 'mysecret123'), false);
  });

  test('returns false when secrets have the same length but different contents', () => {
    assert.strictEqual(timingSafeSecretEqual('mysecret123', 'mysecret124'), false);
    assert.strictEqual(timingSafeSecretEqual('MYSECRET123', 'mysecret123'), false);
  });

  test('handles Unicode characters properly', () => {
    assert.strictEqual(timingSafeSecretEqual('мyšecяet', 'мyšecяet'), true);
    assert.strictEqual(timingSafeSecretEqual('мyšecяet1', 'мyšecяet2'), false);
    // Different buffer length with same character count
    assert.strictEqual(timingSafeSecretEqual('a', 'ñ'), false);
  });

  test('returns false when lengths match but content differs at the beginning', () => {
    assert.strictEqual(timingSafeSecretEqual('aysecret123', 'bysecret123'), false);
  });
});
