import { test, describe } from 'node:test';
import assert from 'node:assert';
import { documentRequiresPaidRecord, documentKindSchema, legacyTaxDeductionCertificateMinYear, legacyTaxDeductionCertificateMaxYear, taxDeductionCertificateMinYear } from '../index.js';

describe('documentRequiresPaidRecord', () => {
  test('returns expected boolean for different document kinds', () => {
    // Requires paid record
    assert.strictEqual(documentRequiresPaidRecord('completed_works_act'), true);
    assert.strictEqual(documentRequiresPaidRecord('tax_deduction_certificate'), true);
    assert.strictEqual(documentRequiresPaidRecord('payment_receipt'), true);
    assert.strictEqual(documentRequiresPaidRecord('payment_refund_correction_request'), true);
    assert.strictEqual(documentRequiresPaidRecord('legacy_tax_deduction_certificate'), true);
    assert.strictEqual(documentRequiresPaidRecord('tax_deduction_registry'), true);

    // Doesn't require paid record
    assert.strictEqual(documentRequiresPaidRecord('paid_medical_services_contract'), false);
    assert.strictEqual(documentRequiresPaidRecord('treatment_plan'), false);
    assert.strictEqual(documentRequiresPaidRecord('payment_invoice'), false);
    assert.strictEqual(documentRequiresPaidRecord('informed_consent'), false);
    assert.strictEqual(documentRequiresPaidRecord('prescription_medication_order'), false);
    assert.strictEqual(documentRequiresPaidRecord('lab_work_order'), false);
  });

  test('handles all valid document kinds without throwing', () => {
    for (const kind of documentKindSchema.options) {
      const result = documentRequiresPaidRecord(kind);
      assert.strictEqual(typeof result, 'boolean');
    }
  });
});

describe('Tax Deduction Certificate Years', () => {
  test('legacyTaxDeductionCertificateMinYear is defined and has correct value', () => {
    assert.strictEqual(legacyTaxDeductionCertificateMinYear, 2021);
  });

  test('legacyTaxDeductionCertificateMaxYear is defined and has correct value', () => {
    assert.strictEqual(legacyTaxDeductionCertificateMaxYear, 2023);
  });

  test('taxDeductionCertificateMinYear is defined and has correct value', () => {
    assert.strictEqual(taxDeductionCertificateMinYear, 2024);
  });

  test('legacy min year is less than or equal to legacy max year', () => {
    assert.ok(legacyTaxDeductionCertificateMinYear <= legacyTaxDeductionCertificateMaxYear);
  });

  test('new min year is greater than legacy max year', () => {
    assert.ok(taxDeductionCertificateMinYear > legacyTaxDeductionCertificateMaxYear);
  });
});
