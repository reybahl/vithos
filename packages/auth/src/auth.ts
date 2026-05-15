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

function createAuth() {
  const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((o) => o.trim())
    .filter(Boolean) ?? ["http://localhost:5173"];

  return betterAuth({
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
}

type AuthShape = ReturnType<typeof createAuth>;

let cachedAuth: AuthShape | undefined;

/**
 * Better Auth singleton (lazy): Kysely-backed persistence, email/password, joins.
 */
export const auth = new Proxy({} as AuthShape, {
  get(_target, prop, receiver) {
    cachedAuth ??= createAuth();
    const value = Reflect.get(cachedAuth as object, prop, receiver);
    return typeof value === "function"
      ? (value as (...a: unknown[]) => unknown).bind(cachedAuth)
      : value;
  },
});
