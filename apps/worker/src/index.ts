import { enableWorkerRuntime, runWithWorkerDatabase } from "@acme/db";

enableWorkerRuntime();
import { createApp } from "@acme/hono-app/app";
import {
  corsOriginForBrowserRequest,
  parseCsvOrigins,
} from "@acme/hono-app/cors-env";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { Hono } from "hono";

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'none'",
  "Permissions-Policy":
    "camera=(), geolocation=(), microphone=(), payment=(), usb=(), document-domain=()",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

function setSecurityHeaders(headers: Headers) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
}

type AppBindings = {
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  CORS_ALLOWED_ORIGINS?: string;
  HYPERDRIVE?: { connectionString: string };
  WEB_ORIGIN?: string;
};

function nonEmpty(value: string | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

/** Cloudflare Worker bindings (Dashboard / `wrangler.toml` [vars]). */
function corsAllowedOriginsFromBindings(c: Context): string | undefined {
  const env = c.env as AppBindings | undefined;
  return (
    nonEmpty(env?.CORS_ALLOWED_ORIGINS) ??
    nonEmpty(env?.BETTER_AUTH_TRUSTED_ORIGINS) ??
    nonEmpty(env?.WEB_ORIGIN)
  );
}

const app = createApp({
  getCorsAllowedOriginsCsv: corsAllowedOriginsFromBindings,
});

const worker = new Hono();

worker.use("*", async (c, next) => {
  await next();
  setSecurityHeaders(c.res.headers);
});

worker.use("*", async (c, next) => {
  try {
    parseCsvOrigins(corsAllowedOriginsFromBindings(c));
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid browser origin configuration.",
      },
      500,
    );
  }
  await next();
});

/**
 * Hono's `cors()` sets headers on `c.res` before `next()`, but Better Auth's
 * `auth.handler()` returns a fresh `Response`, which replaces `c.res` and drops those
 * headers. Re-apply credentialed CORS to the *final* response after the subtree runs.
 */
worker.use("*", async (c, next) => {
  await next();
  const allow = corsOriginForBrowserRequest(
    c.req.header("origin") || undefined,
    corsAllowedOriginsFromBindings(c),
  );
  if (allow) {
    c.res.headers.set("Access-Control-Allow-Origin", allow);
    c.res.headers.set("Access-Control-Allow-Credentials", "true");
  }
});

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

export default {
  fetch(
    request: Request,
    env: AppBindings,
    _ctx: ExecutionContext,
  ): Response | Promise<Response> {
    const browserAllowedOrigins =
      nonEmpty(env.CORS_ALLOWED_ORIGINS) ??
      nonEmpty(env.BETTER_AUTH_TRUSTED_ORIGINS) ??
      nonEmpty(env.WEB_ORIGIN);

    if (browserAllowedOrigins) {
      process.env.CORS_ALLOWED_ORIGINS ||= browserAllowedOrigins;
      process.env.BETTER_AUTH_TRUSTED_ORIGINS ||= browserAllowedOrigins;
    }

    const cs = env.HYPERDRIVE?.connectionString;
    if (!cs) {
      const headers = new Headers({ "Content-Type": "application/json" });
      setSecurityHeaders(headers);
      return new Response(
        JSON.stringify({
          error: "HYPERDRIVE binding is not configured on this Worker.",
        }),
        { status: 500, headers },
      );
    }
    return runWithWorkerDatabase(cs, () => worker.fetch(request, env, _ctx));
  },
};
