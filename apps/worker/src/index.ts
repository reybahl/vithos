import { createApp } from "@repo/hono-app/app";
import { corsOriginForBrowserRequest } from "@repo/hono-app/cors-env";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { Hono } from "hono";

/** Cloudflare Worker bindings (Dashboard / `wrangler.toml` [vars]). */
function corsAllowedOriginsFromBindings(c: Context): string | undefined {
  const raw = (c.env as Record<string, string | undefined> | undefined)
    ?.CORS_ALLOWED_ORIGINS;
  return typeof raw === "string" && raw.trim() ? raw : undefined;
}

const app = createApp({
  getCorsAllowedOriginsCsv: corsAllowedOriginsFromBindings,
});

const worker = new Hono();

worker.use(
  "*",
  cors({
    origin: (origin, c) =>
      corsOriginForBrowserRequest(origin, corsAllowedOriginsFromBindings(c)),
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

worker.route("/", app);

export default worker;
