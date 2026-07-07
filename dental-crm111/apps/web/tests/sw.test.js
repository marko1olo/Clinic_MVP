import { test, describe } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

// Read the service worker file
const swPath = path.join(process.cwd(), "apps/web/public/sw.js");
const swContent = fs.readFileSync(swPath, "utf-8");

// Create a context with globals needed by the script
const sandbox = {
  URL: URL,
  caches: {
    match: async () => {},
    open: async () => {},
    keys: async () => [],
    delete: async () => {}
  },
  self: {
    addEventListener: () => {},
    location: { origin: "https://example.com" },
    skipWaiting: () => {},
    clients: { claim: () => {} }
  },
  Promise: Promise,
  Response: { error: () => {} },
  fetch: () => {}
};

vm.createContext(sandbox);

// Execute the service worker code in the sandbox
vm.runInContext(swContent, sandbox);

// Extract the function we want to test
const isForbiddenRuntimeResponse = sandbox.isForbiddenRuntimeResponse;

describe("isForbiddenRuntimeResponse", () => {
  test("returns true for /api/ routes", () => {
    assert.strictEqual(isForbiddenRuntimeResponse(new URL("https://example.com/api/test")), true);
    assert.strictEqual(isForbiddenRuntimeResponse(new URL("https://example.com/api/")), true);
  });

  test("returns true for protected data paths", () => {
    const paths = [
      "/documents",
      "/documents/123",
      "/patients",
      "/patients/456",
      "/imaging",
      "/imaging/789",
      "/dicom",
      "/files",
      "/uploads",
      "/medical-documents"
    ];

    paths.forEach((path) => {
      assert.strictEqual(
        isForbiddenRuntimeResponse(new URL(`https://example.com${path}`)),
        true,
        `Expected true for ${path}`
      );
    });
  });

  test("returns true for specific file extensions (medical and 3d formats)", () => {
    const extensions = [
      "dcm", "dicom", "stl", "obj", "ply", "glb", "gltf", "nii", "nrrd", "mhd", "raw"
    ];

    extensions.forEach((ext) => {
      assert.strictEqual(
        isForbiddenRuntimeResponse(new URL(`https://example.com/some/path/file.${ext}`)),
        true,
        `Expected true for .${ext}`
      );
      // Test case insensitivity
      assert.strictEqual(
        isForbiddenRuntimeResponse(new URL(`https://example.com/some/path/file.${ext.toUpperCase()}`)),
        true,
        `Expected true for .${ext.toUpperCase()}`
      );
    });
  });

  test("returns false for regular shell assets and unlisted paths", () => {
    const paths = [
      "/",
      "/index.html",
      "/offline.html",
      "/manifest.webmanifest",
      "/icon.svg",
      "/assets/index.js",
      "/assets/styles.css",
      "/about",
      "/images/logo.png"
    ];

    paths.forEach((path) => {
      assert.strictEqual(
        isForbiddenRuntimeResponse(new URL(`https://example.com${path}`)),
        false,
        `Expected false for ${path}`
      );
    });
  });

  test("does not incorrectly match substrings of protected paths", () => {
    const paths = [
      "/documents-info", // Should not match /documents
      "/patients-list",  // Should not match /patients
      "/apinfo"          // Should not match /api/
    ];

    paths.forEach((path) => {
      assert.strictEqual(
        isForbiddenRuntimeResponse(new URL(`https://example.com${path}`)),
        false,
        `Expected false for ${path}`
      );
    });
  });
});
