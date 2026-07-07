<<<<<<< HEAD
﻿import test from "node:test";
=======
import test from "node:test";
>>>>>>> gitlab/main
import assert from "node:assert";
import { parseImagingManifest } from "../../routes/imaging.js";
import { imagingImportPreviewResponseSchema } from "@dental/shared";

<<<<<<< HEAD
test("parseImagingManifest - handles empty text", async () => {
  const result = await parseImagingManifest("test-org-id", {
=======
test("parseImagingManifest - handles empty text", () => {
  const result = parseImagingManifest({
>>>>>>> gitlab/main
    sourceName: "empty.csv",
    sourceKind: "manual_upload",
    rawText: ""
  });

  assert.strictEqual(result.totalRows, 0);
  assert.strictEqual(result.readyRows, 0);
  assert.strictEqual(result.warningRows, 0);
  assert.strictEqual(result.blockedRows, 0);
  assert.deepStrictEqual(result.rows, []);
  assert.deepStrictEqual(result.parserNotes, ["Нет строк для разбора."]);

  // ensure it is valid according to schema
  assert.ok(imagingImportPreviewResponseSchema.safeParse(result).success);
});

<<<<<<< HEAD
test("parseImagingManifest - handles text with only empty lines", async () => {
  const result = await parseImagingManifest("test-org-id", {
=======
test("parseImagingManifest - handles text with only empty lines", () => {
  const result = parseImagingManifest({
>>>>>>> gitlab/main
    sourceName: "empty.csv",
    sourceKind: "manual_upload",
    rawText: "\n\r\n  \n\t\n"
  });

  assert.strictEqual(result.totalRows, 0);
  assert.strictEqual(result.readyRows, 0);
  assert.strictEqual(result.warningRows, 0);
  assert.strictEqual(result.blockedRows, 0);
  assert.deepStrictEqual(result.rows, []);
  assert.deepStrictEqual(result.parserNotes, ["Нет строк для разбора."]);

  // ensure it is valid according to schema
  assert.ok(imagingImportPreviewResponseSchema.safeParse(result).success);
});
