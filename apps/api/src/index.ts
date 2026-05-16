import { env } from "./env";

import { createApp } from "@repo/hono-app/app";
import { serve } from "@hono/node-server";

const app = createApp({
  getCorsAllowedOriginsCsv: () => env.CORS_ALLOWED_ORIGINS,
});

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Listening on port ${info.port}`);
  },
);
