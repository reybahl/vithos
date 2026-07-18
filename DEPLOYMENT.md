# Deployment

Production: Cloudflare Worker (API + static SPA). Postgres via Hyperdrive. CI on push to `main`. PR previews optional (Neon branches).

## 1. Database (Neon)

1. Create a [Neon](https://neon.tech) project.
2. Copy the **direct** connection string (not `*-pooler.*`) — Hyperdrive already pools.
3. Add GitHub Actions secret **`DATABASE_URL`** (repo → Settings → Secrets and variables → Actions) — Neon **direct** URL; CD uses it for `pnpm db:migrate:deploy` on push to `main`.
4. Or migrate locally once: `DATABASE_URL="postgres://..." pnpm db:migrate:deploy`

**Not using Neon?** Use any Postgres host for `DATABASE_URL` / Hyperdrive. Delete `.github/workflows/preview.yml` and `preview-cleanup.yml` (they create/delete Neon branches per PR).

## 2. Cloudflare Worker

1. [Cloudflare dashboard](https://dash.cloudflare.com) → Workers & Pages → create a Worker (or use Wrangler).
2. Install Wrangler locally: `pnpm install` (from repo root).
3. Log in: `cd apps/worker && pnpm wrangler login`
4. Update `apps/worker/wrangler.toml` if needed:
   - `name` — your Worker name
   - `[[hyperdrive]]` `id` — your Hyperdrive config id (step 3)
5. Auth secret (new value; not your local dev secret):
   ```sh
   cd apps/worker && pnpm wrangler secret put BETTER_AUTH_SECRET
   ```
6. Optional first deploy: `pnpm --filter worker deploy` (CI will deploy later too).

## 3. Hyperdrive

1. Dashboard → **Storage & databases** → **Hyperdrive** → Create.
2. Origin: Neon **direct** connection string (same as §1).
3. Copy the Hyperdrive **id** into `wrangler.toml` (`[[hyperdrive]]` → `id = "..."`).
4. Or CLI:
   ```sh
   wrangler hyperdrive create vithos-db --connection-string="postgres://..."
   wrangler hyperdrive update <id> --connection-string="postgres://..."
   ```

Worker runtime uses `env.HYPERDRIVE` in production. Previews use `DATABASE_URL` per Neon branch instead (see §5).

## 4. Cloudflare / Worker settings

| What                          | Where                                                                                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hyperdrive binding            | `wrangler.toml` → `[[hyperdrive]]`                                                                                                                                    |
| `BETTER_AUTH_SECRET`          | Worker secret (`wrangler secret put`)                                                                                                                                 |
| `BETTER_AUTH_URL`             | Set on deploy by CI (`--var BETTER_AUTH_URL:…`) from `WEB_ORIGIN` — must match your public app URL (scheme + host, trailing `/` added in workflow)                    |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Set on deploy by CI from the GitHub variable of the same name. Optional comma-separated origins/patterns for additional public hosts, such as immutable preview URLs. |
| Custom domain                 | Workers → your Worker → **Settings** → Domains & routes                                                                                                               |

## 5. GitHub Actions

**Enable workflows** (recommended): in each of `cd.yml`, `preview.yml`, and `preview-cleanup.yml`, delete the `cd-disabled` job and remove every `if: vars.CD_ENABLED` line.  
Alternatively set repository variable `CD_ENABLED` = `true` (keeping the guards).

**Secrets** (Settings → Secrets and variables → Actions — repository secrets):

| Secret                  | Used for                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Production DB migrations (Neon direct URL)                                                     |
| `CLOUDFLARE_API_TOKEN`  | Deploy Worker ([API token](https://dash.cloudflare.com/profile/api-tokens): Workers + Account) |
| `CLOUDFLARE_ACCOUNT_ID` | Deploy Worker                                                                                  |
| `NEON_API_KEY`          | PR preview branches (Neon API key; skip if you deleted preview workflows)                      |

**Variables** (repository variables; same settings page):

| Variable                      | Value                                                                     |
| ----------------------------- | ------------------------------------------------------------------------- |
| `WEB_ORIGIN`                  | Public app URL, e.g. `https://your-app.example.com`                       |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Optional comma-separated Better Auth origin patterns for additional hosts |
| `NEON_PROJECT_ID`             | Neon project id (previews only)                                           |
| `NEON_DATABASE_USER`          | Neon role, e.g. `neondb_owner` (previews only)                            |
| `NEON_DATABASE_NAME`          | Optional; defaults to `neondb` in workflow                                |

Create GitHub environments **`production`** and **`preview`** if you use PR previews (workflows reference them).

Push to `main` → migrate (`pnpm db:migrate:deploy`) → build Worker + SPA → `wrangler deploy`.

## Checklist

- [ ] Neon (or Postgres) direct URL in Hyperdrive + GitHub `DATABASE_URL`
- [ ] `wrangler.toml` Worker name + Hyperdrive id
- [ ] `BETTER_AUTH_SECRET` on Worker
- [ ] `WEB_ORIGIN`, optional `BETTER_AUTH_TRUSTED_ORIGINS`, + Cloudflare token/account secrets on GitHub
- [ ] Workflows enabled (remove `cd-disabled` / `if: vars.CD_ENABLED` or set `CD_ENABLED`)
- [ ] Preview vars/secrets — or delete preview workflows
