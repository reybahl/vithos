import { defineConfig } from "eslint/config";
import { envGlobals, sharedIgnores, typescript } from "@acme/eslint-config";

export default defineConfig([
  sharedIgnores(".wrangler"),
  typescript({
    tsconfigRootDir: import.meta.dirname,
    globals: envGlobals.es2023,
  }),
]);
