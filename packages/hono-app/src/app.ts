import { Hono } from "hono";

import { counterRouter } from "./routes/counter";

export function createApp() {
  return new Hono()
    .basePath("/api")
    .get("/health", (c) => c.json({ ok: true as const }))
    .route("/counter", counterRouter);
}

/** Single instance for type inference (`AppType`) and the Node runner. */
export const app = createApp();

export type AppType = typeof app;
