import reactDoctor from "eslint-plugin-react-doctor";
import { defineConfig } from "oxlint";

export default defineConfig({
  env: {
    builtin: true,
  },
  ignorePatterns: ["dist", "node_modules", ".wrangler"],
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts,jsx}"],
      jsPlugins: ["eslint-plugin-react-doctor"],
      rules: {
        ...reactDoctor.configs.recommended.rules,
        ...reactDoctor.configs["tanstack-query"].rules,
      },
    },
  ],
});
