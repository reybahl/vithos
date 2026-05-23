import { defineConfig } from "eslint/config";
import { envGlobals, sharedIgnores, typescript } from "@repo/eslint-config";

export default defineConfig([
  sharedIgnores(),
  typescript({
    tsconfigRootDir: import.meta.dirname,
    globals: { ...envGlobals.es2023, ...envGlobals.node },
  }),
]);
