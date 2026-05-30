import { env } from "./env";

import { createApp } from "@acme/hono-app/app";
import { serve } from "@hono/node-server";

process.env.BETTER_AUTH_URL ||= env.BETTER_AUTH_URL;

const app = createApp();

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Listening on port ${info.port}`);
  },
);
