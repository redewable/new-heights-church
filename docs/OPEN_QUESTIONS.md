# Open Questions — Phase 0

Questions for the Church that must be answered before certain phases can close. Each question is tagged with the phase it blocks. Update this doc as answers come in — delete resolved items, don't accumulate.

---

## P0 — Must be resolved before Phase 2 kickoff

1. **Planning Center OAuth app** — Client ID, client secret, and callback URL. We'll register ours at `{site}/api/auth/planning-center/callback`. Who on staff owns the PC org? _(Section 8.1)_
2. ~~**Giving processor confirmation**~~ — **RESOLVED 2026-04-21.** Online giving runs on **Pushpay** (`https://pushpay.com/g/newheightschurch`). Crypto is **Engiven** (`https://platform.engiven.com/give/1110/widget/1000`). Stock / securities via **Edward Jones** (DTC #0057, Tax ID 43-0345811) — delivery form lives at `/docs/nhc-securities-contribution.pdf`. Remaining open item: the Pushpay text-to-give keyword + shortcode (renumbered to Q9a below).
3. **Brand assets delivery** — We need:
   - Official logo in SVG (primary + mono variants)
   - Photography library (original — no stock) for hero, altars, leadership portraits
   - Sermon poster/thumbnail templates or the source Figma/Illustrator files
   - Typography confirmation: is Fraunces + Inter acceptable, or does the Church have an existing brand font?
4. **Staff email allow-list** for `/admin` access — who can publish sermons, edit events, view form submissions? At minimum we need one Lead Admin + one Media/Content role + one Pastoral Care (prayer) role.
5. **Resend "from" addresses** and routing:
   - Connect Card confirmation: `from:?` reply-to: `?`
   - Prayer Request → where does the prayer team intake go?
   - Decision follow-up: who signs? (Pastor Brian + Crystal, or an assimilation lead?)
   - Staff daily digest → which inbox?

## P1 — Needed before Phase 3 closes

6. **Mailchimp (or alternative)** — Audience ID + API key. If the Church is moving off Mailchimp (Flodesk, ConvertKit, ActiveCampaign), confirm before we build the subscribe endpoint.
7. **Cloudflare Turnstile site-key** — or alternative challenge if the Church prefers hCaptcha/reCAPTCHA. _(Section 8 + 9)_
8. **Upstash Redis** account/URL for rate limiting. Alternatively we use Vercel KV.
9. **Text-to-give short code** and instructions — keyword + number. Confirm compliance paperwork is current with the processor.

## P1 — Content

10. **Statement of faith** — current site lists 11 points. Do we migrate verbatim, or is an updated version being prepared? Need final text for `/about/beliefs`.
11. **Child Protection Statement** — draft text or sign-off on a template we propose?
12. **Privacy Policy / Terms of Use** — does the Church use existing ministry-law counsel for these, or do we draft from a base and have counsel review?
13. **Mission statement wording** — "We exist to love people and point them to Christ" is currently authoritative from RFP §2; is that locked for the home mission band?
14. **Pillar sub-landing copy** — `/grow/harvest`, `/grow/bride`, `/grow/habitation` each need a 250–400 word narrative from Pastor Brian or a designee. Who writes?

## P2 — Needed before Phase 4 closes

15. **Life Groups data** — how are groups structured in Planning Center? Confirm filter axes (day, time, location, demographic, leader) are all on the PC record.
16. **Rise Up and Build** — current goal amount (USD), pledged to date, given to date. Who updates `campaign_progress` — Exec Admin, or a finance lead?
17. **Featured-events policy** — who decides what gets pinned to the top of `/events`? Weekly editorial rhythm?

## P2 — Needed before Phase 5

18. **Brian Hallam Ministries scope** — the RFP calls this a "parallel brand" and "linked destination." Confirm: are we building any pages for it on this site, or is every BHM mention an outbound link to `brianhallam.com`?
19. **Podcasts** — _Resolved 2026-09-08 for The Brian Hallam Podcast:_ Apple id 1604967894, Spotify show 7cYqeHSZDg5Dg0orFyHc5a, Buzzsprout RSS 1919457 (all in `lib/constants/bhm.ts`). One `/podcasts` hub; each show's latest episode is its channel's newest YouTube upload. New Heights Sermons is not listed on the hub — the Sunday word lives on /sermons and /watch.
20. **Resource Room** — confirm Phase 5 scope is outbound-link listings only (no on-site checkout). If e-commerce is wanted, that's a Phase 6+ add-on with Stripe + inventory + tax.

## P3 — Needed before launch (Phase 7)

21. **DNS / domain ownership** — confirm Church holds registrar access to `newheightschurch.info` plus any variants (`newheights.church`, etc.). Cutover window preference?
22. **SSL/TLS** — Vercel issues automatically via Let's Encrypt; confirm any enterprise cert requirements.
23. **Sentry org/project** — who owns Sentry billing? PII scrub rules (auto-scrub emails, phones, payment tokens).
24. **Analytics accounts** — GA4 property ID, Search Console verification (DNS TXT record — coordinate with Cloudflare admin), Meta Pixel ID.
25. **Staff training schedule** — two live sessions (editors + admins). Preferred format (Zoom + recorded, or on-site)? Attendees?
26. **Maintenance SLA** — confirm post-launch 90-day hypercare plan and ongoing maintenance terms.

## Decisions already made (for the record)

- **Accent palette** is tabernacle-derived (blue/purple/scarlet/gold/silver/bronze) per user directive 2026-04-20, overriding RFP §4 default pillar colors. Documented in `docs/BRAND.md`.
- **Ministry names**: "Kids" → **Young Lions**, "Youth" → **Youth Army** (user directive 2026-04-20). Applies to all user-facing copy; URLs remain `/kids` and `/youth` for legacy compatibility.
- **Next.js major** — scaffolded on **Next 16.2.4** instead of the RFP's "Next 15". 16 is latest stable at kickoff; the RFP text specifies "latest stable minor" for packages. See `docs/RECONCILIATION.md` for per-breaking-change notes.
