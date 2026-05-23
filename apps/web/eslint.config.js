import { defineConfig } from "eslint/config";
import { reactTypeScript, sharedIgnores } from "@acme/eslint-config";

export default defineConfig([
  sharedIgnores(),
  reactTypeScript({ tsconfigRootDir: import.meta.dirname }),
]);
