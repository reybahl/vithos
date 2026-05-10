import { db, sql } from "@repo/db";
import { Hono } from "hono";

import { requireAuth, type AuthVariables } from "../auth-middleware";

/** Matches `ClickCounter.id` in Prisma schema — singleton row. */
const COUNTER_ROW_ID = 1;

export const counterRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/", async (c) => {
    const row = await db
      .selectFrom("click_counter")
      .selectAll()
      .where("id", "=", COUNTER_ROW_ID)
      .executeTakeFirst();
    return c.json({ count: row?.clicks ?? 0 });
  })
  .post("/increment", requireAuth, async (c) => {
    const row = await db
      .insertInto("click_counter")
      .values({ id: COUNTER_ROW_ID, clicks: 1 })
      .onConflict((oc) =>
        oc.column("id").doUpdateSet({
          clicks: sql`click_counter.clicks + 1`,
        }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();
    return c.json({ count: row.clicks });
  });
