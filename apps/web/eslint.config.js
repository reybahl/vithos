import { defineConfig } from "eslint/config";
import reactDoctor from "eslint-plugin-react-doctor";
import { reactTypeScript, sharedIgnores } from "@acme/eslint-config";

export default defineConfig([
  sharedIgnores(),
  reactTypeScript({ tsconfigRootDir: import.meta.dirname }),
  reactDoctor.configs.recommended,
  reactDoctor.configs["tanstack-query"],
]);
