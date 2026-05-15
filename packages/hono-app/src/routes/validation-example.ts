import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";

/**
 * Demo-only: `zValidator("json", schema)` runs before the handler; invalid bodies get a 400 from the middleware.
 * POST /api/validation-example/echo
 */
const echoBody = z.object({
  message: z.string().min(1).max(280),
});

export const validationExampleRouter = new Hono().post(
  "/echo",
  zValidator("json", echoBody),
  (c) => {
    const { message } = c.req.valid("json");
    return c.json({ echoed: message });
  },
);
