/** Split on commas; trims entries. No origins unless you set env (e.g. Wrangler `[vars]` or `.dev.vars`). */
function parseCsvOrigins(csv: string | undefined): readonly string[] {
  if (!csv?.trim()) return [];
  const set = new Set<string>();
  for (const part of csv.split(",")) {
    const t = part.trim();
    if (t) set.add(t);
  }
  return [...set];
}

/**
 * Mirrors `Origin` only when it appears in **`CORS_ALLOWED_ORIGINS`** (comma-separated HTTPS/HTTP origins).
 * Required for browsers using `credentials: "include"` (cannot use wildcard `*`).
 */
export function corsOriginForBrowserRequest(
  requestOrigin: string | undefined | null,
): string | null {
  if (!requestOrigin) return null;
  const allowed = parseCsvOrigins(process.env.CORS_ALLOWED_ORIGINS);
  return allowed.includes(requestOrigin) ? requestOrigin : null;
}
