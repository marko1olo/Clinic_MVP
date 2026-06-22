import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  patientStatusSchema,
  appointmentStatusSchema,
  visitStatusSchema,
  documentKindSchema
} from '../index.js';

describe('Shared Schemas', () => {
  describe('patientStatusSchema', () => {
    test('validates "active" status', () => {
      const result = patientStatusSchema.safeParse('active');
      assert.strictEqual(result.success, true);
    });

    test('validates "archived" status', () => {
      const result = patientStatusSchema.safeParse('archived');
      assert.strictEqual(result.success, true);
    });

    test('fails on invalid status', () => {
      const result = patientStatusSchema.safeParse('deleted');
      assert.strictEqual(result.success, false);
    });
  });

  describe('appointmentStatusSchema', () => {
    test('validates valid statuses', () => {
      const validStatuses = [
        "planned", "confirmed", "arrived", "in_treatment", "completed", "cancelled", "no_show"
      ];
      for (const status of validStatuses) {
        const result = appointmentStatusSchema.safeParse(status);
        assert.strictEqual(result.success, true);
      }
    });

    test('fails on invalid status', () => {
      const result = appointmentStatusSchema.safeParse('rescheduled');
      assert.strictEqual(result.success, false);
    });
  });

  describe('visitStatusSchema', () => {
    test('validates valid statuses', () => {
      const validStatuses = ["draft", "signed", "voided"];
      for (const status of validStatuses) {
        const result = visitStatusSchema.safeParse(status);
        assert.strictEqual(result.success, true);
      }
    });

    test('fails on invalid status', () => {
      const result = visitStatusSchema.safeParse('pending');
      assert.strictEqual(result.success, false);
    });
  });

  describe('documentKindSchema', () => {
    test('validates valid document kinds', () => {
      const validKinds = [
        "paid_medical_services_contract",
        "completed_works_act",
        "tax_deduction_certificate"
      ];
      for (const kind of validKinds) {
        const result = documentKindSchema.safeParse(kind);
        assert.strictEqual(result.success, true);
      }
    });

    test('fails on invalid document kind', () => {
      const result = documentKindSchema.safeParse('random_document');
      assert.strictEqual(result.success, false);
    });
  });
});
