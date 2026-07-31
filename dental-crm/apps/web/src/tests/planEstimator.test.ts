import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectCariesBundle } from "../utils/planEstimator.js";

describe("detectCariesBundle", () => {
	it("handles 0 surfaces (edge case)", () => {
		const result = detectCariesBundle([]);
		assert.equal(result.isComplex, false);
		assert.equal(result.surfaceCount, 0);
		assert.equal(result.recommendedCode, "A16.07.002.004");
		assert.equal(result.recommendedName, "Пломба 2 поверхности (композит)");
		assert.equal(result.basePrice, 3200);
		assert.deepEqual(result.surfaces, []);
	});

	it("handles 1 surface", () => {
		const surfaces = ["O"];
		const result = detectCariesBundle(surfaces);
		assert.equal(result.isComplex, false);
		assert.equal(result.surfaceCount, 1);
		assert.equal(result.recommendedCode, "A16.07.002.001");
		assert.equal(result.recommendedName, "Пломба 1 поверхность (композит)");
		assert.equal(result.basePrice, 2200);
		assert.deepEqual(result.surfaces, surfaces);
	});

	it("handles 2 surfaces", () => {
		const surfaces = ["M", "O"];
		const result = detectCariesBundle(surfaces);
		assert.equal(result.isComplex, false);
		assert.equal(result.surfaceCount, 2);
		assert.equal(result.recommendedCode, "A16.07.002.004");
		assert.equal(result.recommendedName, "Пломба 2 поверхности (композит)");
		assert.equal(result.basePrice, 3200);
		assert.deepEqual(result.surfaces, surfaces);
	});

	it("handles 3 surfaces (complex MOD)", () => {
		const surfaces = ["M", "O", "D"];
		const result = detectCariesBundle(surfaces);
		assert.equal(result.isComplex, true);
		assert.equal(result.surfaceCount, 3);
		assert.equal(result.recommendedCode, "A16.07.002.007");
		assert.equal(
			result.recommendedName,
			"Сложная реставрация 3 поверхностей (MOD) — композит светового отверждения",
		);
		assert.equal(result.basePrice, 4500 + (3 - 2) * 1200);
		assert.deepEqual(result.surfaces, surfaces);
	});

	it("handles >3 surfaces", () => {
		const surfaces = ["M", "O", "D", "B", "L"];
		const result = detectCariesBundle(surfaces);
		assert.equal(result.isComplex, true);
		assert.equal(result.surfaceCount, 5);
		assert.equal(result.recommendedCode, "A16.07.002.007");
		assert.equal(
			result.recommendedName,
			"Сложная реставрация 5 поверхностей (MOD) — композит светового отверждения",
		);
		assert.equal(result.basePrice, 4500 + (5 - 2) * 1200);
		assert.deepEqual(result.surfaces, surfaces);
	});
});
