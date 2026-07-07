🎯 **What:** Extracted duplicated header secret verification logic into a utility function `verifySecretHeader` in `accessGuard.ts`. Also fixed syntax errors and duplicate declarations in `accessGuard.test.ts`.

💡 **Why:** By extracting the duplication, we improve code maintainability and ensure that updates to header verification rules only need to be made in one location. This resolves the code health issue flagged on line 36 of `accessGuard.ts`.

✅ **Verification:**
- Validated via `vitest run apps/api/src/tests/accessGuard.test.ts` (tests now pass successfully).
- Passed typechecking.
- Received a `Correct` rating from `request_code_review`.

✨ **Result:** Improved maintainability while preserving the original functional logic exactly.
