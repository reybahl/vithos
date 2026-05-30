import { enableWorkerRuntime, runWithWorkerDatabase } from "@acme/db";

enableWorkerRuntime();
import { createApp } from "@acme/hono-app/app";
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
  BETTER_AUTH_URL?: string;
  /** Preview CI only — direct Neon branch URL. Production uses Hyperdrive. */
  DATABASE_URL?: string;
  HYPERDRIVE?: { connectionString: string };
};

function nonEmpty(value: string | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

const app = createApp();

const worker = new Hono();

worker.use("*", async (c, next) => {
  await next();
  setSecurityHeaders(c.res.headers);
});

worker.route("/", app);

export default {
  fetch(
    request: Request,
    env: AppBindings,
    _ctx: ExecutionContext,
  ): Response | Promise<Response> {
    if (nonEmpty(env.BETTER_AUTH_URL)) {
      process.env.BETTER_AUTH_URL = env.BETTER_AUTH_URL;
    }

    const cs =
      nonEmpty(env.DATABASE_URL) ?? nonEmpty(env.HYPERDRIVE?.connectionString);
    if (!cs) {
      const headers = new Headers({ "Content-Type": "application/json" });
      setSecurityHeaders(headers);
      return new Response(
        JSON.stringify({
          error:
            "Database is not configured (set DATABASE_URL for preview or HYPERDRIVE for production).",
        }),
        { status: 500, headers },
      );
    }
    return runWithWorkerDatabase(cs, () => worker.fetch(request, env, _ctx));
  },
};
