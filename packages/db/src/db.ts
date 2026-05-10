import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./generated/kysely/types.js";

const connectionString = process.env.DATABASE_URL;

const createDb = () => {
  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to use @repo/db.");
  }

  const dialect = new PostgresDialect({
    pool: new Pool({ connectionString }),
  });

  return new Kysely<DB>({ dialect });
};

const globalForDb = globalThis as unknown as {
  db: Kysely<DB> | undefined;
};

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

export type { DB };
