import type { Context } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth } from "@acme/auth";
import { corsOriginForBrowserRequest } from "./cors-env";
import { requireTrustedBrowserOrigin } from "./csrf-middleware";
import { loadSession, type AuthVariables } from "./auth-middleware";
import { counterRouter } from "./routes/counter";
import { validationExampleRouter } from "./routes/validation-example";

export type CreateAppOptions = {
  /**
   * Comma-separated browser origins allowed for credentialed CORS (e.g. `https://app.example.com`).
   * Resolve from `process.env`, worker bindings, or any host-specific config in the app entry.
   */
  getCorsAllowedOriginsCsv: (c: Context) => string | undefined;
};

export function createApp(options: CreateAppOptions) {
  const { getCorsAllowedOriginsCsv } = options;
  return (
    new Hono<{ Variables: AuthVariables }>()
      .basePath("/api")
      // Registered before `use("*", loadSession)` so these routes skip session middleware.
      .get("/health", (c) => c.json({ ok: true as const }))
      .use(
        "/auth/*",
        cors({
          origin: (origin, c) =>
            corsOriginForBrowserRequest(origin, getCorsAllowedOriginsCsv(c)),
          allowHeaders: ["Content-Type", "Authorization"],
          allowMethods: ["POST", "GET", "OPTIONS"],
          exposeHeaders: ["Content-Length"],
          maxAge: 600,
          credentials: true,
        }),
      )
      .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
      .use(
        "*",
        requireTrustedBrowserOrigin({
          getAllowedOriginsCsv: getCorsAllowedOriginsCsv,
        }),
      )
      .use("*", loadSession)
      .route("/counter", counterRouter)
      .route("/validation-example", validationExampleRouter)
  );
}

export type AppType = ReturnType<typeof createApp>;
