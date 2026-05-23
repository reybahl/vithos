import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { parseCsvOrigins } from "@acme/hono-app/cors-env";

/**
 * Validates every var read by `@acme/db`, `@acme/auth`, and `@acme/hono-app` In this Node process.
 * Import before any workspace package pulls from `process.env`.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().trim().min(1),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
    CORS_ALLOWED_ORIGINS: z.string().optional(),
    WEB_ORIGIN: z.url().optional().default("http://localhost:5173"),
    PORT: z.coerce.number().int().positive().default(3001),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

/**
 * Single backend source for browser origins allowed to make credentialed requests.
 * Explicit CORS config wins; otherwise reuse Better Auth's trusted origins, then local/dev web origin.
 */
export const browserAllowedOrigins =
  env.CORS_ALLOWED_ORIGINS ?? env.BETTER_AUTH_TRUSTED_ORIGINS ?? env.WEB_ORIGIN;

parseCsvOrigins(browserAllowedOrigins);

process.env.CORS_ALLOWED_ORIGINS ||= browserAllowedOrigins;
process.env.BETTER_AUTH_TRUSTED_ORIGINS ||= browserAllowedOrigins;
