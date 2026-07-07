import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { rmSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import os from 'node:os';
import { savePersistentState } from '../persistentState.js';

describe('savePersistentState', () => {
  let tmpDir: string;
  let stateFilePath: string;

  let originalPersistenceEnv: string | undefined;
  let originalStateFileEnv: string | undefined;
  let originalBackupDirEnv: string | undefined;

  beforeEach(() => {
    tmpDir = path.join(os.tmpdir(), 'dental-test-state-' + Date.now() + Math.random());
    stateFilePath = path.join(tmpDir, 'state.json');

    originalPersistenceEnv = process.env.DENTAL_STATE_PERSISTENCE;
    originalStateFileEnv = process.env.DENTAL_STATE_FILE;
    originalBackupDirEnv = process.env.DENTAL_STATE_BACKUP_DIR;

    process.env.DENTAL_STATE_PERSISTENCE = 'on';
    process.env.DENTAL_STATE_FILE = stateFilePath;
    process.env.DENTAL_STATE_BACKUP_DIR = path.join(tmpDir, 'backups');
  });

  afterEach(() => {
    if (originalPersistenceEnv !== undefined) {
      process.env.DENTAL_STATE_PERSISTENCE = originalPersistenceEnv;
    } else {
      delete process.env.DENTAL_STATE_PERSISTENCE;
    }

    if (originalStateFileEnv !== undefined) {
      process.env.DENTAL_STATE_FILE = originalStateFileEnv;
    } else {
      delete process.env.DENTAL_STATE_FILE;
    }

    if (originalBackupDirEnv !== undefined) {
      process.env.DENTAL_STATE_BACKUP_DIR = originalBackupDirEnv;
    } else {
      delete process.env.DENTAL_STATE_BACKUP_DIR;
    }

    if (existsSync(tmpDir)) {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('saves state to the specified file', () => {
    const fakeState: any = { patients: [], appointments: [] };
    savePersistentState(fakeState);

    assert.ok(existsSync(stateFilePath), 'State file should be created');
    const content = JSON.parse(readFileSync(stateFilePath, 'utf8'));
    assert.deepStrictEqual(content.state, fakeState);
    assert.ok(content.checksum, 'Payload should have a checksum');
  });

  test('does not save when persistence is off', () => {
    process.env.DENTAL_STATE_PERSISTENCE = 'off';
    const fakeState: any = { patients: [], appointments: [] };
    savePersistentState(fakeState);

    assert.ok(!existsSync(stateFilePath), 'State file should not be created when persistence is off');
  });

  test('creates backups of previous state', () => {
    const fakeState1: any = { patients: [{ id: '1' }] };
    savePersistentState(fakeState1);

    const fakeState2: any = { patients: [{ id: '1' }, { id: '2' }] };
    savePersistentState(fakeState2);

    const backupDir = path.join(tmpDir, 'backups');
    assert.ok(existsSync(backupDir), 'Backup directory should be created');

    const backups = readdirSync(backupDir);
    assert.strictEqual(backups.length, 1, 'Should have created one backup');

    const backupContent = JSON.parse(readFileSync(path.join(backupDir, backups[0] as string), 'utf8'));
    assert.deepStrictEqual(backupContent.state, fakeState1, 'Backup should contain the previous state');
  });
});
