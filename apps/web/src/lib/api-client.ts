import type { AppType } from "@repo/hono-app/app";
import { hc } from "hono/client";

function apiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv != null && fromEnv !== "") {
    return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }
  if (typeof window === "undefined") {
    return "http://localhost:5173/";
  }
  return `${window.location.origin}/`;
}

export const apiClient = hc<AppType>(apiBaseUrl(), {
  init: {
    credentials: "include", // Required for sending cookies cross-origin
  },
});
