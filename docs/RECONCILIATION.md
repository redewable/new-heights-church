# Reconciliation — RFP vs. scaffolded build

> Audit of the deltas between RFP NHC-26-001 §2 ("locked stack") and what was
> actually scaffolded at project kickoff. Living doc — update as versions shift
> and phases advance.

Last updated: 2026-04-20. Maintainer: web lead.

---

## 1. Next.js 15 → 16 delta

The RFP locks **Next.js 15**. At kickoff, Next.js **16.2.4** was the current
stable release (React 19.2 GA, Turbopack default, proxy middleware), so we
scaffolded on 16. This is a deliberate deviation — the performance and DX wins
are meaningful and the migration cost only grows later. The rest of this section
enumerates every Next 16 breaking change we need to keep in mind as we build
out later phases. Source:
`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.

### Breaking changes we need to hold in our heads

- **Async request APIs (hard break).** `cookies()`, `headers()`, `draftMode()`,
  and route `params` / `searchParams` are now Promises. Every server component
  or route handler that reads them must `await`. Codemods exist but writing
  them correctly from the start is cheaper than fixing later.
- **Middleware is dead — long live proxy.** `middleware.ts` is renamed to
  `proxy.ts`, runtime is **Node only** (no Edge runtime for middleware). If
  we need geo-aware or ultra-low-latency checks, we plan them at the CDN /
  Cloudflare Worker layer instead.
- **Turbopack is the default bundler.** `next dev` and `next build` both use
  Turbopack. We're pinned to it; if we hit an edge case, we add `--webpack`
  locally, not globally.
- **PPR removed, replaced by `cacheComponents`.** The Phase-2 sermons page
  strategy should plan for `cacheComponents` (fine-grained cache directives
  per component) rather than partial prerendering as originally scoped.
- **`next lint` is gone.** Use ESLint directly (`pnpm lint` in `package.json`
  already calls `eslint .`). CI config should not assume `next lint` exists.
- **React 19.2 via App Router canary.** We're on `react@19.2.4`. Server
  Actions, `useActionState`, and the new `<form>` behaviors are available
  and should be preferred over custom mutation hooks.
- **Parallel routes require `default.js`.** Any parallel route slot we add
  must ship a `default.js` — missing ones now throw instead of silently
  rendering.
- **`images.domains` is deprecated.** Use `images.remotePatterns` (we already
  do). Do not add `domains` entries to `next.config.ts`.
- **`images.qualities` default is `[75]`.** Asking for a non-listed quality
  now warns. If we need multiple qualities for the sermons hero, add them
  to `next.config.ts` explicitly.
- **`revalidateTag` now requires a `cacheLife` argument.** Any tag-based
  revalidation we ship in Phase 3+ must pass a cache life.
- **`generateSitemaps` id is now a `Promise`.** Our Phase-2 sitemap generator
  must `await` the id before using it.
- **Async params for metadata files.** `opengraph-image.tsx`, `icon.tsx`, and
  `apple-icon.tsx` now receive async `params`. Keep in mind when we add
  per-sermon OG images.

---

## 2. Stack verification (RFP §2 locked items)

Legend: **(a) installed** with pin, **(b) scaffolded, env pending**,
**(c) deferred** to a later phase.

| Item                  | Status | Notes                                                                                                                                                                                                           |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js               | (a)    | `next@16.2.4` — intentional 15→16 uplift (see §1). ESLint config pinned to `16.2.4`.                                                                                                                            |
| React                 | (a)    | `react@19.2.4`, `react-dom@19.2.4`.                                                                                                                                                                             |
| Tailwind CSS          | (a)    | `tailwindcss@^4`, `@tailwindcss/postcss@^4`. Tokens in `app/globals.css` via `@theme`.                                                                                                                          |
| TypeScript            | (a)    | `typescript@^5`. `tsc --noEmit` wired into CI.                                                                                                                                                                  |
| Supabase              | (b)    | `@supabase/ssr@^0.5.2`, `@supabase/supabase-js@^2.46.1` installed. **Env vars pending**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Schema lives in `supabase/`. |
| Planning Center       | (c)    | **Phase 4.** No SDK installed yet. OAuth app needs to be registered by Church admin before we can scaffold the client.                                                                                          |
| YouTube (Data API v3) | (c)    | **Phase 2** (sermons). API key + channel IDs for `@NewHeightsBCS` and `@brianhallamministries5053` pending.                                                                                                     |
| Resend                | (c)    | **Phase 3** (transactional email). Domain verification on `newheightschurch.info` pending.                                                                                                                      |
| Mailchimp             | (c)    | **Phase 3** (newsletter). Audience ID + API key pending; may revisit vs. Resend Broadcasts.                                                                                                                     |
| Twilio                | (c)    | **Phase 5, optional.** SMS outbound for Youth Army / Young Lions parent comms. Not started.                                                                                                                     |
| Cloudflare Turnstile  | (c)    | **Phase 3** (forms). Site key + secret pending.                                                                                                                                                                 |
| Upstash Redis         | (c)    | **Phase 3** (rate limiting, idempotency). No keys yet.                                                                                                                                                          |
| Sentry                | (c)    | **Phase 3.** **Flag:** RFP §13 requires PII scrubbing before any event ships — configure `beforeSend` and `beforeBreadcrumb` with our PII scrubber as a prereq for enabling.                                    |
| GA4 + Meta Pixel      | (c)    | **Phase 3, consent-gated.** Cannot load before the cookie banner ships. Measurement IDs pending.                                                                                                                |
| Vercel hosting        | (c)    | **Deployment pending.** Project not yet connected to Vercel. Preview deploys TBD.                                                                                                                               |
| Cloudflare DNS        | —      | **Owned by Church.** We will request the records; Church admin applies them at registrar.                                                                                                                       |

---

## 3. Open architecture questions

Things the RFP implies but didn't fully spec. Noting so we don't default our
way into the wrong answer:

- **MDX pipeline.** Deferred to **Phase 5** (staff-authored articles, long-form
  sermon notes). We'll choose between `next-mdx-remote` (runtime-evaluated,
  pairs with Supabase-stored drafts) and `@next/mdx` (build-time, file-based)
  when the editorial workflow is clearer. Leaning `next-mdx-remote` because
  non-technical staff will author via a CMS surface, not a git PR.
- **Search.** Postgres `tsvector` in the Supabase schema, already scaffolded.
  **No Algolia.** We will revisit only if Postgres FTS falls over on sermons
  - events + pages at expected scale (it won't).
- **Cookie banner.** Implementation TBD. Candidates: (1) a minimal in-house
  banner tied to our own consent key (simplest, ships in Phase 3), (2) a
  vendor (Klaro, Osano) for pre-built GDPR/CCPA flows. Decision needed before
  GA4 / Meta Pixel can load.

---

## 4. Intentional deviations from RFP

Two places we are knowingly diverging from the written RFP, with rationale:

1. **Tabernacle palette overrides RFP §4 default pillar colors.**
   - RFP §4 specified generic pillar accents.
   - Pastor/owner directive: accents follow the **tabernacle of Moses** —
     blue (veil / habitation), purple (royalty / Bride), scarlet (blood /
     Harvest), plus gold (altar / decision), silver (redemption), bronze
     (sacrifice / judgment). Memory / brand files reference this as the
     governing decision.
   - Implemented in `app/globals.css` as `--nh-blue`, `--nh-purple`,
     `--nh-scarlet`, `--nh-gold`, `--nh-silver`, `--nh-bronze` (each with
     `-ink` and `-soft` variants). Pillar aliases: `--nh-harvest` →
     scarlet, `--nh-bride` → purple, `--nh-habitation` → blue.
   - Documented in `docs/BRAND.md` §3.

2. **"Kids" → "Young Lions"; "Youth" → "Youth Army."**
   - RFP used the generic labels "Kids ministry" and "Youth ministry."
   - Pastor/owner directive: use **Young Lions** (kids) and **Youth Army**
     (youth) in every user-facing surface — nav, cards, event listings,
     forms, emails. Internal DB keys / code identifiers may remain
     `kids` / `youth` for brevity, but no rendered UI string should use
     the generic words.

Both deviations are user-directed and sit above the RFP in our precedence order.
If a future change request conflicts with either, escalate before touching.
