import { test, describe } from 'node:test';
import assert from 'node:assert';
import { resolveMprClinicalPresetProjection } from '../mprClinicalStatus.js';

describe('resolveMprClinicalPresetProjection', () => {
  test('returns projection when availableProjections is undefined', () => {
    assert.strictEqual(resolveMprClinicalPresetProjection('axial', undefined), 'axial');
  });

  test('returns projection when availableProjections is empty', () => {
    assert.strictEqual(resolveMprClinicalPresetProjection('axial', []), 'axial');
  });

  test('returns projection when it is included in availableProjections', () => {
    assert.strictEqual(resolveMprClinicalPresetProjection('coronal', ['axial', 'coronal', 'sagittal']), 'coronal');
  });

  test('returns "coronal" when projection is "panoramic_reconstruction" and "coronal" is available', () => {
    assert.strictEqual(resolveMprClinicalPresetProjection('panoramic_reconstruction', ['axial', 'coronal']), 'coronal');
  });

  test('returns "axial" when projection is not available but "axial" is available', () => {
    assert.strictEqual(resolveMprClinicalPresetProjection('coronal', ['sagittal', 'axial']), 'axial');
  });

  test('returns the first available projection when "axial" is not available and panoramic rules do not apply', () => {
    assert.strictEqual(resolveMprClinicalPresetProjection('coronal', ['sagittal', 'other']), 'sagittal');
  });
});
