import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

/**
 * Client-safe env only (`VITE_*`). Kept separate from server schemas so sensitive names stay out of the browser bundle ([T3 Env docs](https://env.t3.gg/docs/core)).
 * `runtimeEnvStrict` satisfies Vite’s tree-shaking of `import.meta.env` keys ([t3-env core](https://env.t3.gg/docs/core)).
 */
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.url().optional(),
  },
  runtimeEnvStrict: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  },
  emptyStringAsUndefined: true,
});
