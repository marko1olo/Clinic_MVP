import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatCurrencyNumeric } from "../../utils/inputSanitation.js";

describe("formatCurrencyNumeric", () => {
    it("should handle positive numbers by rounding and converting to string", () => {
        assert.equal(formatCurrencyNumeric(123.45), "123");
        assert.equal(formatCurrencyNumeric(123.55), "124");
    });

    it("should handle zero and negative numbers by clamping to 0", () => {
        assert.equal(formatCurrencyNumeric(0), "0");
        assert.equal(formatCurrencyNumeric(-50.5), "0");
    });

    it("should extract digits from a string and parse to number", () => {
        assert.equal(formatCurrencyNumeric("123"), "123");
        assert.equal(formatCurrencyNumeric("abc123def"), "123");
        assert.equal(formatCurrencyNumeric("$ 1,234.56"), "123456");
    });

    it("should return empty string if no digits are found in string", () => {
        assert.equal(formatCurrencyNumeric(""), "");
        assert.equal(formatCurrencyNumeric("abc"), "");
        assert.equal(formatCurrencyNumeric(" "), "");
    });
});
