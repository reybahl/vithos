# vithos-stack

pnpm + [Turborepo](https://turborepo.com) monorepo. The web UI is a standard [Vite](https://vite.dev) + **React** + **TypeScript** app.

## Scaffolding the frontend (canonical)

The `apps/web` app was created with the official Vite CLI from the monorepo root (not the old Turborepo `with-vite` example, which was vanilla TypeScript):

```sh
pnpm create vite@latest apps/web --template react-ts
cd ../..   # back to monorepo root
pnpm install
```

Then run `pnpm run build` and `pnpm run lint` from the root to confirm the workspace is wired up.

`apps/web` includes what `create-vite` generates today (for example [Vite 8](https://vite.dev), React 19, ESLint flat config, and a `tsc` project reference setup in `tsconfig.*.json`).

## Structure

- `apps/web` — Vite + React SPA
- `apps/api` — local Node dev server for the Hono API
- `apps/worker` — Cloudflare Worker deployment
- `packages/*` — shared libraries (`auth`, `db`, `hono-app`, `ui`)
- `tooling/typescript` — shared TSConfig presets (`base.json`, `react-library.json`, `vite.json`)
- `tooling/eslint-config` — shared ESLint 10 flat config (`@repo/eslint-config`)

Each app/package extends the shared TS presets and imports lint helpers from `@repo/eslint-config`. The web app keeps the official Vite React project-reference layout (`tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`).

`pnpm-workspace.yaml` includes `apps/*`, `packages/*`, and `tooling/*`.

## Commands

| Command           | Description                 |
| ----------------- | --------------------------- |
| `pnpm dev`        | Run all `dev` tasks         |
| `pnpm build`      | Build all apps/packages     |
| `pnpm lint`       | Lint all apps/packages      |
| `pnpm typecheck`  | Typecheck all apps/packages |
| `pnpm format:fix` | Format with Prettier        |

## Package manager

This repo uses pnpm (see `packageManager` in the root `package.json`).
