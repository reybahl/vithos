import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

/** Node-only (imported by `vite.config.ts` only)—same folder as client env for discoverability ([T3 Env](https://env.t3.gg/docs/core)). */
export const env = createEnv({
  server: {
    API_PORT: z.coerce.number().int().positive().default(3001),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
