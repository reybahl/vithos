# Vithos

Full-stack monorepo: Vite + React, Hono API, Postgres, Better Auth, Cloudflare Worker deploy.

## Get started

1. [**Use this template**](https://github.com/new?template_name=vithos&template_owner=reybahl) on GitHub, then clone your new repo.
2. `docker compose up -d`
3. Copy env examples and set a local auth secret:

   ```sh
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env   # optional

   # paste into apps/api/.env as BETTER_AUTH_SECRET=
   openssl rand -base64 32
   ```

4. `pnpm install`
5. `pnpm db:migrate`
6. `pnpm dev` → [http://localhost:5173](http://localhost:5173)

## Deploy

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** (Cloudflare Worker, Hyperdrive, Neon, GitHub Actions).
