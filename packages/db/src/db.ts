import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./generated/kysely/types.js";

/**
 * Set at the start of each Cloudflare Worker fetch with `env.HYPERDRIVE.connectionString`.
 * When unset, `process.env.DATABASE_URL` is used (Node, API server, wrangler dev, etc.).
 * @see https://developers.cloudflare.com/hyperdrive/configuration/connect-to-postgres/
 */
let edgePreferredConnectionString: string | undefined;

export function configureDatabaseConnectionString(
  connectionString: string | undefined,
): void {
  edgePreferredConnectionString = connectionString;
}

function createDb() {
  const connectionString =
    edgePreferredConnectionString ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Database URL missing: set HYPERDRIVE on the Worker or DATABASE_URL for Node.",
    );
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
