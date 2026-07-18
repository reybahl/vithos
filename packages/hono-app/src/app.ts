import { Hono } from "hono";

import { auth, authObservabilityConfig } from "@acme/auth";
import { loadSession, type AuthVariables } from "./auth-middleware";
import { counterRouter } from "./routes/counter";
import { validationExampleRouter } from "./routes/validation-example";

function originOrNull(value: string | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function createApp() {
  return (
    new Hono<{ Variables: AuthVariables }>()
      .basePath("/api")
      // Registered before `use("*", loadSession)` so these routes skip session middleware.
      .get("/health", (c) => c.json({ ok: true as const }))
      .on(["POST", "GET"], "/auth/*", async (c) => {
        try {
          const response = await auth.handler(c.req.raw);

          // Better Auth returns invalid-origin as an ordinary 4xx response, which Cloudflare
          // correctly records as a successful Worker invocation. Log the public origin context
          // here so it is queryable alongside that invocation without exposing credentials.
          if (response.status >= 400) {
            const { baseUrlOrigin, trustedOrigins } = authObservabilityConfig();
            console.warn({
              event: "auth_response_error",
              method: c.req.method,
              path: c.req.path,
              requestOrigin: new URL(c.req.url).origin,
              host: c.req.header("host") ?? null,
              origin: c.req.header("origin") ?? null,
              refererOrigin: originOrNull(c.req.header("referer")),
              responseStatus: response.status,
              authBaseUrlOrigin: baseUrlOrigin,
              authTrustedOrigins: trustedOrigins,
            });
          }

          return response;
        } catch (error) {
          console.error({
            event: "auth_handler_exception",
            method: c.req.method,
            path: c.req.path,
            requestOrigin: new URL(c.req.url).origin,
            host: c.req.header("host") ?? null,
            origin: c.req.header("origin") ?? null,
            errorName: error instanceof Error ? error.name : "non-error-thrown",
          });
          throw error;
        }
      })
      .use("*", loadSession)
      .route("/counter", counterRouter)
      .route("/validation-example", validationExampleRouter)
  );
}

export type AppType = ReturnType<typeof createApp>;
