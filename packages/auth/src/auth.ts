import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { betterAuth } from "better-auth";

import { db } from "@repo/db";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set for Better Auth.`);
  }
  return value;
}

/**
 * Single Better Auth instance: Kysely-backed persistence, email/password, experimental joins.
 * Mount `auth.handler` on your server (see `@repo/hono-app`). Use `npx auth@latest generate`
 * with `--config` pointing here to refresh `packages/db/prisma/schema.prisma`.
 */
const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
  .map((o) => o.trim())
  .filter(Boolean) ?? ["http://localhost:5173"];

export const auth = betterAuth({
  secret: requireEnv("BETTER_AUTH_SECRET"),
  baseURL: requireEnv("BETTER_AUTH_URL"),
  trustedOrigins,
  database: kyselyAdapter(db, {
    type: "postgres",
  }),
  emailAndPassword: {
    enabled: true,
  },
  experimental: {
    joins: true,
  },
});
