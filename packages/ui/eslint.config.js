import { defineConfig } from "eslint/config";
import { reactLibrary, sharedIgnores } from "@acme/eslint-config";

export default defineConfig([
  sharedIgnores(),
  reactLibrary({ tsconfigRootDir: import.meta.dirname }),
]);
