import test, { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";

import { loadPersistentState, savePersistentState } from "../persistentState.js";
import type { DentalMutableState } from "../persistentState.js";

function generateChecksum(payload: any) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

describe("loadPersistentState", () => {
  let tempDir: string;
  let originalEnv: NodeJS.ProcessEnv;
  let stateFilePath: string;
  let originalConsoleWarn: any;

  beforeEach(() => {
    originalEnv = { ...process.env };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dental-state-test-"));
    stateFilePath = path.join(tempDir, "state.json");
    process.env.DENTAL_STATE_FILE = stateFilePath;
    process.env.DENTAL_STATE_BACKUP_DIR = path.join(tempDir, "backups");
    process.env.DENTAL_STATE_PERSISTENCE = "on";

    // Suppress console.warn during tests to keep output clean
    originalConsoleWarn = console.warn;
    console.warn = () => {};
  });

  afterEach(() => {
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.warn = originalConsoleWarn;
  });

  it("should return null if persistence is disabled", () => {
    process.env.DENTAL_STATE_PERSISTENCE = "off";
    fs.writeFileSync(stateFilePath, JSON.stringify({ version: 1, state: {} }));
    assert.strictEqual(loadPersistentState(), null);
  });

  it("should return null if state file does not exist", () => {
    assert.strictEqual(fs.existsSync(stateFilePath), false);
    assert.strictEqual(loadPersistentState(), null);
  });

  it("should return null if state file contains malformed JSON", () => {
    fs.writeFileSync(stateFilePath, "{ malformed: json, ]");
    assert.strictEqual(loadPersistentState(), null);
  });

  it("should return null if state version is incorrect", () => {
    const payload = {
      version: 999, // incorrect version
      savedAt: new Date().toISOString(),
      state: { staffMembers: [] }
    };
    fs.writeFileSync(stateFilePath, JSON.stringify(payload));
    assert.strictEqual(loadPersistentState(), null);
  });

  it("should return null if state payload is missing the state field", () => {
    const payload = {
      version: 1,
      savedAt: new Date().toISOString()
      // missing state
    };
    fs.writeFileSync(stateFilePath, JSON.stringify(payload));
    assert.strictEqual(loadPersistentState(), null);
  });

  it("should return null if checksum does not match", () => {
    const payloadCore = {
      version: 1,
      savedAt: new Date().toISOString(),
      state: { staffMembers: [] }
    };
    const payload = {
      ...payloadCore,
      checksum: "invalid_checksum_string"
    };
    fs.writeFileSync(stateFilePath, JSON.stringify(payload));
    assert.strictEqual(loadPersistentState(), null);
  });

  it("should return state if checksum matches", () => {
    const payloadCore = {
      version: 1,
      savedAt: new Date().toISOString(),
      state: { staffMembers: [{ id: "123", name: "Test Staff" }] }
    };
    const payload = {
      ...payloadCore,
      checksum: generateChecksum(payloadCore)
    };
    fs.writeFileSync(stateFilePath, JSON.stringify(payload));

    const loadedState = loadPersistentState();
    assert.notStrictEqual(loadedState, null);
    assert.deepStrictEqual((loadedState as any).staffMembers, [{ id: "123", name: "Test Staff" }]);
  });

  it("should return state if no checksum is present (backwards compatibility)", () => {
    const payload = {
      version: 1,
      savedAt: new Date().toISOString(),
      state: { staffMembers: [{ id: "456", name: "Old Format" }] }
    };
    // No checksum added
    fs.writeFileSync(stateFilePath, JSON.stringify(payload));

    const loadedState = loadPersistentState();
    assert.notStrictEqual(loadedState, null);
    assert.deepStrictEqual((loadedState as any).staffMembers, [{ id: "456", name: "Old Format" }]);
  });
});
