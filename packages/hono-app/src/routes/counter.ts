import { Hono } from "hono";

import { requireAuth, type AuthVariables } from "../auth-middleware";

/** Matches `ClickCounter.id` in Prisma schema — singleton row. */
const COUNTER_ROW_ID = 1;

async function getDb() {
  const { db } = await import("@repo/db");
  return db;
}

export const counterRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/", async (c) => {
    const db = await getDb();
    const row = await db.clickCounter.findUnique({
      where: { id: COUNTER_ROW_ID },
    });
    return c.json({ count: row?.clicks ?? 0 });
  })
  .post("/increment", requireAuth, async (c) => {
    const db = await getDb();
    const row = await db.clickCounter.upsert({
      where: { id: COUNTER_ROW_ID },
      create: { id: COUNTER_ROW_ID, clicks: 1 },
      update: { clicks: { increment: 1 } },
    });
    return c.json({ count: row.clicks });
  });
