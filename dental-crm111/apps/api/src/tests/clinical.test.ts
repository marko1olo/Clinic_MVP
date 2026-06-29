import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createDenteApiApp } from '../server.js';
import type { FastifyInstance } from 'fastify';

describe('Clinical Routes', () => {
  const originalReadsAllowed = process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_READS;
  let app: FastifyInstance | null = null;

  beforeEach(async () => {
    process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_READS = '1';
    app = await createDenteApiApp({ startTelegramWorker: false });
  });

  afterEach(async () => {
    if (originalReadsAllowed !== undefined) {
      process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_READS = originalReadsAllowed;
    } else {
      delete process.env.DENTE_CLINICAL_ALLOW_UNGUARDED_READS;
    }

    if (app) {
      await app.close();
      app = null;
    }
  });

  describe('POST /api/clinical/rules/evaluate', () => {
    const clinicalRuleEvaluationValidationMessage = "Клинические правила не проверены: передайте пациента, визит и факты приема.";

    test('returns 400 when payload is missing', async () => {
      const response = await app!.inject({
        method: 'POST',
        url: '/api/clinical/rules/evaluate',
        payload: {} // Using empty object instead of undefined to satisfy InjectPayload type
      });

      assert.strictEqual(response.statusCode, 400);
      const json = response.json();
      assert.strictEqual(json.message, clinicalRuleEvaluationValidationMessage);
    });

    test('returns 400 when patientId is not a UUID', async () => {
      const response = await app!.inject({
        method: 'POST',
        url: '/api/clinical/rules/evaluate',
        payload: {
          patientId: 'not-a-uuid',
          serviceIds: ['service-1']
        }
      });

      assert.strictEqual(response.statusCode, 400);
      const json = response.json();
      assert.strictEqual(json.message, clinicalRuleEvaluationValidationMessage);
    });

    test('returns 400 when serviceIds array is empty', async () => {
      const response = await app!.inject({
        method: 'POST',
        url: '/api/clinical/rules/evaluate',
        payload: {
          patientId: '11111111-1111-4111-8111-111111111111',
          serviceIds: []
        }
      });

      assert.strictEqual(response.statusCode, 400);
      const json = response.json();
      assert.strictEqual(json.message, clinicalRuleEvaluationValidationMessage);
    });
  });
});
