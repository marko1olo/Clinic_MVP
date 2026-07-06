import { test, describe } from 'node:test';
import assert from 'node:assert';
import { repairMojibakeDeep } from './repairMojibake.js';

describe('repairMojibakeDeep', () => {
  test('returns primitives as-is', () => {
    assert.strictEqual(repairMojibakeDeep(null), null);
    assert.strictEqual(repairMojibakeDeep(undefined), undefined);
    assert.strictEqual(repairMojibakeDeep(42), 42);
<<<<<<< HEAD
import { repairMojibakeDeep, repairMojibakeText } from './repairMojibake.js';

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
  });

  test('leaves undefined alone', () => {
  });

  test('leaves boolean alone', () => {
=======
>>>>>>> gitlab/main
    assert.strictEqual(repairMojibakeDeep(true), true);
    assert.strictEqual(repairMojibakeDeep(false), false);
  });

  test('repairs string values', () => {
    // Standard string
    assert.strictEqual(repairMojibakeDeep('Hello world'), 'Hello world');
    // Mojibake string
    assert.strictEqual(repairMojibakeDeep('ÐŸÑ€Ð¸Ð²ÐµÑ‚'), 'Привет');
  });

  test('repairs arrays deeply', () => {
    const input = [1, 'ÐŸÑ€Ð¸Ð²ÐµÑ‚', [null, 'ÐœÐ¸Ñ€']];
    const expected = [1, 'Привет', [null, 'Мир']];
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('repairs objects deeply', () => {
    const input = {
      id: 123,
      name: 'ÐŸÑ€Ð¸Ð²ÐµÑ‚',
      nested: {
        value: 'ÐœÐ¸Ñ€',
        flag: true
      }
    };
    const expected = {
      id: 123,
      name: 'Привет',
      nested: {
        value: 'Мир',
        flag: true
      }
    };
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('repairs complex nested structures', () => {
    const input = {
      data: [
        { title: 'Ð—Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ðº', count: 1 },
        { title: 'Test', count: 2 }
      ],
      meta: 'ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ'
    };
    const expected = {
      data: [
        { title: 'Заголовок', count: 1 },
        { title: 'Test', count: 2 }
      ],
      meta: 'Описание'
    };
<<<<<<< HEAD
  test('handles complex deeply nested structure', () => {
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

=======
>>>>>>> gitlab/main
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });
});
