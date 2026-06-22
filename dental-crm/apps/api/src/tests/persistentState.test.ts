import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getPersistentStateIntegrityReport, savePersistentState } from '../persistentState.js';

describe('getPersistentStateIntegrityReport', () => {
    let tmpDir: string;
    let stateFile: string;
    let backupDir: string;

    const originalEnv = process.env;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dental-state-test-'));
        stateFile = path.join(tmpDir, 'state.json');
        backupDir = path.join(tmpDir, 'backups');

        process.env = { ...originalEnv };
        process.env.DENTAL_STATE_FILE = stateFile;
        process.env.DENTAL_STATE_BACKUP_DIR = backupDir;
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        process.env = originalEnv;
    });

    test('reports missing state file correctly', () => {
        const report = getPersistentStateIntegrityReport();
        assert.strictEqual(report.ok, false);
        assert.ok(report.warnings.some((w: string) => w.includes('Файл состояния еще не создан')));
        assert.strictEqual(report.meta.exists, false);
    });

    test('reports disabled persistence correctly', () => {
        process.env.DENTAL_STATE_PERSISTENCE = 'off';
        const report = getPersistentStateIntegrityReport();
        assert.strictEqual(report.ok, false);
        assert.ok(report.warnings.some((w: string) => w.includes('выключено')));
        assert.strictEqual(report.meta.enabled, false);
    });

    test('reports valid state correctly', async () => {
        // use savePersistentState twice to generate a valid state file and one backup
        savePersistentState({ staffMembers: [{ id: '1', name: 'John Doe', position: 'doctor' }] } as any);
        // Wait a small amount to make sure modified times are different if precision is low
        await new Promise(resolve => setTimeout(resolve, 50));
        savePersistentState({ staffMembers: [{ id: '1', name: 'John Doe', position: 'doctor' }, { id: '2', name: 'Jane Doe', position: 'nurse' }] } as any);

        const report = getPersistentStateIntegrityReport();
        assert.strictEqual(report.ok, true);
        assert.strictEqual(report.warnings.length, 0);
        assert.strictEqual(report.checksumVerified, true);
        assert.strictEqual(report.backups.length, 1);
        assert.strictEqual(report.stateCounts.staffMembers, 2);
    });

    test('reports unreadable state file', () => {
        fs.mkdirSync(path.dirname(stateFile), { recursive: true });
        fs.writeFileSync(stateFile, 'invalid json');
        const report = getPersistentStateIntegrityReport();
        assert.strictEqual(report.ok, false);
        assert.ok(report.warnings.some((w: string) => w.includes('не читается')));
        assert.strictEqual(report.meta.exists, true);
    });

    test('reports checksum mismatch', () => {
        savePersistentState({ staffMembers: [] } as any);
        const data = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        data.state.staffMembers = [{ id: 'fake' }]; // mutate state to break checksum
        fs.writeFileSync(stateFile, JSON.stringify(data));

        const report = getPersistentStateIntegrityReport();
        assert.strictEqual(report.ok, false);
        assert.strictEqual(report.checksumVerified, false);
        assert.ok(report.warnings.some((w: string) => w.includes('Контрольная сумма')));
    });

    test('reports backup integrity warnings', () => {
        savePersistentState({ staffMembers: [] } as any);
        // Save again to trigger backup
        savePersistentState({ staffMembers: [] } as any);

        // Corrupt the backup
        const backups = fs.readdirSync(backupDir);
        assert.ok(backups.length > 0);
        const backupFile = backups[0]; if (backupFile) fs.writeFileSync(path.join(backupDir, backupFile), 'invalid json');

        const report = getPersistentStateIntegrityReport();
        assert.strictEqual(report.ok, false);
        assert.ok(report.warnings.some((w: string) => w.includes('не прошла проверку')));
    });
});
