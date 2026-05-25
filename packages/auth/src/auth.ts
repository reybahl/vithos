import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { betterAuth } from "better-auth";
import { v7 as uuidv7 } from "uuid";

import { db } from "@acme/db";

import { hashPassword, verifyPassword } from "./password";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be set for Better Auth.`);
  }
  return value;
}

function trustedOriginsFromEnv(): string[] {
  return (
    process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? ["http://localhost:5173"]
  );
}

function createAuth() {
  return betterAuth({
    secret: requireEnv("BETTER_AUTH_SECRET"),
    baseURL: requireEnv("BETTER_AUTH_URL"),
    trustedOrigins: trustedOriginsFromEnv(),
    database: kyselyAdapter(db, {
      type: "postgres",
    }),
    advanced: {
      database: {
        generateId: () => uuidv7(),
      },
    },
    emailAndPassword: {
      enabled: true,
      password: {
        hash: hashPassword,
        verify: verifyPassword,
      },
    },
  });
}

type AuthShape = ReturnType<typeof createAuth>;

let cachedAuth: AuthShape | undefined;

/** Better Auth singleton (lazy): Kysely-backed persistence, email/password. */
export const auth = new Proxy({} as AuthShape, {
  get(_target, prop, receiver) {
    cachedAuth ??= createAuth();
    const value = Reflect.get(cachedAuth as object, prop, receiver);
    return typeof value === "function"
      ? (value as (...a: unknown[]) => unknown).bind(cachedAuth)
      : value;
  },
});
