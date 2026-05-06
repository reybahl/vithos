import { app } from "@repo/hono-app/app";
import { cors } from "hono/cors";
import { Hono } from "hono";

/**
 * Workers entry: same Hono app as Node, plus CORS so the browser can call this
 * worker from Cloudflare Pages (different origin than *.workers.dev).
 */
const worker = new Hono();

worker.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

worker.route("/", app);

export default worker;
