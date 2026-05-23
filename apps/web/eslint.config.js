import { defineConfig } from "eslint/config";
import {
  envGlobals,
  reactTypeScript,
  sharedIgnores,
} from "@repo/eslint-config";

export default defineConfig([
  sharedIgnores(),
  reactTypeScript({ tsconfigRootDir: import.meta.dirname }),
]);
