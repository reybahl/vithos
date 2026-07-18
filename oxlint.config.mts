import { defineConfig } from "oxlint";

export default defineConfig({
  env: {
    builtin: true,
  },
  ignorePatterns: [
    "**/dist",
    "**/node_modules",
    "apps/worker/.wrangler",
    "packages/db/src/generated",
  ],
  overrides: [
    {
      files: ["packages/auth/**/*.{ts,mts,cts}"],
      env: {
        node: true,
      },
    },
    {
      files: ["packages/ui/**/*.{ts,tsx}"],
      plugins: ["eslint", "typescript", "unicorn", "oxc", "react"],
      env: {
        browser: true,
      },
      rules: {
        "react/exhaustive-deps": "warn",
        "react/rules-of-hooks": "error",
      },
    },
  ],
});
