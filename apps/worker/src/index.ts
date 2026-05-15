import { app } from "@repo/hono-app/app";
import { corsOriginForBrowserRequest } from "@repo/hono-app/cors-env";
import { cors } from "hono/cors";
import { Hono } from "hono";

/**
 * Workers entry: CORS mirrors `Origin` only if listed in env **`CORS_ALLOWED_ORIGINS`**
 * (comma-separated). Required alongside `credentials: "include"` on the web client.
 */
const worker = new Hono();

worker.use(
  "*",
  cors({
    origin: (origin) => corsOriginForBrowserRequest(origin),
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

worker.route("/", app);

export default worker;
