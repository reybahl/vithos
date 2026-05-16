import { AsyncLocalStorage } from "node:async_hooks";
import { Kysely, PostgresDialect } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import { Pool } from "pg";
import postgres from "postgres";

import type { DB } from "./generated/kysely/types.js";

/**
 * Per-request Kysely for Cloudflare Workers (Postgres.js). Cloudflare recommends creating a new
 * `postgres()` client each invocation; Hyperdrive owns the real pool. This ALS carries the instance
 * through `await` so shared code can keep using `import { db } from "@repo/db"`.
 *
 * @see https://developers.cloudflare.com/hyperdrive/concepts/connection-lifecycle/
 * @see https://developers.cloudflare.com/workers/runtime-apis/nodejs/asynclocalstorage/
 */
const workerRequestDb = new AsyncLocalStorage<Kysely<DB>>();

/**
 * Run `fn` with a fresh Postgres.js + Kysely bound to `db`. Call once per Worker `fetch`.
 * Do not call `sql.end()`; Workers + Hyperdrive clean up when the invocation ends.
 */
export function runWithWorkerDatabase<T>(
  connectionString: string,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  const sql = postgres(connectionString, {
    max: 5,
    fetch_types: false,
    prepare: true,
  });
  const kysely = new Kysely<DB>({
    dialect: new PostgresJSDialect({ postgres: sql }),
  });
  return workerRequestDb.run(kysely, fn);
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

let prodDbSingleton: Kysely<DB> | undefined;

function resolveDb(): Kysely<DB> {
  const edge = workerRequestDb.getStore();
  if (edge) {
    return edge;
  }

  if (process.env.NODE_ENV !== "production") {
    if (!globalForDb.db) globalForDb.db = createNodeDb();
    return globalForDb.db;
  }
  prodDbSingleton ??= createNodeDb();
  return prodDbSingleton;
}

/**
 * Lazy Kysely: avoids connecting (and needing DATABASE_URL) at module load.
 * On Workers, only valid inside `runWithWorkerDatabase`.
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
