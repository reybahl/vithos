import { createAuthClient } from "better-auth/react";

import { env } from "../../env/client";

/**
 * Dev: Vite proxies `/api/*`; omitting `baseURL` uses same-origin `/api/auth`.
 * Prod: set `VITE_API_URL` to the Worker origin; Better Auth appends `/api/auth` (and trims trailing `/`).
 */
const baseURL = env.VITE_API_URL;

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
  fetchOptions: {
    credentials: "include",
  },
});
