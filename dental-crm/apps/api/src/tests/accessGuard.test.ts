import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { configuredClinicalAccessSecret, configuredClinicalMutationSecret } from '../accessGuard.js';

describe('accessGuard Configuration Secrets', () => {
  const originalSecret = process.env.DENTE_CLINICAL_ADMIN_SECRET;

  afterEach(() => {
    if (originalSecret !== undefined) {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = originalSecret;
    } else {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
    }
  });

  describe('configuredClinicalAccessSecret', () => {
    test('returns null when secret is not set', () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      assert.strictEqual(configuredClinicalAccessSecret(), null);
    });

    test('returns null when secret is an empty string', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '';
      assert.strictEqual(configuredClinicalAccessSecret(), null);
    });

    test('returns null when secret contains only whitespaces', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '   ';
      assert.strictEqual(configuredClinicalAccessSecret(), null);
    });

    test('returns the trimmed secret when set', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '  my-secret  ';
      assert.strictEqual(configuredClinicalAccessSecret(), 'my-secret');
    });

    test('returns the secret when set without spaces', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'my-secret';
      assert.strictEqual(configuredClinicalAccessSecret(), 'my-secret');
    });
  });

  describe('configuredClinicalMutationSecret', () => {
    test('returns null when secret is not set', () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      assert.strictEqual(configuredClinicalMutationSecret(), null);
    });

    test('returns null when secret is an empty string', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '';
      assert.strictEqual(configuredClinicalMutationSecret(), null);
    });

    test('returns null when secret contains only whitespaces', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '   ';
      assert.strictEqual(configuredClinicalMutationSecret(), null);
    });

    test('returns the trimmed secret when set', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '  my-secret-mutation  ';
      assert.strictEqual(configuredClinicalMutationSecret(), 'my-secret-mutation');
    });
  });
});
