import { Hono } from "hono";

export function createApp() {
  return new Hono()
    .basePath("/api")
    .get("/health", (c) => c.json({ ok: true as const }));
}

/** Single instance for type inference (`AppType`) and the Node runner. */
export const app = createApp();

export type AppType = typeof app;
