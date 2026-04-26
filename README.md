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

- `apps/web` — Vite + React (TypeScript) SPA
- `packages/eslint-config` — shared **legacy** ESLint config (ESLint 8) for other workspace packages. The web app uses its own **ESLint 10** flat `eslint.config.js` from the Vite template so it stays aligned with the official React stack.
- `packages/typescript-config` — shared `tsconfig` presets for libraries or future packages. The web app keeps the official Vite React `tsconfig` layout (`tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`).

## Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Run all `dev` tasks      |
| `pnpm build`   | Build all apps/packages  |
| `pnpm lint`    | Lint (currently `web`)   |

## Package manager

This repo uses pnpm (see `packageManager` in the root `package.json`).
