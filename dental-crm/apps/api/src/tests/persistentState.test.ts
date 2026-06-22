import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getPersistentStateIntegrityReport, savePersistentState } from '../persistentState.js';

describe('getPersistentStateIntegrityReport', () => {
  let tmpDir: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dental-crm-test-'));

    process.env.DENTAL_STATE_FILE = path.join(tmpDir, 'state.json');
    process.env.DENTAL_STATE_BACKUP_DIR = path.join(tmpDir, 'backups');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.env = originalEnv;
  });

  test('reports persistence_disabled when persistence is off', () => {
    process.env.DENTAL_STATE_PERSISTENCE = 'off';

    const report = getPersistentStateIntegrityReport();

    assert.strictEqual(report.ok, false);
    assert.strictEqual(report.meta.enabled, false);
    assert.ok(report.warnings.some(w => w.includes('Серверное сохранение состояния выключено')));
  });

  test('reports state_file_missing when file does not exist', () => {
    process.env.DENTAL_STATE_PERSISTENCE = 'on';

    const report = getPersistentStateIntegrityReport();

    assert.strictEqual(report.ok, false);
    assert.strictEqual(report.meta.exists, false);
    assert.ok(report.warnings.some(w => w.includes('Файл состояния еще не создан')));
  });

  test('reports state_file_unreadable when file contains invalid JSON', () => {
    process.env.DENTAL_STATE_PERSISTENCE = 'on';
    fs.writeFileSync(process.env.DENTAL_STATE_FILE!, 'not valid json');

    const report = getPersistentStateIntegrityReport();

    assert.strictEqual(report.ok, false);
    assert.strictEqual(report.meta.exists, true);
    assert.ok(report.warnings.some(w => w.includes('Файл состояния не читается')));
  });

  test('reports state_checksum_mismatch when checksum is invalid', () => {
    process.env.DENTAL_STATE_PERSISTENCE = 'on';
    const invalidState = {
      version: 1,
      savedAt: new Date().toISOString(),
      checksum: 'invalid-checksum',
      state: {
        clinicProfile: {
          name: 'Test Clinic',
          currency: 'RUB',
          timezone: 'Europe/Moscow',
          country: 'RU'
        },
        staffMembers: [], chairs: [], appointments: [], patients: [], documents: [],
        clinicalRules: [], payments: [], communicationTasks: [], communicationEvents: [],
        imagingStudies: [], imagingViewerSessions: [], dicomWorkbenchBundles: [],
        importBatches: [], auditEvents: [], aiRecognitionJobs: [], speechTranscriptionChunks: [],
        visitDraftAutosaves: [], visitSaveReceipts: [], denteTelegramLinkCodes: [],
        denteTelegramChatLinks: [], denteTelegramWebhookEvents: [], denteTelegramOutboxDeliveryReceipts: [],
        uiPreferences: null,
        activeVisit: null,
        denteTelegramBotSettings: { token: null, webhookUrl: null, webhookSecret: null }
      }
    };
    fs.writeFileSync(process.env.DENTAL_STATE_FILE!, JSON.stringify(invalidState));

    const report = getPersistentStateIntegrityReport();

    assert.strictEqual(report.ok, false);
    assert.strictEqual(report.meta.exists, true);
    assert.strictEqual(report.checksumVerified, false);
    assert.ok(report.warnings.some(w => w.includes('Контрольная сумма файла состояния не совпала')));
  });

  test('reports ok when valid state exists', () => {
    process.env.DENTAL_STATE_PERSISTENCE = 'on';
    const validState = {
      clinicProfile: {
        name: 'Test Clinic',
        currency: 'RUB',
        timezone: 'Europe/Moscow',
        country: 'RU'
      },
      staffMembers: [], chairs: [], appointments: [], patients: [], documents: [],
      clinicalRules: [], payments: [], communicationTasks: [], communicationEvents: [],
      imagingStudies: [], imagingViewerSessions: [], dicomWorkbenchBundles: [],
      importBatches: [], auditEvents: [], aiRecognitionJobs: [], speechTranscriptionChunks: [],
      visitDraftAutosaves: [], visitSaveReceipts: [], denteTelegramLinkCodes: [],
      denteTelegramChatLinks: [], denteTelegramWebhookEvents: [], denteTelegramOutboxDeliveryReceipts: [],
      uiPreferences: null,
      activeVisit: null,
      denteTelegramBotSettings: { token: null, webhookUrl: null, webhookSecret: null }
    };

    // Use the actual save function to ensure correct checksum generation
    savePersistentState(validState as any);

    const report = getPersistentStateIntegrityReport();

    assert.strictEqual(report.ok, true);
    assert.strictEqual(report.meta.exists, true);
    assert.strictEqual(report.checksumVerified, true);
    assert.strictEqual(report.warnings.length, 0);
  });
});
