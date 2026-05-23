import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import globals from "globals";
import { globalIgnores } from "eslint/config";

export const envGlobals = {
  es2023: globals.es2023,
  node: globals.node,
  browser: globals.browser,
};

export function sharedIgnores(...extra) {
  return globalIgnores(["dist", "node_modules", ...extra]);
}

function languageOptions({ tsconfigRootDir, globals: env, jsx = false }) {
  return {
    globals: env,
    parserOptions: {
      tsconfigRootDir,
      ...(jsx ? { ecmaFeatures: { jsx: true } } : {}),
    },
  };
}

export function typescript({
  tsconfigRootDir,
  globals: env,
  files = ["**/*.{ts,mts,cts}"],
}) {
  return {
    files,
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: languageOptions({ tsconfigRootDir, globals: env }),
  };
}

export function reactLibrary({
  tsconfigRootDir,
  globals: env = envGlobals.browser,
  files = ["**/*.{ts,tsx}"],
}) {
  return {
    files,
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: languageOptions({
      tsconfigRootDir,
      globals: env,
      jsx: true,
    }),
  };
}

export function reactTypeScript({
  tsconfigRootDir,
  globals: env = envGlobals.browser,
  files = ["**/*.{ts,tsx}"],
}) {
  return {
    files,
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: languageOptions({
      tsconfigRootDir,
      globals: env,
      jsx: true,
    }),
  };
}
