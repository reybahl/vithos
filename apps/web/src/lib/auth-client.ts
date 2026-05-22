import { createAuthClient } from "better-auth/react";

import { env } from "../../env/client";

/**
 * Dev: Vite proxies `/api/*` (same origin). Prod: `VITE_API_URL` → API subdomain.
 */
const baseURL = env.VITE_API_URL;

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
  fetchOptions: {
    credentials: "include",
  },
});
