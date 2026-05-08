import { createAuthClient } from "better-auth/react";

/**
 * Talks to Better Auth on the same origin (`/api/auth/*` is proxied to the API in dev).
 * `credentials: "include"` keeps the session cookie on cross-subdomain / proxied setups.
 */
export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
});
