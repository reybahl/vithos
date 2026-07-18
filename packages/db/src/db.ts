import { AsyncLocalStorage } from "node:async_hooks";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./generated/kysely/types.js";

/**
 * Per-request Kysely for Cloudflare Workers (`pg` Client via Hyperdrive). Cloudflare
 * recommends a new `Client` per invocation — not `Pool`. Hyperdrive owns the real pool.
 *
 * @see https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/
 * @see https://developers.cloudflare.com/hyperdrive/concepts/connection-lifecycle/
 */
const workerRequestDb = new AsyncLocalStorage<Kysely<DB>>();

let workerRuntime = false;

/** Called from `apps/worker` so `@acme/db` never falls back to Node pooling on Workers. */
export function enableWorkerRuntime() {
  workerRuntime = true;
}

/**
 * Run `fn` with a per-request `pg` pool (max 1) bound to Hyperdrive. Call once per Worker `fetch`.
 * Do not call `pool.end()`; Workers + Hyperdrive clean up when the invocation ends.
 */
export function runWithWorkerDatabase<T>(
  connectionString: string,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 0,
    allowExitOnIdle: true,
  });
  const kysely = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
  });
  return workerRequestDb.run(kysely, fn);
}

function createNodeDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to use @acme/db.");
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

  if (workerRuntime) {
    throw new Error("@acme/db: database used outside runWithWorkerDatabase on Cloudflare Workers.");
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
  /** `in` / reflection must hit the real Kysely, not the empty target, for adapters that introspect `db`. */
  has(_target, prop) {
    return Reflect.has(resolveDb() as object, prop);
  },
});

export type { DB };
