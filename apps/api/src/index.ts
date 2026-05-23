import { browserAllowedOrigins, env } from "./env";

import { createApp } from "@acme/hono-app/app";
import { serve } from "@hono/node-server";

const app = createApp({
  getCorsAllowedOriginsCsv: () => browserAllowedOrigins,
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
