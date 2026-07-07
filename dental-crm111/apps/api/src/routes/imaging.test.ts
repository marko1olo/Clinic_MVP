import { test, describe, mock, afterEach } from 'node:test';
import assert from 'node:assert';
<<<<<<< HEAD
import fs from 'node:fs';
import { parseDicomSeriesManifest, hasDicomMagic } from './imaging.js';
import { parseDicomSeriesManifest, readFilePrefix } from './imaging.js';
import type { ImagingSourceKind } from '@dental/shared';

describe('readFilePrefix', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  test('closes file handle when readSync throws an error', () => {
    const fakePath = 'fake-path.dcm';
    const fakeHandle = 999;

    mock.method(fs, 'statSync', () => ({ size: 100 }));
    mock.method(fs, 'openSync', () => fakeHandle);
    mock.method(fs, 'readSync', () => {
      throw new Error('Simulated read error');
    });
    const closeSyncMock = mock.method(fs, 'closeSync', () => {});

    assert.throws(
      () => readFilePrefix(fakePath, 50),
      { message: 'Simulated read error' }
    );

    assert.strictEqual(closeSyncMock.mock.calls.length, 1);
    assert.strictEqual(closeSyncMock.mock.calls[0]!.arguments[0], fakeHandle);
  });

  test('returns buffer and closes handle on successful read', () => {
    const fakePath = 'fake-path.dcm';
    const fakeHandle = 999;

    mock.method(fs, 'statSync', () => ({ size: 100 }));
    mock.method(fs, 'openSync', () => fakeHandle);
    mock.method(fs, 'readSync', (handle, buffer, offset, length, position) => {
      buffer.write('hello');
      return 5;
    });
    const closeSyncMock = mock.method(fs, 'closeSync', () => {});

    const result = readFilePrefix(fakePath, 5);

    assert.strictEqual(result.toString('utf8', 0, 5), 'hello');
    assert.strictEqual(closeSyncMock.mock.calls.length, 1);
    assert.strictEqual(closeSyncMock.mock.calls[0]!.arguments[0], fakeHandle);
  });
});

=======
import { parseDicomSeriesManifest } from './imaging.js';
import type { ImagingSourceKind } from '@dental/shared';

>>>>>>> gitlab/main
describe('parseDicomSeriesManifest', () => {
  afterEach(() => {
    mock.restoreAll();
  });

<<<<<<< HEAD
  test('returns default preview response when rawText yields no lines', async () => {
=======
  test('returns default preview response when rawText yields no lines', () => {
>>>>>>> gitlab/main
    const input = {
      sourceName: 'test-source.zip',
      sourceKind: 'dicom_file' as ImagingSourceKind,
      rawText: '   \n\r\n   '
    };

<<<<<<< HEAD
    const result = await parseDicomSeriesManifest("mock-org", input);
=======
    const result = parseDicomSeriesManifest(input);
>>>>>>> gitlab/main

    assert.strictEqual(result.sourceName, 'test-source.zip');
    assert.strictEqual(result.sourceKind, 'dicom_file');
    assert.strictEqual(result.totalRows, 0);
    assert.strictEqual(result.totalSeries, 0);
    assert.strictEqual(result.readySeries, 0);
    assert.strictEqual(result.warningSeries, 0);
    assert.strictEqual(result.blockedSeries, 0);
    assert.deepStrictEqual(result.rows, []);
    assert.deepStrictEqual(result.series, []);
    assert.deepStrictEqual(result.parserNotes, ['Нет строк списка снимков для разбора.']);
  });
});
<<<<<<< HEAD

describe('hasDicomMagic', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  test('returns false when fs.statSync throws an error', () => {
    mock.method(fs, 'statSync', () => {
      throw new Error('Mocked node:fs statSync error');
    });

    const result = hasDicomMagic('dummy-path.dcm');

    assert.strictEqual(result, false);

    const mockStatSync = fs.statSync as any;
    assert.strictEqual(mockStatSync.mock.callCount(), 1);
  });
});
=======
>>>>>>> gitlab/main
