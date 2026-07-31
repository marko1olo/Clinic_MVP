import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { estimateDualPlan, detectCariesBundle } from "../../utils/planEstimator.js";

describe("planEstimator", () => {
	describe("estimateDualPlan", () => {
		it("should correctly estimate standard plan for osstem", () => {
			const { standard } = estimateDualPlan(46, "osstem");
			assert.equal(standard.tier, "standard");
			assert.equal(standard.systemName, "Osstem TS III SA");
			assert.equal(standard.totalRevenue, 44000);
			assert.equal(standard.totalMaterialCost, 19800);
			assert.equal(standard.grossProfit, 24200);
			assert.equal(standard.grossMarginPct, 55);
		});

		it("should correctly estimate premium plan with default nobel system", () => {
			const { premium } = estimateDualPlan(46, "osstem");
			assert.equal(premium.tier, "premium");
			assert.equal(premium.systemName, "Nobel Biocare Active");
			assert.equal(premium.totalRevenue, 67500);
			assert.equal(premium.totalMaterialCost, 49500);
			assert.equal(premium.grossProfit, 18000);
			assert.equal(premium.grossMarginPct, 27);
		});

		it("should correctly estimate premium plan with custom system", () => {
			const { premium } = estimateDualPlan(46, "osstem", "straumann");
			assert.equal(premium.tier, "premium");
			assert.equal(premium.systemName, "Straumann BLX");
			assert.equal(premium.totalRevenue, 67500);
			// Straumann cost is 24000, which is 4000 less than Nobel (28000)
			assert.equal(premium.totalMaterialCost, 45500);
			assert.equal(premium.grossProfit, 22000);
			assert.equal(premium.grossMarginPct, 33);
		});

		it("should format services correctly for standard plan", () => {
			const { standard } = estimateDualPlan(11, "bredent");
			assert.equal(standard.services.length, 5);
			const implantService = standard.services.find(s => s.phase === 2 && s.code === "A16.07.004.001");
			assert.ok(implantService);
			assert.equal(implantService.name, "Установка имплантата Bredent SKY Blue (зуб 11)");
			assert.equal(implantService.materialCost, 12000);
		});
	});

	describe("detectCariesBundle", () => {
		it("should handle 1 surface correctly (simple)", () => {
			const result = detectCariesBundle(["occlusal"]);
			assert.equal(result.isComplex, false);
			assert.equal(result.surfaceCount, 1);
			assert.equal(result.recommendedCode, "A16.07.002.001");
			assert.equal(result.basePrice, 2200);
		});

		it("should handle 2 surfaces correctly (simple)", () => {
			const result = detectCariesBundle(["mesial", "occlusal"]);
			assert.equal(result.isComplex, false);
			assert.equal(result.surfaceCount, 2);
			assert.equal(result.recommendedCode, "A16.07.002.004");
			assert.equal(result.basePrice, 3200);
		});

		it("should handle 3 surfaces correctly (complex)", () => {
			const result = detectCariesBundle(["mesial", "occlusal", "distal"]);
			assert.equal(result.isComplex, true);
			assert.equal(result.surfaceCount, 3);
			assert.equal(result.recommendedCode, "A16.07.002.007");
			assert.equal(result.basePrice, 5700);
		});

		it("should handle 4 surfaces correctly (complex)", () => {
			const result = detectCariesBundle(["mesial", "occlusal", "distal", "buccal"]);
			assert.equal(result.isComplex, true);
			assert.equal(result.surfaceCount, 4);
			assert.equal(result.recommendedCode, "A16.07.002.007");
			assert.equal(result.basePrice, 6900);
		});
	});
});
