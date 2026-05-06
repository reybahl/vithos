import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(packageDir, "..", "..");

dotenv.config({ path: path.join(monorepoRoot, ".env") });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  ...(process.env.DATABASE_URL
    ? {
        datasource: {
          url: env("DATABASE_URL"),
        },
      }
    : {}),
});
