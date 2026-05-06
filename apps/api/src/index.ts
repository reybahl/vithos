import { serve } from "@hono/node-server";
import { app } from "@repo/hono-app/app";

const port = Number(process.env.PORT) || 3001;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Listening on port ${info.port}`);
  },
);
