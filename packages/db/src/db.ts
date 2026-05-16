import { AsyncLocalStorage } from "node:async_hooks";

import { Kysely, PostgresDialect } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import { Pool } from "pg";
import postgres from "postgres";

import type { DB } from "./generated/kysely/types.js";

/**
 * Workers + Hyperdrive: use Postgres.js per request (Cloudflare guidance). A shared `pg` Pool
 * often deadlocks / appears hung on the Workers runtime.
 */
const edgeRequestDb = new AsyncLocalStorage<Kysely<DB>>();

export function runWithEdgeDatabase<T>(
  kysely: Kysely<DB>,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  return edgeRequestDb.run(kysely, fn);
}

/** Call once per Worker fetch when using Hyperdrive; `close()` in `finally`. */
export function createEdgeKysely(connectionString: string): {
  kysely: Kysely<DB>;
  close: () => Promise<void>;
} {
  const sql = postgres(connectionString, {
    max: 5,
    fetch_types: false,
    prepare: true,
  });
  const kysely = new Kysely<DB>({
    dialect: new PostgresJSDialect({ postgres: sql }),
  });
  return {
    kysely,
    async close() {
      await sql.end({ timeout: 10 });
    },
  };
}

function createNodeDb() {
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
  const fromEdge = edgeRequestDb.getStore();
  if (fromEdge) return fromEdge;

  if (process.env.NODE_ENV !== "production") {
    if (!globalForDb.db) globalForDb.db = createNodeDb();
    return globalForDb.db;
  }
  prodDbSingleton ??= createNodeDb();
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
