@AGENTS.md

# New Heights Church — agent-facing notes

This repo is the NHC website under RFP NHC-26-001. Before making changes, the authoritative references are:

- **Build spec:** `/Users/talormayde/Downloads/CLAUDE_CODE_BUILD_PROMPT.md` (19 sections) — re-read the relevant section before starting a phase.
- **Brand system:** `docs/BRAND.md` — tabernacle-derived palette, three-pillar motifs, voice.
- **Next.js 16 deltas vs. spec's "Next 15":** `docs/RECONCILIATION.md` — remember async `cookies()/headers()/params`, `middleware → proxy.ts`, `revalidateTag` needs cacheLife arg, `next lint` removed.

## Locked decisions you must preserve

- **Three pillars order is fixed:** Endtime Harvest → Preparation → Habitation. Never reorder. Unit test enforces it. Labels come from `CHURCH.pillars[].label` and the strip from `PILLAR_STRIP`; keys/slugs stay `harvest` / `bride` / `habitation`.
- **The logo is three bars ascending** — one per pillar. Never four. `AscendingBars` is inline SVG; `tone="pillars"` paints scarlet/purple/blue. Unit test enforces the count.
- **Scripture color palette** (not the RFP's default colors): scarlet = Endtime Harvest, purple = Preparation, blue = Habitation; white/cream is the canvas; gold = decision; silver = redemption; bronze is supporting only. `app/globals.css` is the single source of truth for tokens.
- **CSS layering:** element defaults in `globals.css` live in `@layer base`, house utilities in `@layer components`. Never add an unlayered `h1 {}` / `a {}` rule — it silently overrides every Tailwind utility (this once hid every hero title on ink).
- **Labels use `.u-eyebrow`.** Never hand-roll `text-[11px] font-semibold uppercase`.
- **Honor the office.** "Apostle Brian Hallam" and "Pastor Crystal Hallam" — full titles, always (`CHURCH.leadership`). No casual "meet the pastors after service" copy; care flows through the First Touch Team and Connect Card. Scripture is "the Word of God", never "the Book". Tone is a move of God: fire, oil, cost, excellence. No fabricated testimonies.
- **Photography** is the Church's own, registered in `lib/constants/media.ts` (hosted on brianhallam.com / newheightschurch.info until Phase 6). No stock. Inner pages use `PageHero`; ink sections use `.u-grain-ink` (no radial color washes).
- **Ministry names:** "Youth" is "Youth Army", "Kids" is "Young Lions" — in all user-facing copy. URLs stay `/youth` and `/kids`.
- **Canonical facts** live only in `lib/constants/church.ts` (church), `lib/constants/bhm.ts` (Brian Hallam Ministries + the book), `lib/constants/announcements.ts` (top strip) — don't hard-code addresses, phone, service times, or URLs elsewhere.
- **2026 conference is "Activated" (New Heights Conference 2026)** (Sept 24–27; Pastor Paula White, Prophet Dr. Lashund Lambert, Prophet Richard Summerlin). Slug `activated-2026`; migration 0008 renames it and redirects the old slugs.
- **Events carry `registration_status` and `speakers`.** Cards and the detail page read `lib/events/status.ts` for CTA state — never null the URL to "close" an event.
- **The data layer never throws into a page.** Every Supabase read goes through `lib/supabase/guard.ts` (`guarded`): on a thrown error, a returned error, or a row missing required fields it logs a warning and serves fixtures. A CMS outage or stale keys must never 500 the public site.

## Daily commands

- `pnpm dev` — dev server at :3000
- `pnpm verify` — lint + format-check + typecheck + unit tests (no build)
- `pnpm build` — production build (also catches type / RSC errors not seen in dev)
- `pnpm test:e2e` — Playwright smoke suite (runs its own dev server)

## Before you commit

1. `pnpm verify` must be green.
2. If you changed tokens, re-check `docs/BRAND.md` still matches.
3. If you added a page, add it to `app/sitemap.ts`.
4. If you added a form, it must write to Supabase FIRST, then attempt downstream sync (PC, Resend). Never the other way.
