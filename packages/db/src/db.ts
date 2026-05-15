import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./generated/kysely/types.js";

function createDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to use @repo/db.");
  }

  const dialect = new PostgresDialect({
    pool: new Pool({ connectionString }),
  });

  return new Kysely<DB>({ dialect });
}

const globalForDb = globalThis as unknown as {
  db: Kysely<DB> | undefined;
};

/** One pool per isolate. Dev also pins on global for HMR-style reload in Node. */
let prodDbSingleton: Kysely<DB> | undefined;

function resolveDb(): Kysely<DB> {
  if (process.env.NODE_ENV !== "production") {
    if (!globalForDb.db) globalForDb.db = createDb();
    return globalForDb.db;
  }
  prodDbSingleton ??= createDb();
  return prodDbSingleton;
}

/**
 * Lazy Kysely: avoids connecting (and needing DATABASE_URL) at module load.
 */
export const db = new Proxy({} as Kysely<DB>, {
  get(_target, prop, receiver) {
    const instance = resolveDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function"
      ? (value as (...a: unknown[]) => unknown).bind(instance)
      : value;
  },
});

export type { DB };
