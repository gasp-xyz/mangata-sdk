import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    /**
     * By default, vitest search test files in all packages.
     * For e2e tests have sense search only is project root tests folder
     */
    include: ["./test/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    /**
     * A default timeout of 5000ms is sometimes not enough for playwright.
     */
    testTimeout: 360000,
    hookTimeout: 360000
  }
});
