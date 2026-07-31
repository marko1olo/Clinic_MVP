import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { createPanorexWorker } from "../utils/dicom/panorexWorker.js";

describe("panorexWorker", () => {
    let capturedWorkerCode = "";

    // Mock global objects needed for worker creation
    beforeEach(() => {
        capturedWorkerCode = "";

        (global as any).Blob = class {
            constructor(parts: any[]) {
                capturedWorkerCode = parts[0];
            }
        };

        (global as any).URL = {
            createObjectURL: (blob: any) => "blob:test",
            revokeObjectURL: () => {}
        };

        (global as any).Worker = class {
            url: string;
            constructor(url: string) {
                this.url = url;
            }
        };
    });

    const createWorkerScope = () => {
        let postedMessage: any = null;
        const selfScope = {
            postMessage: (msg: any, transferables?: any[]) => {
                postedMessage = msg;
            },
            onmessage: null as any
        };

        createPanorexWorker();
        new Function('self', capturedWorkerCode)(selfScope);

        return { selfScope, getPostedMessage: () => postedMessage };
    };

    const baseMessageData = {
        volumeData: new Int16Array([100, 200, 300, 400, 500, 600, 700, 800]), // 2x2x2
        dimensions: [2, 2, 2],
        spacing: [1, 1, 1],
        origin: [0, 0, 0],
        direction: [1, 0, 0, 0, 1, 0, 0, 0, 1], // Identity matrix
        ww: 400,
        wl: 300
    };

    it("should process PANOREX type correctly", () => {
        const { selfScope, getPostedMessage } = createWorkerScope();

        const messageData = {
            ...baseMessageData,
            type: 'PANOREX',
            frames: [{ point: { x: 0, y: 0, z: 0 } }, { point: { x: 1, y: 1, z: 1 } }],
            panHeight: 2,
            res: 1
        };

        selfScope.onmessage!({ data: messageData });
        const result = getPostedMessage();

        assert.ok(result);
        assert.equal(result.type, 'PANOREX_RESULT');
        assert.equal(result.width, 2);
        assert.equal(result.height, 2);
        assert.ok(result.buffer instanceof Uint8ClampedArray);
        assert.equal(result.buffer.length, 2 * 2 * 4);
    });

    it("should process CROSS_SECTIONS type correctly", () => {
        const { selfScope, getPostedMessage } = createWorkerScope();

        const messageData = {
            ...baseMessageData,
            type: 'CROSS_SECTIONS',
            frames: [
                { point: { x: 0, y: 0, z: 0 }, normal: { x: 1, y: 0, z: 0 } },
                { point: { x: 0, y: 0, z: 0 }, normal: { x: 1, y: 0, z: 0 } },
                { point: { x: 0, y: 0, z: 0 }, normal: { x: 1, y: 0, z: 0 } }, // center
                { point: { x: 0, y: 0, z: 0 }, normal: { x: 1, y: 0, z: 0 } },
                { point: { x: 0, y: 0, z: 0 }, normal: { x: 1, y: 0, z: 0 } }
            ],
            csWidth: 2,
            csHeight: 2,
            res: 1,
            csIndex: 2
        };

        selfScope.onmessage!({ data: messageData });
        const result = getPostedMessage();

        assert.ok(result);
        assert.equal(result.type, 'CROSS_SECTIONS_RESULT');
        assert.equal(result.width, 10); // 2 width * 5 slices
        assert.equal(result.height, 2);
        assert.ok(result.buffer instanceof Uint8ClampedArray);
        assert.equal(result.buffer.length, 10 * 2 * 4);
    });

    it("should safely handle out of bounds pixel requests in getPixel", () => {
        const { selfScope, getPostedMessage } = createWorkerScope();

        // Use coordinates way out of the 2x2x2 bounds
        const messageData = {
            ...baseMessageData,
            type: 'PANOREX',
            frames: [{ point: { x: 100, y: 100, z: 100 } }],
            panHeight: 1,
            res: 1
        };

        selfScope.onmessage!({ data: messageData });
        const result = getPostedMessage();

        assert.ok(result);
        assert.equal(result.type, 'PANOREX_RESULT');
        assert.equal(result.width, 1);
        assert.equal(result.height, 1);

        // Out of bounds lookup should return 0, which corresponds to some baseline intensity after windowing
        // minVal = 300 - 400/2 = 100.
        // val = 0.
        // norm = (0 - 100) / 400 = -0.25 -> clamped to 0.
        // intensity = 0 * 255 = 0.
        assert.equal(result.buffer[0], 0); // R
        assert.equal(result.buffer[1], 0); // G
        assert.equal(result.buffer[2], 0); // B
        assert.equal(result.buffer[3], 255); // Alpha
    });
});
