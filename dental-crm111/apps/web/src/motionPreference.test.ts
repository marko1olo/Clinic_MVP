import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { prefersReducedMotion, motionSafeScrollBehavior, motionSafeScrollIntoView } from "./motionPreference.js";

describe("motionPreference", () => {
  let originalWindow: typeof globalThis.window | undefined;

  beforeEach(() => {
    // Save the original window if it exists
    originalWindow = globalThis.window;
  });

  afterEach(() => {
    // Restore the original window
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    } else {
      // @ts-ignore - delete is the best way to clean up if it didn't exist
      delete globalThis.window;
    }
  });

  describe("prefersReducedMotion", () => {
    test("returns false when window is undefined", () => {
      // @ts-ignore
      delete globalThis.window;
      assert.strictEqual(prefersReducedMotion(), false);
    });

    test("returns false when window.matchMedia is undefined", () => {
      globalThis.window = {} as any;
      assert.strictEqual(prefersReducedMotion(), false);
    });

    test("returns false when window.matchMedia is not a function", () => {
      globalThis.window = { matchMedia: "not a function" } as any;
      assert.strictEqual(prefersReducedMotion(), false);
    });

    test("returns false when matchMedia returns matches: false", () => {
      let passedQuery = "";
      globalThis.window = {
        matchMedia: (query: string) => {
          passedQuery = query;
          return { matches: false };
        },
      } as any;

      assert.strictEqual(prefersReducedMotion(), false);
      assert.strictEqual(passedQuery, "(prefers-reduced-motion: reduce)");
    });

    test("returns true when matchMedia returns matches: true", () => {
      let passedQuery = "";
      globalThis.window = {
        matchMedia: (query: string) => {
          passedQuery = query;
          return { matches: true };
        },
      } as any;

      assert.strictEqual(prefersReducedMotion(), true);
      assert.strictEqual(passedQuery, "(prefers-reduced-motion: reduce)");
    });
  });

  describe("motionSafeScrollBehavior", () => {
    test("returns 'smooth' when prefersReducedMotion is false", () => {
      globalThis.window = {
        matchMedia: () => ({ matches: false }),
      } as any;
      assert.strictEqual(motionSafeScrollBehavior(), "smooth");
    });

    test("returns 'auto' when prefersReducedMotion is true", () => {
      globalThis.window = {
        matchMedia: () => ({ matches: true }),
      } as any;
      assert.strictEqual(motionSafeScrollBehavior(), "auto");
    });
  });

  describe("motionSafeScrollIntoView", () => {
    test("does not throw when target is null", () => {
      assert.doesNotThrow(() => {
        motionSafeScrollIntoView(null);
      });
    });

    test("does not throw when target is undefined", () => {
      assert.doesNotThrow(() => {
        motionSafeScrollIntoView(undefined);
      });
    });

    test("calls scrollIntoView with { behavior: 'smooth' } when prefersReducedMotion is false", () => {
      globalThis.window = {
        matchMedia: () => ({ matches: false }),
      } as any;

      let calledWithOptions: ScrollIntoViewOptions | undefined;
      const mockElement = {
        scrollIntoView: (options?: ScrollIntoViewOptions) => {
          calledWithOptions = options;
        },
      } as unknown as Element;

      motionSafeScrollIntoView(mockElement);
      assert.deepStrictEqual(calledWithOptions, { behavior: "smooth" });
    });

    test("calls scrollIntoView with { behavior: 'auto' } when prefersReducedMotion is true", () => {
      globalThis.window = {
        matchMedia: () => ({ matches: true }),
      } as any;

      let calledWithOptions: ScrollIntoViewOptions | undefined;
      const mockElement = {
        scrollIntoView: (options?: ScrollIntoViewOptions) => {
          calledWithOptions = options;
        },
      } as unknown as Element;

      motionSafeScrollIntoView(mockElement);
      assert.deepStrictEqual(calledWithOptions, { behavior: "auto" });
    });

    test("passes along other options while forcing behavior to 'smooth' when prefersReducedMotion is false", () => {
      globalThis.window = {
        matchMedia: () => ({ matches: false }),
      } as any;

      let calledWithOptions: ScrollIntoViewOptions | undefined;
      const mockElement = {
        scrollIntoView: (options?: ScrollIntoViewOptions) => {
          calledWithOptions = options;
        },
      } as unknown as Element;

      motionSafeScrollIntoView(mockElement, { block: "center", inline: "nearest" });
      assert.deepStrictEqual(calledWithOptions, { behavior: "smooth", block: "center", inline: "nearest" });
    });

    test("passes along other options while forcing behavior to 'auto' when prefersReducedMotion is true", () => {
      globalThis.window = {
        matchMedia: () => ({ matches: true }),
      } as any;

      let calledWithOptions: ScrollIntoViewOptions | undefined;
      const mockElement = {
        scrollIntoView: (options?: ScrollIntoViewOptions) => {
          calledWithOptions = options;
        },
      } as unknown as Element;

      motionSafeScrollIntoView(mockElement, { block: "start" });
      assert.deepStrictEqual(calledWithOptions, { behavior: "auto", block: "start" });
    });
  });
});
