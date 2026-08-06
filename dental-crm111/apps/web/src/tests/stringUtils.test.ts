import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { levenshteinDistance } from "../lib/stringUtils.js";

describe("levenshteinDistance", () => {
	it("should return 0 for identical strings", () => {
		assert.equal(levenshteinDistance("", ""), 0);
		assert.equal(levenshteinDistance("hello", "hello"), 0);
	});

	it("should return the length of the other string if one is empty", () => {
		assert.equal(levenshteinDistance("abc", ""), 3);
		assert.equal(levenshteinDistance("", "abc"), 3);
	});

	it("should handle simple substitutions", () => {
		assert.equal(levenshteinDistance("cat", "bat"), 1);
		assert.equal(levenshteinDistance("test", "text"), 1);
	});

	it("should handle simple insertions and deletions", () => {
		assert.equal(levenshteinDistance("cat", "cats"), 1);
		assert.equal(levenshteinDistance("dogs", "dog"), 1);
	});

	it("should handle multiple differences correctly", () => {
		assert.equal(levenshteinDistance("kitten", "sitting"), 3);
		assert.equal(levenshteinDistance("flaw", "lawn"), 2);
		assert.equal(levenshteinDistance("intention", "execution"), 5);
	});

	it("should handle completely different strings", () => {
		assert.equal(levenshteinDistance("abc", "def"), 3);
	});

	it("should handle case sensitivity", () => {
		assert.equal(levenshteinDistance("a", "A"), 1);
		assert.equal(levenshteinDistance("Hello", "hello"), 1);
	});
});
