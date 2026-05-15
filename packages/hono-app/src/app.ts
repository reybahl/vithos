import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth } from "@repo/auth";
import { loadSession, type AuthVariables } from "./auth-middleware";
import { counterRouter } from "./routes/counter";
import { validationExampleRouter } from "./routes/validation-example";

const authCorsOrigin = process.env.WEB_ORIGIN ?? "http://localhost:5173";

export function createApp() {
  return new Hono<{ Variables: AuthVariables }>()
    .basePath("/api")
    .use("*", loadSession)
    .use(
      "/auth/*",
      cors({
        origin: authCorsOrigin,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
      }),
    )
    .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
    .get("/health", (c) => c.json({ ok: true as const }))
    .route("/counter", counterRouter)
    .route("/validation-example", validationExampleRouter);
}

export const app = createApp();

export type AppType = typeof app;
