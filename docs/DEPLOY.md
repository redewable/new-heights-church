# Deploy — New Heights Church website

The site runs on Vercel (Pro tier per RFP §2). DNS lives at Cloudflare. Supabase is the data layer. No server state is held on the application host — everything durable lives in Supabase or a third-party system of record.

---

## Environments

| Env        | Branch        | URL                             | Purpose                                                          |
| ---------- | ------------- | ------------------------------- | ---------------------------------------------------------------- |
| Production | `main`        | `https://newheightschurch.info` | Live site. Only staff with release approval can merge to `main`. |
| Preview    | any PR branch | Vercel-generated                | Every PR gets a preview URL. Lighthouse CI runs against it.      |
| Local      | —             | `http://localhost:3000`         | `pnpm dev`.                                                      |

All non-production envs MUST be `noindex` (set `X-Robots-Tag: noindex` via Vercel env or by checking `NEXT_PUBLIC_VERCEL_ENV !== "production"` in a layout).

---

## Prerequisites

- **Node 22 LTS.** `.nvmrc` pins `22`. Use `nvm use`.
- **pnpm 10+.** Install via `corepack enable && corepack prepare pnpm@latest --activate`.
- **Supabase CLI** (Phase 2+): `brew install supabase/tap/supabase`.
- **Vercel CLI** (optional, for env sync): `pnpm add -g vercel`.

---

## Local setup

```bash
nvm use
pnpm install
cp .env.example .env.local   # fill in values per OPEN_QUESTIONS.md
pnpm dev
```

Visit `http://localhost:3000`. Admin routes at `/admin` require Supabase Auth (Phase 2).

---

## Environment variables

See `.env.example` for the full list. Each is tagged with the phase it first becomes required.

- Keys prefixed `NEXT_PUBLIC_` are **exposed in the client bundle**. Only non-secret values go there (site URL, analytics IDs, Supabase anon key, Turnstile site key).
- Secret keys (Supabase service role, Planning Center client secret, Resend API key, Mailchimp API key) go in Vercel env as encrypted, **never** committed.
- Local `.env.local` is gitignored. Don't paste secrets into Slack or any shared doc.

---

## CI / PR checks

GitHub Actions (`.github/workflows/ci.yml`) runs on every PR:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm format:check`
4. `pnpm typecheck`
5. `pnpm test` (Vitest unit suite)
6. `pnpm build` (Next.js build, verifies no runtime-only errors)

Shortcut: `pnpm verify` runs lint + format-check + typecheck + tests locally.

Lighthouse CI against preview URLs (Phase 1+): Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100 on Home / Sermons / Give / Events / Connect. The check fails the PR if any route drops below threshold.

---

## Release process (Phase 7+)

1. Create a release branch from `main` — e.g. `release/2026-11-14`.
2. Bump version in `package.json` + update `CHANGELOG.md`.
3. Open a PR, confirm all checks + smoke-test the preview (home, sermons, a form, giving deep-link).
4. Merge to `main`. Vercel auto-deploys.
5. Tag the release: `git tag v0.x.y && git push --tags`.
6. Post-deploy: run Lighthouse against production, re-verify Sentry isn't throwing, confirm Core Web Vitals in Vercel Analytics.

---

## Rollback

Vercel keeps every deployment. To roll back:

1. Vercel dashboard → Deployments → locate the last known-good deploy.
2. "Promote to Production."
3. Note the reason in `docs/RUNBOOK.md#incidents`.
4. Open a fix-forward PR; do not hot-patch the production branch.

Rolling back does NOT roll back Supabase migrations. Schema changes are forward-only — if a migration was the cause, write a new migration that reverses it, don't delete the record.

---

## DNS / domain

- Registrar / DNS: Cloudflare (Church retains ownership).
- `newheightschurch.info` apex + `www` CNAME both point to Vercel per Vercel's verification steps.
- TTL dropped to 300s 24h before any DNS change. Restore to 3600s+ after confirmed.

---

## Backups

- **Supabase** — Point-in-time recovery enabled on Pro tier. 7-day retention default. Daily logical dumps run via Supabase's built-in backup schedule.
- **Storage** — Supabase Storage buckets (`media`, `sermons`, `graphics`) are replicated by Supabase. For large sermon originals, authoritative source remains YouTube (`@NewHeightsBCS`).
- **Code** — GitHub is canonical. Mirror to the Church's Google Drive or Dropbox post-launch for disaster continuity.

See `docs/RUNBOOK.md` for restore procedures.
