# Vithos

**A typesafe, modern, opinionated full-stack template, built for the edge, with deployment to Cloudflare Workers configured.**

## Stack

Raed more about the architectural choices behind the stack [here](https://blog.reybahl.com/posts/designing-the-vithos-stack/)!

| Layer        | Tech                                                                                                                | Role                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Frontend** | [Vite](https://vite.dev) 8, React 19, [TanStack Router](https://tanstack.com/router) & Query                        | SPA, file-based routes, typed data fetching                                    |
| **API**      | [Hono](https://hono.dev)                                                                                            | Lightweight HTTP app; same `createApp()` runs on Node (dev) and Workers (prod) |
| **Types**    | Hono RPC (`hc<AppType>`)                                                                                            | Client infers request/response shapes from the server — no OpenAPI codegen     |
| **Auth**     | [Better Auth](https://www.better-auth.com)                                                                          | Email/password, cookie sessions, Kysely adapter                                |
| **DB**       | [Prisma](https://www.prisma.io) schema → [Kysely](https://kysely.dev)                                               | Migrations + generated SQL types; queries in app code                          |
| **UI**       | [shadcn/ui](https://ui.shadcn.com) (Tailwind 4)                                                                     | Shared `@acme/ui` package                                                      |
| **Deploy**   | Cloudflare Workers + Assets, [Hyperdrive](https://developers.cloudflare.com/hyperdrive/), [Neon](https://neon.tech) | Edge runtime, pooled Postgres to Neon; PR preview branches optional            |
| **Monorepo** | pnpm, [Turborepo](https://turborepo.com)                                                                            | Shared packages, cached tasks                                                  |

**Local dev:** Vite proxies `/api` → `apps/api` (Node). **Production:** `apps/worker` serves the built SPA and API on one origin.

## Project structure

```
apps/
  web/          # Vite + React SPA
  api/          # Node dev server (Hono)
  worker/       # Cloudflare Worker (production + previews)
packages/
  hono-app/     # API routes, middleware, Zod validators — imported by api + worker
  auth/         # Better Auth config
  db/           # Prisma schema, migrations, Kysely client
  ui/           # shadcn components + styles
tooling/        # Shared ESLint + TypeScript configs
```

Rename `@acme/*` package scopes when you fork. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Cloudflare, Neon, and CI.

## Get started

1. **[Use this template](https://github.com/new?template_name=vithos&template_owner=reybahl)** on GitHub, then clone your new repo.
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

See **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Commands

| Command                        | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `pnpm dev`                     | Web + API (not Worker)                         |
| `pnpm build`                   | Build apps/packages                            |
| `pnpm db:migrate`              | Prisma migrate dev                             |
| `pnpm lint` / `pnpm typecheck` | CI-style checks (run on pre-commit via husky). |
