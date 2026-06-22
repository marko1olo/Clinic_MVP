import { test, describe } from 'node:test';
import assert from 'node:assert';
import { repairMojibakeDeep } from '../text/repairMojibake.js';

describe('repairMojibakeDeep', () => {
  test('should repair plain strings', () => {
    assert.strictEqual(repairMojibakeDeep('ÐŸÑ€Ð¸Ð²ÐµÑ‚'), 'Привет');
    assert.strictEqual(repairMojibakeDeep('hello world'), 'hello world');
  });

  test('should repair strings in arrays', () => {
    assert.deepStrictEqual(
      repairMojibakeDeep(['ÐŸÑ€Ð¸Ð²ÐµÑ‚', 'hello']),
      ['Привет', 'hello']
    );
  });

  test('should repair strings in objects', () => {
    assert.deepStrictEqual(
      repairMojibakeDeep({ message: 'ÐŸÑ€Ð¸Ð²ÐµÑ‚', other: 'hello' }),
      { message: 'Привет', other: 'hello' }
    );
  });

  test('should repair strings in deep nested structures', () => {
    assert.deepStrictEqual(
      repairMojibakeDeep({
        data: {
          items: [
            { text: 'ÐŸÑ€Ð¸Ð²ÐµÑ‚' },
            { text: 'normal' }
          ],
          nestedArray: ['ÐŸÑ€Ð¸Ð²ÐµÑ‚']
        }
      }),
      {
        data: {
          items: [
            { text: 'Привет' },
            { text: 'normal' }
          ],
          nestedArray: ['Привет']
        }
      }
    );
  });

  test('should handle primitives without modifying them', () => {
    assert.strictEqual(repairMojibakeDeep(null), null);
    assert.strictEqual(repairMojibakeDeep(undefined), undefined);
    assert.strictEqual(repairMojibakeDeep(123), 123);
    assert.strictEqual(repairMojibakeDeep(0), 0);
    assert.strictEqual(repairMojibakeDeep(true), true);
    assert.strictEqual(repairMojibakeDeep(false), false);
  });

  test('should handle empty objects and arrays', () => {
    assert.deepStrictEqual(repairMojibakeDeep({}), {});
    assert.deepStrictEqual(repairMojibakeDeep([]), []);
  });
});
