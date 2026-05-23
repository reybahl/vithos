import { defineConfig } from "eslint/config";
import { reactLibrary, sharedIgnores } from "@repo/eslint-config";

export default defineConfig([
  sharedIgnores(),
  reactLibrary({ tsconfigRootDir: import.meta.dirname }),
]);
