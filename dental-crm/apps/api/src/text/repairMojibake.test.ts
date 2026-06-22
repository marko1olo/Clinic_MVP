import { test, describe } from 'node:test';
import assert from 'node:assert';
import { repairMojibakeText, repairMojibakeDeep } from './repairMojibake.js';

describe('repairMojibakeText', () => {
  test('returns original string if no mojibake detected', () => {
    const input = 'This is a normal string.';
    assert.strictEqual(repairMojibakeText(input), input);
  });

  test('repairs basic cp1252 mojibake', () => {
    // "Привет" wrongly encoded as cp1252 instead of utf-8
    const original = 'Привет';
    const mojibake = Buffer.from(original, 'utf8').toString('binary');
    assert.strictEqual(repairMojibakeText(mojibake), original);
  });

  test('repairs mojibake embedded in tokens', () => {
    const originalToken = 'Привет';
    const mojibakeToken = Buffer.from(originalToken, 'utf8').toString('binary');
    const input = `Patient says: ${mojibakeToken}`;
    const expected = `Patient says: ${originalToken}`;
    assert.strictEqual(repairMojibakeText(input), expected);
  });

  test('returns original string if repair results in invalid characters (contains \\uFFFD)', () => {
    // We want a string that matches likelyMojibake (/Ã.|Â.|Ð.|Ñ.|â./)
    // but when decoded as cp1252 bytes it produces invalid utf-8 sequences
    // 'Ã' is codePoint 195 (0xC3).
    // Let's create a string 'Ã\xC3'
    // This will be converted to bytes [0xC3, 0xC3]
    // Buffer.from([0xC3, 0xC3]).toString('utf8') results in replacement character \uFFFD
    const badInput = 'Ã\xC3';
    assert.strictEqual(repairMojibakeText(badInput), badInput);
  });

  test('returns original string if decoded string has fewer cyrillic characters and more mojibake markers', () => {
    const input = 'ÃÂÐÑâ'; // All markers, no cyrillic
    assert.strictEqual(repairMojibakeText(input), input);
  });
});

describe('repairMojibakeDeep', () => {
  test('handles primitive values correctly', () => {
    assert.strictEqual(repairMojibakeDeep(123), 123);
    assert.strictEqual(repairMojibakeDeep(true), true);
    assert.strictEqual(repairMojibakeDeep(null), null);
    assert.strictEqual(repairMojibakeDeep(undefined), undefined);
  });

  test('repairs strings directly', () => {
    const original = 'Привет';
    const mojibake = Buffer.from(original, 'utf8').toString('binary');
    assert.strictEqual(repairMojibakeDeep(mojibake), original);
  });

  test('deeply repairs arrays', () => {
    const original = 'Привет';
    const mojibake = Buffer.from(original, 'utf8').toString('binary');
    const input = [1, mojibake, [mojibake, true]];
    const expected = [1, original, [original, true]];
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });

  test('deeply repairs objects', () => {
    const original = 'Привет';
    const mojibake = Buffer.from(original, 'utf8').toString('binary');
    const input = {
      a: 1,
      b: mojibake,
      c: {
        d: mojibake,
        e: false
      }
    };
    const expected = {
      a: 1,
      b: original,
      c: {
        d: original,
        e: false
      }
    };
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
  });
});
