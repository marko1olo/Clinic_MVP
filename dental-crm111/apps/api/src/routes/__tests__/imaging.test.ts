import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { commitImagingImport, parseDicomSeriesManifest } from '../imaging.js';
import { imagingStudies } from '../../sampleData.js';
import type { ImagingSourceKind } from '@dental/shared';

describe('commitImagingImport', () => {
  let originalStudies: any[];

  beforeEach(() => {
    originalStudies = [...imagingStudies];
  });

  afterEach(() => {
    imagingStudies.length = 0;
    imagingStudies.push(...originalStudies);
  });

  test('imports a valid study (happy path)', () => {
    const rawText = `Иванова Марина Сергеевна opg /var/data/scans/1.dcm`;
    const input = {
      sourceName: 'test-import',
      sourceKind: 'folder_watch' as ImagingSourceKind,
      rawText
    };

    const result = commitImagingImport(input);

    assert.strictEqual(result.sourceName, 'test-import');
    assert.strictEqual(result.sourceKind, 'folder_watch');
    assert.strictEqual(result.importedCount, 1);
    assert.strictEqual(result.skippedCount, 0);
    assert.strictEqual(result.createdStudyIds.length, 1);

    assert.strictEqual(imagingStudies.length, originalStudies.length + 1);
    const addedStudy = imagingStudies[0];
    assert.strictEqual(addedStudy?.id, result.createdStudyIds[0]);
    assert.strictEqual(addedStudy?.kind, 'opg');
    assert.strictEqual(addedStudy?.storagePath, '/var/data/scans/1.dcm');
  });

  test('skips blocked rows', () => {
    const rawText = `Иванова Марина Сергеевна opg\nНеизвестный Пациент opg /var/data/scans/2.dcm`;
    const input = {
      sourceName: 'test-import',
      sourceKind: 'folder_watch' as ImagingSourceKind,
      rawText
    };

    const result = commitImagingImport(input);

    assert.strictEqual(result.importedCount, 0);
    assert.strictEqual(result.skippedCount, 2);
    assert.strictEqual(result.createdStudyIds.length, 0);

    assert.strictEqual(imagingStudies.length, originalStudies.length);
  });

  test('handles partial imports', () => {
    const rawText = `Иванова Марина Сергеевна opg /var/data/scans/1.dcm
Неизвестный Пациент opg /var/data/scans/2.dcm
Иванова Марина Сергеевна cbct /var/data/scans/3.dcm`;

    const input = {
      sourceName: 'test-import',
      sourceKind: 'folder_watch' as ImagingSourceKind,
      rawText
    };

    const result = commitImagingImport(input);

    assert.strictEqual(result.importedCount, 2);
    assert.strictEqual(result.skippedCount, 1);
    assert.strictEqual(result.createdStudyIds.length, 2);

    assert.strictEqual(imagingStudies.length, originalStudies.length + 2);
    const addedStudy1 = imagingStudies[1];
    const addedStudy2 = imagingStudies[0];
    assert.strictEqual(addedStudy1?.kind, 'opg');
    assert.strictEqual(addedStudy2?.kind, 'cbct');
  });
});

describe('parseDicomSeriesManifest', () => {
  test('handles empty input correctly', () => {
    const result = parseDicomSeriesManifest({
      sourceName: "testEmpty",
      sourceKind: "dicom_file",
      rawText: "   \n  \n"
    });

    assert.strictEqual(result.totalRows, 0);
    assert.strictEqual(result.totalSeries, 0);
    assert.strictEqual(result.parserNotes[0], "Нет строк списка снимков для разбора.");
  });

  test('parses input with headers and performs matching', () => {
    const headersText = [
      "patient,phone,kind,filePath,capturedAt,studyInstanceUid,seriesInstanceUid",
      "Иванова Марина Сергеевна,+79271112233,ОПТГ,/path/to/image.jpg,2023-01-01,uid1,uid2",
      "Unknown Patient,+70000000000,КЛКТ,,2023-01-02,uid3,uid4",
      "Иванова Марина Сергеевна,,UnknownKind,/path/to/image2.jpg,2023-01-03,uid5,uid6"
    ].join("\n");

    const result = parseDicomSeriesManifest({
      sourceName: "testHeaders",
      sourceKind: "dicom_file",
      rawText: headersText
    });

    assert.strictEqual(result.totalRows, 3);
    assert.strictEqual(result.sourceName, "testHeaders");

    const row1 = result.rows[0]!;
    assert.strictEqual(row1.status, "ready");
    assert.strictEqual(row1.phone, "+79271112233");
    assert.strictEqual(row1.kind, "opg");
    assert.strictEqual(row1.filePath, "/path/to/image.jpg");

    const row2 = result.rows[1]!;
    assert.strictEqual(row2.status, "blocked");
    assert(row2.warnings.includes("Пациент не найден, нужно сопоставление"));
    assert(row2.warnings.includes("Нет пути к снимку"));

    const row3 = result.rows[2]!;
    assert.strictEqual(row3.status, "blocked");
    assert(row3.warnings.includes("Тип исследования не распознан"));
  });

  test('parses input without headers using fallback mechanism', () => {
    const noHeadersText = [
      "/path/to/some/image/file.jpg Иванова Марина Сергеевна +7 (900) 555-55-55 01.01.2023 ОПТГ"
    ].join("\n");

    const result = parseDicomSeriesManifest({
      sourceName: "testNoHeaders",
      sourceKind: "dicom_file",
      rawText: noHeadersText
    });

    assert.strictEqual(result.totalRows, 1);

    const row = result.rows[0]!;
    assert.strictEqual(row.status, "ready");
    assert.strictEqual(row.kind, "opg");
    assert.strictEqual(row.filePath, "/path/to/some/image/file.jpg");
    assert(row.warnings.includes("Коды исследования/серии не найдены, используем папку как временную группу"));
  });
});
