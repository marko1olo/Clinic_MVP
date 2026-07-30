import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	formatPhoneNumber,
	formatCurrencyNumeric,
} from "../utils/inputSanitation.js";

describe("formatPhoneNumber", () => {
	it("returns falsy or empty input as is", () => {
		assert.equal(formatPhoneNumber(""), "");
		assert.equal(formatPhoneNumber(null as unknown as string), null as unknown as string);
		assert.equal(formatPhoneNumber(undefined as unknown as string), undefined as unknown as string);
	});

	it("returns empty string if input contains no digits", () => {
		assert.equal(formatPhoneNumber("abc"), "");
		assert.equal(formatPhoneNumber("!@#"), "");
	});

	it("formats Russian numbers starting with 7 or 8", () => {
		assert.equal(formatPhoneNumber("79991234567"), "+7 (999) 123-45-67");
		assert.equal(formatPhoneNumber("89991234567"), "+7 (999) 123-45-67");
	});

	it("formats 10+ digit numbers not starting with 7 or 8 with +7 fallback", () => {
		assert.equal(formatPhoneNumber("9991234567"), "+7 (999) 123-45-67");
	});

	it("formats incomplete numbers not starting with 7 or 8", () => {
		assert.equal(formatPhoneNumber("123"), "+(123");
		assert.equal(formatPhoneNumber("12345"), "+(123) 45");
		assert.equal(formatPhoneNumber("1234567"), "+(123) 456-7");
	});

	it("formats single digit 7 or 8 as prefix only", () => {
		assert.equal(formatPhoneNumber("7"), "+7 ");
		assert.equal(formatPhoneNumber("8"), "+7 ");
	});

	it("strips non-digit characters before formatting", () => {
		assert.equal(formatPhoneNumber("+7 (999) 123-45-67"), "+7 (999) 123-45-67");
		assert.equal(formatPhoneNumber("8-999-123-45-67"), "+7 (999) 123-45-67");
		assert.equal(formatPhoneNumber("abc8999xyz123!!45  67"), "+7 (999) 123-45-67");
	});
});

describe("formatCurrencyNumeric", () => {
	it("handles number inputs correctly (rounding and max 0)", () => {
		assert.equal(formatCurrencyNumeric(100), "100");
		assert.equal(formatCurrencyNumeric(100.5), "101");
		assert.equal(formatCurrencyNumeric(100.4), "100");
		assert.equal(formatCurrencyNumeric(-50), "0");
		assert.equal(formatCurrencyNumeric(-0.5), "0");
	});

	it("handles string inputs by stripping non-digits and parsing", () => {
		assert.equal(formatCurrencyNumeric("100"), "100");
		assert.equal(formatCurrencyNumeric("1,000.50"), "100050");
		assert.equal(formatCurrencyNumeric("abc 123 xyz"), "123");
		assert.equal(formatCurrencyNumeric("00123"), "123");
	});

	it("returns empty string for empty or non-digit string inputs", () => {
		assert.equal(formatCurrencyNumeric(""), "");
		assert.equal(formatCurrencyNumeric("abc"), "");
		assert.equal(formatCurrencyNumeric("!@#"), "");
	});
});
