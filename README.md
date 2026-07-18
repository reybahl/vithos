# Vithos

**A typesafe, modern, opinionated full-stack template, built for the edge, with deployment to Cloudflare Workers configured.**

## Stack

Raed more about the architectural choices behind the stack [here](https://blog.reybahl.com/posts/designing-the-vithos-stack/)!

| Layer        | Tech                                                                                                                | Role                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Frontend** | [Vite](https://vite.dev) 8, React 19, [TanStack Router](https://tanstack.com/router) & Query                        | SPA, file-based routes, typed data fetching                                |
| **API**      | [Hono](https://hono.dev)                                                                                            | Lightweight HTTP app running in the Cloudflare Worker                      |
| **Types**    | Hono RPC (`hc<AppType>`)                                                                                            | Client infers request/response shapes from the server — no OpenAPI codegen |
| **Auth**     | [Better Auth](https://www.better-auth.com)                                                                          | Email/password, cookie sessions, Kysely adapter                            |
| **DB**       | [Prisma](https://www.prisma.io) schema → [Kysely](https://kysely.dev)                                               | Migrations + generated SQL types; queries in app code                      |
| **UI**       | [shadcn/ui](https://ui.shadcn.com) (Tailwind 4)                                                                     | Shared `@acme/ui` package                                                  |
| **Deploy**   | Cloudflare Workers + Assets, [Hyperdrive](https://developers.cloudflare.com/hyperdrive/), [Neon](https://neon.tech) | One Worker runtime, pooled Postgres to Neon; PR preview branches optional  |
| **Monorepo** | pnpm, [Turborepo](https://turborepo.com)                                                                            | Shared packages, cached tasks                                              |

**Local dev and production:** `apps/worker` serves the React SPA and Hono API on one origin. The Cloudflare Vite plugin runs the Worker locally with Vite HMR.

## Project structure

```
apps/
  worker/       # Cloudflare Worker, React SPA, and Vite app
    src/client/  # React SPA
    src/index.ts # Hono + Worker entrypoint
packages/
  hono-app/     # API routes, middleware, Zod validators — imported by the Worker
  auth/         # Better Auth config
  db/           # Prisma schema, migrations, Kysely client
  ui/           # shadcn components + styles
tooling/        # Shared ESLint + TypeScript configs
```

Rename `@acme/*` package scopes when you fork. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Cloudflare, Neon, and CI.

## Get started

1. **[Use this template](https://github.com/new?template_name=vithos&template_owner=reybahl)** on GitHub, then clone your new repo.
2. `docker compose up -d`
3. Copy the Prisma and Worker environment examples, then set a local auth secret:

```sh
 cp .env.example .env                         # Prisma CLI only
 cp apps/worker/.env.example apps/worker/.env

 # paste into apps/worker/.env as BETTER_AUTH_SECRET=
 openssl rand -base64 32
```

`apps/worker/.env` configures the local Hyperdrive connection and Worker-only auth values. Root `.env` remains the Prisma CLI connection source.

4. `pnpm install`
5. `pnpm db:migrate`
6. `pnpm dev` → [http://localhost:5173](http://localhost:5173)

## Deploy

See **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Commands

| Command                        | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `pnpm dev`                     | React HMR + API in the local Workers runtime   |
| `pnpm build`                   | Build Worker, SPA, and packages                |
| `pnpm db:migrate`              | Prisma migrate dev                             |
| `pnpm lint` / `pnpm typecheck` | CI-style checks (run on pre-commit via husky). |
