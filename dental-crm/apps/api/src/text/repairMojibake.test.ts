import { test, describe } from 'node:test';
import assert from 'node:assert';
import { repairMojibakeDeep, repairMojibakeText } from './repairMojibake.js';

describe('repairMojibakeDeep', () => {
  test('handles plain strings correctly', () => {
    assert.strictEqual(repairMojibakeDeep('hello'), 'hello');
  });

  test('fixes simple string mojibake', () => {
    // "РџСЂРёРІРµС‚" is "Привет" in cp1252 encoded utf8
    assert.strictEqual(repairMojibakeDeep('РџСЂРёРІРµС‚'), repairMojibakeText('РџСЂРёРІРµС‚'));
  });

  test('fixes nested object', () => {
    const input = { a: 'hello', b: { c: 'РџСЂРёРІРµС‚' } };
    const expected = { a: 'hello', b: { c: repairMojibakeText('РџСЂРёРІРµС‚') } };
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('fixes array', () => {
    const input = ['hello', 'РџСЂРёРІРµС‚'];
    const expected = ['hello', repairMojibakeText('РџСЂРёРІРµС‚')];
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('fixes array in object', () => {
    const input = { a: ['hello', 'РџСЂРёРІРµС‚'] };
    const expected = { a: ['hello', repairMojibakeText('РџСЂРёРІРµС‚')] };
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('fixes object in array', () => {
    const input = [{ a: 'hello' }, { b: 'РџСЂРёРІРµС‚' }];
    const expected = [{ a: 'hello' }, { b: repairMojibakeText('РџСЂРёРІРµС‚') }];
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('leaves numbers alone', () => {
    assert.strictEqual(repairMojibakeDeep(123), 123);
  });

  test('leaves null alone', () => {
    assert.strictEqual(repairMojibakeDeep(null), null);
  });

  test('leaves undefined alone', () => {
    assert.strictEqual(repairMojibakeDeep(undefined), undefined);
  });

  test('leaves boolean alone', () => {
    assert.strictEqual(repairMojibakeDeep(true), true);
    assert.strictEqual(repairMojibakeDeep(false), false);
  });

  test('handles complex deeply nested structure', () => {
    const input = {
      id: 1,
      metadata: {
        isValid: true,
        empty: null,
      },
      tags: ['test', 'РџСЂРёРІРµС‚', 42],
      details: [
        { key: 'name', value: 'hello' },
        { key: 'ru_name', value: 'РџСЂРёРІРµС‚' }
      ]
    };

    const expected = {
      id: 1,
      metadata: {
        isValid: true,
        empty: null,
      },
      tags: ['test', repairMojibakeText('РџСЂРёРІРµС‚'), 42],
      details: [
        { key: 'name', value: 'hello' },
        { key: 'ru_name', value: repairMojibakeText('РџСЂРёРІРµС‚') }
      ]
    };

    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });
});
