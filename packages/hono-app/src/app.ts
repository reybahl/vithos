import { Hono } from "hono";

import { auth } from "@acme/auth";
import { loadSession, type AuthVariables } from "./auth-middleware";
import { counterRouter } from "./routes/counter";
import { validationExampleRouter } from "./routes/validation-example";

export function createApp() {
  return (
    new Hono<{ Variables: AuthVariables }>()
      .basePath("/api")
      // Registered before `use("*", loadSession)` so these routes skip session middleware.
      .get("/health", (c) => c.json({ ok: true as const }))
      .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
      .use("*", loadSession)
      .route("/counter", counterRouter)
      .route("/validation-example", validationExampleRouter)
  );
}

export type AppType = ReturnType<typeof createApp>;
