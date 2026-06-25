import { test, describe } from 'node:test';
import assert from 'node:assert';
import { inferSpecialtyFromText } from './visitSpecialtyData.js';

describe('inferSpecialtyFromText', () => {
  test('returns null for null, undefined, or empty string', () => {
    assert.strictEqual(inferSpecialtyFromText(null), null);
    assert.strictEqual(inferSpecialtyFromText(undefined), null);
    assert.strictEqual(inferSpecialtyFromText(''), null);
    assert.strictEqual(inferSpecialtyFromText('   '), null);
  });

  test('correctly infers therapist', () => {
    assert.strictEqual(inferSpecialtyFromText('Лечение кариеса'), 'therapist');
    assert.strictEqual(inferSpecialtyFromText('пульпит'), 'therapist');
    assert.strictEqual(inferSpecialtyFromText('эндодонтия'), 'therapist');
  });

  test('correctly infers radiologist', () => {
    assert.strictEqual(inferSpecialtyFromText('рентгеновский снимок'), 'radiologist');
    assert.strictEqual(inferSpecialtyFromText('КТ челюсти'), 'radiologist');
    assert.strictEqual(inferSpecialtyFromText('ОПТГ'), 'radiologist');
  });

  test('correctly infers universal', () => {
    assert.strictEqual(inferSpecialtyFromText('первичный осмотр'), 'universal');
    assert.strictEqual(inferSpecialtyFromText('консультация'), 'universal');
  });

  test('correctly infers implantologist', () => {
    assert.strictEqual(inferSpecialtyFromText('установка импланта'), 'implantologist');
    assert.strictEqual(inferSpecialtyFromText('синус-лифтинг'), 'implantologist');
  });

  test('correctly infers orthodontist', () => {
    assert.strictEqual(inferSpecialtyFromText('брекеты'), 'orthodontist');
    assert.strictEqual(inferSpecialtyFromText('исправление прикуса'), 'orthodontist');
  });

  test('correctly infers orthopedist', () => {
    assert.strictEqual(inferSpecialtyFromText('коронка'), 'orthopedist');
    assert.strictEqual(inferSpecialtyFromText('слепок'), 'orthopedist');
  });

  test('correctly infers surgeon', () => {
    assert.strictEqual(inferSpecialtyFromText('удаление зуба'), 'surgeon');
    assert.strictEqual(inferSpecialtyFromText('снять шов'), 'surgeon');
  });

  test('correctly infers periodontist', () => {
    assert.strictEqual(inferSpecialtyFromText('кровоточивость десен'), 'periodontist');
    assert.strictEqual(inferSpecialtyFromText('пародонтит'), 'periodontist');
  });

  test('correctly infers hygienist', () => {
    assert.strictEqual(inferSpecialtyFromText('профессиональная чистка'), 'hygienist');
    assert.strictEqual(inferSpecialtyFromText('Air Flow'), 'hygienist');
  });

  test('returns null for unmatched text', () => {
    assert.strictEqual(inferSpecialtyFromText('просто текст'), null);
    assert.strictEqual(inferSpecialtyFromText('непонятно что'), null);
    assert.strictEqual(inferSpecialtyFromText('отбеливание'), null);
  });

  test('is case insensitive', () => {
    assert.strictEqual(inferSpecialtyFromText('КАРИЕС'), 'therapist');
    assert.strictEqual(inferSpecialtyFromText('Кт'), 'radiologist');
    assert.strictEqual(inferSpecialtyFromText('КОНСУЛЬТАЦИЯ'), 'universal');
  });
});
