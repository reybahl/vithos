import type { AppType } from "@acme/hono-app/app";
import { hc } from "hono/client";

function apiBaseUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:5173/";
  }
  return `${window.location.origin}/`;
}

export const apiClient = hc<AppType>(apiBaseUrl(), {
  init: {
    credentials: "include",
  },
});
