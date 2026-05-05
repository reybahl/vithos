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
- `packages/*` — app and library code (empty until you add packages)
- `tooling/eslint` — workspace package `@repo/eslint` (ESLint 8) for roots and other consumers that use legacy `.eslintrc` style. The web app uses its own **ESLint 10** flat `eslint.config.js` from the Vite template.
- `tooling/typescript` — workspace package `@repo/typescript` with shared `base.json` / `vite.json` for libraries or new packages. The web app keeps the official Vite React `tsconfig` layout (`tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`).

`pnpm-workspace.yaml` includes `apps/*`, `packages/*`, and `tooling/*` (same “tooling is dev presets, packages is product code” split as in [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)).

## Commands

| Command      | Description             |
| ------------ | ----------------------- |
| `pnpm dev`   | Run all `dev` tasks     |
| `pnpm build` | Build all apps/packages |
| `pnpm lint`  | Lint (currently `web`)  |

## Package manager

This repo uses pnpm (see `packageManager` in the root `package.json`).
