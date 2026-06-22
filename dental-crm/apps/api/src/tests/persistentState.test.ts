import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { writeFileSync, existsSync, unlinkSync, rmSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

import { loadPersistentState } from '../persistentState.js';

describe('loadPersistentState', () => {
  let tempDir: string;
  let tempFilePath: string;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Set up a temporary directory and file for testing
    tempDir = path.join(os.tmpdir(), `dental-crm-test-${Math.random().toString(36).substring(2, 9)}`);
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }
    tempFilePath = path.join(tempDir, 'state.json');

    process.env.DENTAL_STATE_PERSISTENCE = 'on';
    process.env.DENTAL_STATE_FILE = tempFilePath;
    process.env.DENTAL_STATE_BACKUP_DIR = path.join(tempDir, 'backups');
  });

  afterEach(() => {
    // Restore environment variables
    process.env = { ...originalEnv };

    // Clean up temporary files
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('returns null when persistence is disabled', () => {
    process.env.DENTAL_STATE_PERSISTENCE = 'off';
    const state = loadPersistentState();
    assert.strictEqual(state, null);
  });

  test('returns null when state file does not exist', () => {
    // File not created yet
    assert.strictEqual(existsSync(tempFilePath), false);
    const state = loadPersistentState();
    assert.strictEqual(state, null);
  });

  test('returns null when state file is not valid JSON', () => {
    writeFileSync(tempFilePath, '{ invalid json', 'utf8');

    const originalConsoleWarn = console.warn;
    let warningLogged = false;
    console.warn = () => { warningLogged = true; };

    try {
      const state = loadPersistentState();
      assert.strictEqual(state, null);
      assert.strictEqual(warningLogged, true);
    } finally {
      console.warn = originalConsoleWarn;
    }
  });

  test('returns null when state version does not match', () => {
    const data = {
      version: 999, // Mismatched version
      savedAt: new Date().toISOString(),
      state: { clinicProfile: {} }
    };
    writeFileSync(tempFilePath, JSON.stringify(data), 'utf8');

    const state = loadPersistentState();
    assert.strictEqual(state, null);
  });

  test('returns null when state is missing from payload', () => {
    const data = {
      version: 1,
      savedAt: new Date().toISOString()
      // missing 'state'
    };
    writeFileSync(tempFilePath, JSON.stringify(data), 'utf8');

    const state = loadPersistentState();
    assert.strictEqual(state, null);
  });

  test('returns null when checksum is invalid', () => {
    const dataCore = {
      version: 1,
      savedAt: new Date().toISOString(),
      state: { clinicProfile: { name: 'Test Clinic' } }
    };

    const data = {
      ...dataCore,
      checksum: 'invalid-checksum-123'
    };
    writeFileSync(tempFilePath, JSON.stringify(data), 'utf8');

    const originalConsoleWarn = console.warn;
    let warningLogged = false;
    console.warn = () => { warningLogged = true; };

    try {
      const state = loadPersistentState();
      assert.strictEqual(state, null);
      assert.strictEqual(warningLogged, true);
    } finally {
      console.warn = originalConsoleWarn;
    }
  });

  test('loads valid state successfully with checksum', () => {
    const dataCore = {
      version: 1,
      savedAt: new Date().toISOString(),
      state: { clinicProfile: { name: 'Test Clinic' } }
    };

    const checksum = createHash("sha256").update(JSON.stringify(dataCore)).digest("hex");

    const data = {
      ...dataCore,
      checksum
    };

    writeFileSync(tempFilePath, JSON.stringify(data), 'utf8');

    const state = loadPersistentState();
    assert.notStrictEqual(state, null);
    assert.deepStrictEqual(state?.clinicProfile, { name: 'Test Clinic' });
  });

  test('loads valid state successfully without checksum (backwards compatibility)', () => {
    const dataCore = {
      version: 1,
      savedAt: new Date().toISOString(),
      state: { clinicProfile: { name: 'Test Clinic Legacy' } }
    };

    // No checksum included
    writeFileSync(tempFilePath, JSON.stringify(dataCore), 'utf8');

    const state = loadPersistentState();
    assert.notStrictEqual(state, null);
    assert.deepStrictEqual(state?.clinicProfile, { name: 'Test Clinic Legacy' });
  });
});
