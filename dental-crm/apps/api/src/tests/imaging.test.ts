import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { runAbortableImagingScan } from '../routes/imaging.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ApiDicomScanOptions } from '../routes/imaging.js';

describe('runAbortableImagingScan', () => {
  test('returns successful result of the operation', async () => {
    const mockRequest = { raw: { once: mock.fn() } } as unknown as FastifyRequest;
    const sendMock = mock.fn();
    const codeMock = mock.fn(() => ({ send: sendMock }));
    const mockReply = { code: codeMock, send: sendMock } as unknown as FastifyReply;

    const operation = mock.fn(async (options: ApiDicomScanOptions) => 'success');

    const result = await runAbortableImagingScan(mockRequest, mockReply, operation);

    assert.strictEqual(result, 'success');
    assert.strictEqual(operation.mock.callCount(), 1);
    assert.strictEqual(codeMock.mock.callCount(), 0);
    assert.strictEqual(sendMock.mock.callCount(), 0);
  });

  test('re-throws generic errors', async () => {
    const mockRequest = { raw: { once: mock.fn() } } as unknown as FastifyRequest;
    const sendMock = mock.fn();
    const codeMock = mock.fn(() => ({ send: sendMock }));
    const mockReply = { code: codeMock, send: sendMock } as unknown as FastifyReply;

    const genericError = new Error('Generic error');
    const operation = mock.fn(async (options: ApiDicomScanOptions) => {
      throw genericError;
    });

    try {
      await runAbortableImagingScan(mockRequest, mockReply, operation);
      assert.fail('Should have thrown');
    } catch (error) {
      assert.strictEqual(error, genericError);
    }

    assert.strictEqual(operation.mock.callCount(), 1);
    assert.strictEqual(codeMock.mock.callCount(), 0);
    assert.strictEqual(sendMock.mock.callCount(), 0);
  });

  test('handles abort errors and sends ImagingScanCancelled', async () => {
    const mockRequest = { raw: { once: mock.fn() } } as unknown as FastifyRequest;
    const sendMock = mock.fn();
    const codeMock = mock.fn(() => ({ send: sendMock }));
    const mockReply = {
      code: codeMock,
      send: sendMock
    } as unknown as FastifyReply;

    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    const operation = mock.fn(async (options: ApiDicomScanOptions) => {
      throw abortError;
    });

    await runAbortableImagingScan(mockRequest, mockReply, operation);

    assert.strictEqual(operation.mock.callCount(), 1);
    assert.strictEqual(codeMock.mock.callCount(), 1);
    assert.strictEqual((codeMock.mock.calls[0] as any).arguments[0], 499);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const sendArg = (sendMock.mock.calls[0] as any).arguments[0];
    assert.strictEqual(sendArg.error, 'ImagingScanCancelled');
    assert.ok(sendArg.message.includes('Сканирование локальных снимков остановлено'));
  });
});
