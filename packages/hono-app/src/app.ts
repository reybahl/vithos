import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth } from "@repo/auth";
import { corsOriginForBrowserRequest } from "./cors-env";
import { loadSession, type AuthVariables } from "./auth-middleware";
import { counterRouter } from "./routes/counter";
import { validationExampleRouter } from "./routes/validation-example";

export function createApp() {
  return (
    new Hono<{ Variables: AuthVariables }>()
      .basePath("/api")
      // Registered before `use("*", loadSession)` so this route skips session middleware.
      .get("/health", (c) => c.json({ ok: true as const }))
      .use("*", loadSession)
      .use(
        "/auth/*",
        cors({
          origin: (origin) => corsOriginForBrowserRequest(origin),
          allowHeaders: ["Content-Type", "Authorization"],
          allowMethods: ["POST", "GET", "OPTIONS"],
          exposeHeaders: ["Content-Length"],
          maxAge: 600,
          credentials: true,
        }),
      )
      .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
      .route("/counter", counterRouter)
      .route("/validation-example", validationExampleRouter)
  );
}

export const app = createApp();

export type AppType = typeof app;
