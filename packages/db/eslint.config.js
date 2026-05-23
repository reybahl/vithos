import { defineConfig } from "eslint/config";
import { envGlobals, sharedIgnores, typescript } from "@repo/eslint-config";

export default defineConfig([
  sharedIgnores("src/generated"),
  typescript({
    tsconfigRootDir: import.meta.dirname,
    globals: envGlobals.es2023,
  }),
]);
