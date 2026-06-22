import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  patientStatusSchema,
  appointmentStatusSchema,
  visitStatusSchema
} from '../index.js';

describe('Shared Zod Schemas', () => {

  describe('patientStatusSchema', () => {
    test('should parse valid patient statuses', () => {
      assert.strictEqual(patientStatusSchema.safeParse('active').success, true);
      assert.strictEqual(patientStatusSchema.safeParse('archived').success, true);
    });

    test('should reject invalid patient statuses', () => {
      assert.strictEqual(patientStatusSchema.safeParse('unknown').success, false);
      assert.strictEqual(patientStatusSchema.safeParse('').success, false);
      assert.strictEqual(patientStatusSchema.safeParse(null).success, false);
      assert.strictEqual(patientStatusSchema.safeParse(123).success, false);
    });
  });

  describe('appointmentStatusSchema', () => {
    test('should parse valid appointment statuses', () => {
      const validStatuses = [
        "planned",
        "confirmed",
        "arrived",
        "in_treatment",
        "completed",
        "cancelled",
        "no_show"
      ];

      for (const status of validStatuses) {
        assert.strictEqual(
          appointmentStatusSchema.safeParse(status).success,
          true,
          `Should successfully parse "${status}"`
        );
      }
    });

    test('should reject invalid appointment statuses', () => {
      assert.strictEqual(appointmentStatusSchema.safeParse('pending').success, false);
      assert.strictEqual(appointmentStatusSchema.safeParse('PLANNED').success, false); // Case sensitive
      assert.strictEqual(appointmentStatusSchema.safeParse('').success, false);
      assert.strictEqual(appointmentStatusSchema.safeParse(null).success, false);
    });
  });

  describe('visitStatusSchema', () => {
    test('should parse valid visit statuses', () => {
      assert.strictEqual(visitStatusSchema.safeParse('draft').success, true);
      assert.strictEqual(visitStatusSchema.safeParse('signed').success, true);
      assert.strictEqual(visitStatusSchema.safeParse('voided').success, true);
    });

    test('should reject invalid visit statuses', () => {
      assert.strictEqual(visitStatusSchema.safeParse('drafted').success, false);
      assert.strictEqual(visitStatusSchema.safeParse('completed').success, false);
      assert.strictEqual(visitStatusSchema.safeParse('').success, false);
      assert.strictEqual(visitStatusSchema.safeParse(null).success, false);
    });
  });

});
