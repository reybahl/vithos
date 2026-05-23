import type { Context, MiddlewareHandler } from "hono";

import { isOriginAllowedForBrowserRequest } from "./cors-env";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function originFromReferer(referer: string | undefined): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function requireTrustedBrowserOrigin(options: {
  getAllowedOriginsCsv: (c: Context) => string | undefined;
}): MiddlewareHandler {
  return async (c, next) => {
    if (!UNSAFE_METHODS.has(c.req.method.toUpperCase())) {
      await next();
      return;
    }

    const allowedOriginsCsv = options.getAllowedOriginsCsv(c);
    const requestOrigin =
      c.req.header("origin") ?? originFromReferer(c.req.header("referer"));

    if (requestOrigin) {
      if (isOriginAllowedForBrowserRequest(requestOrigin, allowedOriginsCsv)) {
        await next();
        return;
      }
      return c.json({ error: "Forbidden origin." }, 403);
    }

    // Browser cookie writes without Origin/Referer are ambiguous; fail closed for CSRF.
    if (c.req.header("cookie")) {
      return c.json({ error: "Missing trusted origin." }, 403);
    }

    await next();
  };
}
