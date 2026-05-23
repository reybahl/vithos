function isLocalHttpOrigin(url: URL): boolean {
  return (
    url.protocol === "http:" &&
    (url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]")
  );
}

function toOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" && !isLocalHttpOrigin(url)) {
    throw new Error(
      `CORS_ALLOWED_ORIGINS contains an insecure non-local origin: ${value}`,
    );
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      `CORS_ALLOWED_ORIGINS entries must be origins only, not full URLs: ${value}`,
    );
  }
  return url.origin;
}

/** Split on commas, trim entries, validate, and normalize to exact origins. */
export function parseCsvOrigins(csv: string | undefined): readonly string[] {
  if (!csv?.trim()) return [];
  const set = new Set<string>();
  for (const part of csv.split(",")) {
    const t = part.trim();
    if (t) set.add(toOrigin(t));
  }
  return [...set];
}

export function isOriginAllowedForBrowserRequest(
  requestOrigin: string | undefined | null,
  allowedOriginsCsv: string | undefined,
): boolean {
  if (!requestOrigin) return false;
  let normalizedOrigin: string;
  try {
    normalizedOrigin = new URL(requestOrigin).origin;
  } catch {
    return false;
  }
  return parseCsvOrigins(allowedOriginsCsv).includes(normalizedOrigin);
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
  return isOriginAllowedForBrowserRequest(requestOrigin, allowedOriginsCsv)
    ? new URL(requestOrigin!).origin
    : null;
}
