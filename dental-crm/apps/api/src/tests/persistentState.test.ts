import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { getPersistentStateMeta, savePersistentState } from "../persistentState.js";

describe("persistentState", () => {
  let tempDir: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dental-crm-test-"));
    process.env = { ...originalEnv };
    process.env.DENTAL_STATE_FILE = path.join(tempDir, "state.json");
    process.env.DENTAL_STATE_BACKUP_DIR = path.join(tempDir, "backups");
    process.env.DENTAL_STATE_BACKUPS = "5";
  });

  afterEach(() => {
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("getPersistentStateMeta", () => {
    it("returns correct metadata when no state file exists", () => {
      const meta = getPersistentStateMeta();
      assert.strictEqual(meta.enabled, true); // Assuming persistenceEnabled is true by default or depends on another env var
      assert.strictEqual(meta.exists, false);
      assert.strictEqual(meta.version, null);
      assert.strictEqual(meta.savedAt, null);
      assert.strictEqual(meta.checksum, null);
      assert.strictEqual(meta.backupCount, 0);
      assert.strictEqual(meta.latestBackupAt, null);
      assert.strictEqual(meta.latestBackupSizeBytes, null);
      assert.strictEqual(meta.maxBackupCount, 5);
      assert.strictEqual(meta.filePath, path.join(tempDir, "state.json"));
      assert.strictEqual(meta.backupDirectoryPath, path.join(tempDir, "backups"));
    });

    it("returns correct metadata when state file exists and backups are created", () => {
      const mockState = {
        clinicProfile: { id: "1", name: "Test Clinic", description: "A test clinic", currency: "USD", timeZone: "UTC", contactEmail: "test@example.com", contactPhone: "123456789", address: "123 Test St", websiteUrl: "example.com", workingHours: [], defaultAppointmentDurationMinutes: 30, enableSmsNotifications: false, enableEmailNotifications: false },
        staffMembers: [],
        chairs: [],
        appointments: [],
        patients: [],
        documents: [],
        clinicalRules: [],
        payments: [],
        communicationTasks: [],
        communicationEvents: [],
        imagingStudies: [],
        imagingViewerSessions: [],
        dicomWorkbenchBundles: [],
        importBatches: [],
        auditEvents: [],
        aiRecognitionJobs: [],
        speechTranscriptionChunks: [],
        visitDraftAutosaves: [],
        visitSaveReceipts: [],
        denteTelegramLinkCodes: [],
        denteTelegramChatLinks: [],
        denteTelegramWebhookEvents: [],
        denteTelegramOutboxDeliveryReceipts: [],
      };

      // Save the state to create the file and trigger backup logic
      savePersistentState(mockState);

      const meta = getPersistentStateMeta();
      assert.strictEqual(meta.enabled, true);
      assert.strictEqual(meta.exists, true);
      assert.strictEqual(meta.version, 1);
      assert.ok(meta.savedAt);
      assert.ok(meta.checksum);

      // When saving for the first time, it might not create a backup if the original didn't exist yet,
      // because rotateStateBackup copies existing state BEFORE saving.
      // So we save again to ensure a backup is created
      savePersistentState(mockState);

      const meta2 = getPersistentStateMeta();
      assert.strictEqual(meta2.backupCount, 1);
      assert.ok(meta2.latestBackupAt);
      assert.ok(meta2.latestBackupSizeBytes);
    });

    it("handles persistence disabled state", () => {
      process.env.DENTAL_STATE_PERSISTENCE = "off";
      const meta = getPersistentStateMeta();
      assert.strictEqual(meta.enabled, false);
      assert.strictEqual(meta.exists, false);
    });
  });
});
