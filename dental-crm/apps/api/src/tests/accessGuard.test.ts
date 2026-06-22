import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  denteAdminSecretHeader,
  configuredClinicalAccessSecret,
  configuredClinicalMutationSecret,
  requireClinicalMutationAccess,
  requireClinicalReadAccess,
} from '../accessGuard.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

describe('accessGuard', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  const createMockReply = () => {
    const reply = {
      statusCode: 200,
      payload: null as any,
      code: function (code: number) {
        this.statusCode = code;
        return this;
      },
      send: function (payload: any) {
        this.payload = payload;
        return this;
      },
    } as unknown as FastifyReply;
    return reply;
  };

  const createMockRequest = (headers: Record<string, string | string[] | undefined> = {}) => {
    return {
      headers,
    } as unknown as FastifyRequest;
  };

  describe('configuredClinicalAccessSecret', () => {
    test('returns null when secret is not set', () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      assert.strictEqual(configuredClinicalAccessSecret(), null);
    });

    test('returns trimmed secret when set', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '  my-secret  ';
      assert.strictEqual(configuredClinicalAccessSecret(), 'my-secret');
    });
  });

  describe('configuredClinicalMutationSecret', () => {
    test('returns null when secret is not set', () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      assert.strictEqual(configuredClinicalMutationSecret(), null);
    });

    test('returns trimmed secret when set', () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = '  my-mutation-secret  ';
      assert.strictEqual(configuredClinicalMutationSecret(), 'my-mutation-secret');
    });
  });

  describe('requireClinicalMutationAccess', () => {
    test('returns false and 503 when secret not configured and unguarded not allowed', async () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      process.env.NODE_ENV = 'production'; // Disable unguarded
      const reply = createMockReply();
      const request = createMockRequest();

      const result = await requireClinicalMutationAccess(request, reply);
      assert.strictEqual(result, false);
      assert.strictEqual(reply.statusCode, 503);
      assert.strictEqual((reply as any).payload.error, 'ClinicalAdminSecretMissing');
    });

    test('returns true when secret not configured but unguarded allowed', async () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      process.env.NODE_ENV = 'development';
      process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_MUTATIONS = '1';
      const reply = createMockReply();
      const request = createMockRequest();

      const result = await requireClinicalMutationAccess(request, reply);
      assert.strictEqual(result, true);
    });

    test('returns false and 403 when secret is configured but header is missing', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest();

      const result = await requireClinicalMutationAccess(request, reply);
      assert.strictEqual(result, false);
      assert.strictEqual(reply.statusCode, 403);
      assert.strictEqual((reply as any).payload.error, 'ClinicalAdminSecretRequired');
    });

    test('returns true when secret is configured and header matches (string)', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest({
        [denteAdminSecretHeader]: 'secret123',
      });

      const result = await requireClinicalMutationAccess(request, reply);
      assert.strictEqual(result, true);
    });

    test('returns true when secret is configured and header matches (array)', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest({
        [denteAdminSecretHeader]: ['secret123', 'other'],
      });

      const result = await requireClinicalMutationAccess(request, reply);
      assert.strictEqual(result, true);
    });

    test('returns false and 403 when secret is configured but header does not match', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest({
        [denteAdminSecretHeader]: 'wrongsecret',
      });

      const result = await requireClinicalMutationAccess(request, reply);
      assert.strictEqual(result, false);
      assert.strictEqual(reply.statusCode, 403);
    });
  });

  describe('requireClinicalReadAccess', () => {
    test('returns false and 503 when secret not configured and unguarded not allowed', async () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      process.env.NODE_ENV = 'production'; // Disable unguarded
      const reply = createMockReply();
      const request = createMockRequest();

      const result = await requireClinicalReadAccess(request, reply);
      assert.strictEqual(result, false);
      assert.strictEqual(reply.statusCode, 503);
      assert.strictEqual((reply as any).payload.error, 'ClinicalReadSecretMissing');
    });

    test('returns true when secret not configured but unguarded allowed', async () => {
      delete process.env.DENTE_CLINICAL_ADMIN_SECRET;
      process.env.NODE_ENV = 'development';
      process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_READS = '1';
      const reply = createMockReply();
      const request = createMockRequest();

      const result = await requireClinicalReadAccess(request, reply);
      assert.strictEqual(result, true);
    });

    test('returns false and 403 when secret is configured but header is missing', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest();

      const result = await requireClinicalReadAccess(request, reply);
      assert.strictEqual(result, false);
      assert.strictEqual(reply.statusCode, 403);
      assert.strictEqual((reply as any).payload.error, 'ClinicalReadSecretRequired');
    });

    test('returns true when secret is configured and header matches (string)', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest({
        [denteAdminSecretHeader]: 'secret123',
      });

      const result = await requireClinicalReadAccess(request, reply);
      assert.strictEqual(result, true);
    });

    test('returns true when secret is configured and header matches (array)', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest({
        [denteAdminSecretHeader]: ['secret123', 'other'],
      });

      const result = await requireClinicalReadAccess(request, reply);
      assert.strictEqual(result, true);
    });

    test('returns false and 403 when secret is configured but header does not match', async () => {
      process.env.DENTE_CLINICAL_ADMIN_SECRET = 'secret123';
      const reply = createMockReply();
      const request = createMockRequest({
        [denteAdminSecretHeader]: 'wrongsecret',
      });

      const result = await requireClinicalReadAccess(request, reply);
      assert.strictEqual(result, false);
      assert.strictEqual(reply.statusCode, 403);
    });
  });
});
