import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

/**
 * Validates every var read by `@acme/db`, `@acme/auth`, and `@acme/hono-app` in this Node process.
 * Import before any workspace package pulls from `process.env`.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().trim().min(1),
    BETTER_AUTH_URL: z.url(),
    PORT: z.coerce.number().int().positive().default(3001),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
