import { test, describe } from 'node:test';
import assert from 'node:assert';
import { repairMojibakeText, repairMojibakeDeep } from '../text/repairMojibake.js';

describe('repairMojibakeText', () => {
  test('returns normal ascii strings unchanged', () => {
    const input = "Hello world!";
    assert.strictEqual(repairMojibakeText(input), input);
  });

  test('returns normal cyrillic strings unchanged', () => {
    const input = "Привет, мир!";
    assert.strictEqual(repairMojibakeText(input), input);
  });

  test('repairs fully mangled cyrillic mojibake', () => {
    const input = "Ð\u0098Ð²Ð°Ð½"; // Иван
    const expected = "Иван";
    assert.strictEqual(repairMojibakeText(input), expected);
  });

  test('repairs token-mixed strings with mojibake', () => {
    const input = "Hello Ð\u0098Ð²Ð°Ð½";
    const expected = "Hello Иван";
    assert.strictEqual(repairMojibakeText(input), expected);
  });

<<<<<<< HEAD
  test('repairs various common mojibake strings', () => {
    assert.strictEqual(repairMojibakeText("ÐŸÑ€Ð¸Ð²ÐµÑ‚"), "Привет");
    assert.strictEqual(repairMojibakeText("Hello ÐŸÑ€Ð¸Ð²ÐµÑ‚ world"), "Hello Привет world");
    assert.strictEqual(repairMojibakeText("ÐœÐ¸Ñ€"), "Мир");
    assert.strictEqual(repairMojibakeText("Ð—Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ðº"), "Заголовок");
    assert.strictEqual(repairMojibakeText("ÐžÐ¿Ð¸Ñ\u0081Ð°Ð½Ð¸Ðµ"), "Описание");
  });

  test('gracefully handles likely mojibake that cannot be decoded', () => {
    const input = "?\u0300\u0301\u0302 invalid";
    assert.strictEqual(repairMojibakeText(input), input);
  test('returns unmodified text if likelyMojibake is false', () => {
    assert.strictEqual(repairMojibakeText('Hello World'), 'Hello World');
    assert.strictEqual(repairMojibakeText('Привет мир'), 'Привет мир');
    assert.strictEqual(repairMojibakeText('12345'), '12345');
    assert.strictEqual(repairMojibakeText(''), '');

  test('repairs fully encoded mojibake (CP1252 misinterpreted as UTF-8)', () => {
    assert.strictEqual(repairMojibakeText('ÐŸÑ€Ð¸Ð²ÐµÑ‚'), 'Привет'); // Привет
    assert.strictEqual(repairMojibakeText('Ð–Ð°Ð»Ð¾Ð±Ñ‹ Ð½Ð° Ð±Ð¾Ð»ÑŒ'), 'Жалобы на боль'); // Жалобы на боль
    assert.strictEqual(repairMojibakeText('ÐšÐ°Ñ€Ð¸ÐµÑ'), 'Кариес'); // Кариес
    assert.strictEqual(repairMojibakeText('Ð—ÑƒÐ±'), 'Зуб'); // Зуб

  test('repairs partially encoded mojibake (by token)', () => {
    // These strings contain space-separated tokens where some are mojibake and some are not
    assert.strictEqual(repairMojibakeText('Hello ÐŸÑ€Ð¸Ð²ÐµÑ‚'), 'Hello Привет');
    assert.strictEqual(repairMojibakeText('Ð—ÑƒÐ± 123 ÐšÐ°Ñ€Ð¸ÐµÑ'), 'Зуб 123 Кариес');
    assert.strictEqual(repairMojibakeText('Normal ÐŸÑ€Ð¸Ð²ÐµÑ‚ Text'), 'Normal Привет Text');

  test('leaves string unchanged if decoding produces replacement characters or no improvement', () => {
    // Strings that contain mojibake marker characters but decoding them isn't actually valid CP1252 -> UTF-8
    assert.strictEqual(repairMojibakeText('Ã. some text'), 'Ã. some text');
    assert.strictEqual(repairMojibakeText('Ñ.'), 'Ñ.');
    // Let's ensure a string with mixed valid marker but invalid full sequence isn't butchered
    assert.strictEqual(repairMojibakeText('ÐŸÑ. invalid'), 'ÐŸÑ. invalid');
=======
  test('gracefully handles likely mojibake that cannot be decoded', () => {
    const input = "?\u0300\u0301\u0302 invalid";
    assert.strictEqual(repairMojibakeText(input), input);
>>>>>>> gitlab/main
  });
});

describe('repairMojibakeDeep', () => {
  test('repairs deep mojibake correctly', () => {
    const input = {
      name: "Ð\u0098Ð²Ð°Ð½", // Иван
      profile: {
        address: "Ð\u009CÐ¾Ñ\u0081ÐºÐ²Ð°", // Москва
        tags: ["Ð²Ñ\u0080Ð°Ñ\u0087", "Ð¿Ð°Ñ\u0086Ð¸ÐµÐ½Ñ\u0082"], // врач, пациент
        age: 30,
        isVerified: true,
        metadata: null
      },
      status: 200,
      active: true,
      data: null,
      history: [
        {
          date: "2023-01-01",
          note: "Ð\u009EÐ±Ñ\u0081Ð»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ", // Обследование
          details: {
            doctor: "Ð\u009FÐµÑ\u0082Ñ\u0080Ð¾Ð²" // Петров
          }
        }
      ]
    };

    const result = repairMojibakeDeep(input);

    assert.deepStrictEqual(result, {
      name: "Иван",
      profile: {
        address: "Москва",
        tags: ["врач", "пациент"],
        age: 30,
        isVerified: true,
        metadata: null
      },
      status: 200,
      active: true,
      data: null,
      history: [
        {
          date: "2023-01-01",
          note: "Обследование",
          details: {
            doctor: "Петров"
          }
        }
      ]
    });
  });

  test('does not modify non-string primitive values', () => {
    const input = {
      num: 42,
      bool: false,
      nil: null,
      undef: undefined,
      arr: [1, 2, 3]
    };

    const result = repairMojibakeDeep(input);
    assert.deepStrictEqual(result, input);
  test('returns unmodified non-string primitives', () => {
    assert.strictEqual(repairMojibakeDeep(123), 123);
    assert.strictEqual(repairMojibakeDeep(true), true);
    assert.strictEqual(repairMojibakeDeep(null), null);
    assert.strictEqual(repairMojibakeDeep(undefined), undefined);

  test('repairs strings deeply nested in arrays', () => {
    const input = ['Hello', 'ÐŸÑ€Ð¸Ð²ÐµÑ‚', 123, ['Ð—ÑƒÐ±']];
    const expected = ['Hello', 'Привет', 123, ['Зуб']];
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);

  test('repairs strings deeply nested in objects', () => {
      name: 'ÐŸÑ€Ð¸Ð²ÐµÑ‚',
      nested: {
        diagnosis: 'ÐšÐ°Ñ€Ð¸ÐµÑ',
        notes: ['Normal', 'Ð—ÑƒÐ±']
    const expected = {
      name: 'Привет',
      nested: {
        diagnosis: 'Кариес',
        notes: ['Normal', 'Зуб']
    assert.deepStrictEqual(repairMojibakeDeep(input), expected);
import { repairMojibakeDeep } from '../text/repairMojibake.js';

  test('should repair plain strings', () => {
    assert.strictEqual(repairMojibakeDeep('ÐŸÑ€Ð¸Ð²ÐµÑ‚'), 'Привет');
    assert.strictEqual(repairMojibakeDeep('hello world'), 'hello world');

  test('should repair strings in arrays', () => {
    assert.deepStrictEqual(
      repairMojibakeDeep(['ÐŸÑ€Ð¸Ð²ÐµÑ‚', 'hello']),
      ['Привет', 'hello']
    );

  test('should repair strings in objects', () => {
    assert.deepStrictEqual(
      repairMojibakeDeep({ message: 'ÐŸÑ€Ð¸Ð²ÐµÑ‚', other: 'hello' }),
      { message: 'Привет', other: 'hello' }
    );

  test('should repair strings in deep nested structures', () => {
    assert.deepStrictEqual(
      repairMojibakeDeep({
        data: {
          items: [
            { text: 'ÐŸÑ€Ð¸Ð²ÐµÑ‚' },
            { text: 'normal' }
          ],
          nestedArray: ['ÐŸÑ€Ð¸Ð²ÐµÑ‚']
      }),
        data: {
          items: [
            { text: 'Привет' },
            { text: 'normal' }
          ],
          nestedArray: ['Привет']
    );

  test('should handle primitives without modifying them', () => {
    assert.strictEqual(repairMojibakeDeep(0), 0);
    assert.strictEqual(repairMojibakeDeep(false), false);

  test('should handle empty objects and arrays', () => {
    assert.deepStrictEqual(repairMojibakeDeep({}), {});
    assert.deepStrictEqual(repairMojibakeDeep([]), []);
  });
});
