/** Split on commas; trims entries. */
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
 * Mirrors `Origin` only when it appears in the allowed list (comma-separated HTTPS/HTTP origins).
 * Required for browsers using `credentials: "include"` (cannot use wildcard `*`).
 *
 * Callers resolve the CSV from their runtime (`process.env`, `c.env`, validated config, etc.).
 */
export function corsOriginForBrowserRequest(
  requestOrigin: string | undefined | null,
  allowedOriginsCsv: string | undefined,
): string | null {
  if (!requestOrigin) return null;
  const allowed = parseCsvOrigins(allowedOriginsCsv);
  return allowed.includes(requestOrigin) ? requestOrigin : null;
}
