import { test, describe } from 'node:test';
import assert from 'node:assert';
import { repairMojibakeText, repairMojibakeDeep } from '../text/repairMojibake.js';

describe('repairMojibakeText', () => {
  test('returns unmodified text if likelyMojibake is false', () => {
    assert.strictEqual(repairMojibakeText('Hello World'), 'Hello World');
    assert.strictEqual(repairMojibakeText('Привет мир'), 'Привет мир');
    assert.strictEqual(repairMojibakeText('12345'), '12345');
    assert.strictEqual(repairMojibakeText(''), '');
  });

  test('repairs fully encoded mojibake (CP1252 misinterpreted as UTF-8)', () => {
    assert.strictEqual(repairMojibakeText('ÐŸÑ€Ð¸Ð²ÐµÑ‚'), 'Привет'); // Привет
    assert.strictEqual(repairMojibakeText('Ð–Ð°Ð»Ð¾Ð±Ñ‹ Ð½Ð° Ð±Ð¾Ð»ÑŒ'), 'Жалобы на боль'); // Жалобы на боль
    assert.strictEqual(repairMojibakeText('ÐšÐ°Ñ€Ð¸ÐµÑ'), 'Кариес'); // Кариес
    assert.strictEqual(repairMojibakeText('Ð—ÑƒÐ±'), 'Зуб'); // Зуб
  });

  test('repairs partially encoded mojibake (by token)', () => {
    // These strings contain space-separated tokens where some are mojibake and some are not
    assert.strictEqual(repairMojibakeText('Hello ÐŸÑ€Ð¸Ð²ÐµÑ‚'), 'Hello Привет');
    assert.strictEqual(repairMojibakeText('Ð—ÑƒÐ± 123 ÐšÐ°Ñ€Ð¸ÐµÑ'), 'Зуб 123 Кариес');
    assert.strictEqual(repairMojibakeText('Normal ÐŸÑ€Ð¸Ð²ÐµÑ‚ Text'), 'Normal Привет Text');
  });

  test('leaves string unchanged if decoding produces replacement characters or no improvement', () => {
    // Strings that contain mojibake marker characters but decoding them isn't actually valid CP1252 -> UTF-8
    assert.strictEqual(repairMojibakeText('Ã. some text'), 'Ã. some text');
    assert.strictEqual(repairMojibakeText('Ñ.'), 'Ñ.');
    // Let's ensure a string with mixed valid marker but invalid full sequence isn't butchered
    assert.strictEqual(repairMojibakeText('ÐŸÑ. invalid'), 'ÐŸÑ. invalid');
  });
});

describe('repairMojibakeDeep', () => {
  test('returns unmodified non-string primitives', () => {
    assert.strictEqual(repairMojibakeDeep(123), 123);
    assert.strictEqual(repairMojibakeDeep(true), true);
    assert.strictEqual(repairMojibakeDeep(null), null);
    assert.strictEqual(repairMojibakeDeep(undefined), undefined);
  });

  test('repairs strings deeply nested in arrays', () => {
    const input = ['Hello', 'ÐŸÑ€Ð¸Ð²ÐµÑ‚', 123, ['Ð—ÑƒÐ±']];
    const expected = ['Hello', 'Привет', 123, ['Зуб']];
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('repairs strings deeply nested in objects', () => {
    const input = {
      name: 'ÐŸÑ€Ð¸Ð²ÐµÑ‚',
      age: 30,
      nested: {
        diagnosis: 'ÐšÐ°Ñ€Ð¸ÐµÑ',
        notes: ['Normal', 'Ð—ÑƒÐ±']
      }
    };
    const expected = {
      name: 'Привет',
      age: 30,
      nested: {
        diagnosis: 'Кариес',
        notes: ['Normal', 'Зуб']
      }
    };
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });
});
