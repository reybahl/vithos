import { defineConfig } from "eslint/config";
import reactDoctor from "eslint-plugin-react-doctor";
import { envGlobals, sharedIgnores, typescript } from "@acme/eslint-config";

export default defineConfig([
  sharedIgnores(".wrangler"),
  typescript({
    tsconfigRootDir: import.meta.dirname,
    globals: envGlobals.es2023,
  }),
  reactDoctor.configs.recommended,
  reactDoctor.configs["tanstack-query"],
]);
