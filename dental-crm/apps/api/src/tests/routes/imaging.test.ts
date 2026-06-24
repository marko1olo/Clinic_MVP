import { test, describe, mock, afterEach } from 'node:test';
import assert from 'node:assert';
import { runAbortableImagingScan } from '../../routes/imaging.js';
import type { FastifyRequest, FastifyReply } from 'fastify';

describe('runAbortableImagingScan', () => {
  test('returns successful operation result', async () => {
    const request = {
      raw: {
        once: mock.fn()
      }
    } as unknown as FastifyRequest;

    const reply = {} as unknown as FastifyReply;

    const operation = mock.fn(async () => 'success_result');

    const result = await runAbortableImagingScan(request, reply, operation);

    assert.strictEqual(result, 'success_result');
    assert.strictEqual(operation.mock.calls.length, 1);
  });

  test('handles ApiDicomScanAbortError and calls sendImagingScanCancelled', async () => {
    const request = {
      raw: {
        once: mock.fn()
      }
    } as unknown as FastifyRequest;

    const reply = {
      code: mock.fn(() => reply),
      send: mock.fn(() => 'cancelled_response')
    } as unknown as FastifyReply;

    const abortError = new Error('AbortError test');
    abortError.name = 'AbortError';

    const operation = mock.fn(async () => {
      throw abortError;
    });

    const result = await runAbortableImagingScan(request, reply, operation);

    assert.strictEqual(result, 'cancelled_response');
    assert.strictEqual(reply.code.mock.calls.length, 1);
    assert.strictEqual(reply.code.mock.calls[0].arguments[0], 499);
    assert.strictEqual(reply.send.mock.calls.length, 1);
    const sendArgs = reply.send.mock.calls[0].arguments[0];
    assert.strictEqual(sendArgs.error, 'ImagingScanCancelled');
  });

  test('re-throws generic errors', async () => {
    const request = {
      raw: {
        once: mock.fn()
      }
    } as unknown as FastifyRequest;

    const reply = {} as unknown as FastifyReply;

    const genericError = new Error('Generic failure');
    const operation = mock.fn(async () => {
      throw genericError;
    });

    try {
      await runAbortableImagingScan(request, reply, operation);
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.strictEqual(error, genericError);
    }
  });
});
