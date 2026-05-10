import { env } from "./env";

import { serve } from "@hono/node-server";
import { app } from "@repo/hono-app/app";

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Listening on port ${info.port}`);
  },
);
