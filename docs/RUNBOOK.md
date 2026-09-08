# Runbook — New Heights Church website

Operational playbook for the NHC website. This doc is for on-call / staff responders, not a user manual. For staff content editing, see `docs/CMS_GUIDE.md`.

---

## Who to call

| Role                                        | Owner                         | Backup                    |
| ------------------------------------------- | ----------------------------- | ------------------------- |
| Tech lead / deploy authority                | _TBD — see OPEN_QUESTIONS #5_ | —                         |
| Pastoral follow-up (decisions, prayer)      | Pastor Brian / Crystal Hallam | Prayer team lead          |
| Finance (giving / Rise Up pledge questions) | Exec Admin                    | —                         |
| DNS / Cloudflare                            | Exec Admin                    | Vendor (contract contact) |
| Supabase                                    | Vendor                        | Exec Admin                |

Update this table with real people before launch.

---

## Monitoring (Phase 3+)

- **Sentry** — catches runtime JS/server errors. Alert: Slack channel (TBD), email to tech lead.
- **Vercel Analytics** — Core Web Vitals per route. Alert if LCP > 2.5s or INP > 300ms for any critical route over 24h.
- **Vercel deployment status** — auto-email on failed deploy.
- **Uptime** — Vercel SLA + an external probe (UptimeRobot / Better Uptime) hitting `/` every 5 min. Two consecutive fails → email + SMS to tech lead.
- **Form-submission volume** — admin digest at 7am CT daily; a drop to zero for 48h when there should be traffic is itself an alert.

---

## Common incidents

### 1. Site is down

- Check Vercel status page (`vercel-status.com`) and the current deployment in the Vercel dashboard.
- If a bad deploy: roll back via Vercel → Deployments → Promote last known good. (See `DEPLOY.md#rollback`.)
- If Vercel is up but our site is 5xx: check Sentry for a spike; check Supabase dashboard for DB / connection issues.
- If Supabase is down: the marketing site continues to serve (most pages are static). Forms and admin will return user-friendly error states (Phase 3 build includes these).
- Post-mortem within 5 business days for any >15 min outage.

### 2. Form submission not arriving

- Check Supabase `connect_cards` / `prayer_requests` / `decisions` tables — the row should exist regardless of downstream sync status.
- Check `submission_jobs` (Phase 3) for failed Planning Center syncs. Retry via admin.
- Check Resend dashboard for bounced transactional emails.
- Check Upstash rate-limit counters; a real user hitting 10/10min is rare but possible during a revival/altar moment — raise temporarily if needed.

### 3. Livestream embed shows wrong state

- `/api/livestream-status` polls YouTube every 60s and caches.
- If "live" is stuck after service ends, manually `POST /api/livestream-status/refresh` (admin-only, Phase 2) or wait one cache cycle.
- YouTube Data API quota: 10,000 units/day. Each `search.list` = 100 units. 24h × 60 polls/hr × 100 = 144,000 — we rely on caching + scheduled polling only during service windows. If we ever hit the quota, see `lib/youtube/client.ts` for the fallback static-page behavior.

### 4. Decision / salvation form failing

- **This is sacred.** Page the tech lead AND a pastor immediately. A broken decision-capture means someone tried to respond and didn't get through.
- Meanwhile, the decision page also includes a visible fallback phone/email — confirm it's present. If it isn't, deploy a hotfix page.
- After repair, review Sentry for any failed submissions in the last 72h and contact the person manually if you can identify them from partial logs.

### 5. Suspected spam / abuse wave

- Confirm Turnstile is live on all public forms.
- Check Upstash rate-limit logs for top offending IPs.
- If sustained, raise Turnstile aggressiveness via its dashboard.
- Do NOT disable forms entirely without tech lead approval — the cost of missing a real submission outweighs spam noise.

### 6. PII leak / data exposure

- Page tech lead + Exec Admin immediately.
- Identify affected records, rotate relevant keys (Supabase service role, Resend, PC client secret).
- Document scope + notify affected individuals per applicable privacy law.
- Write post-mortem, update this runbook.

---

## Key rotation schedule

| Secret                        | Rotation                                | Owner           |
| ----------------------------- | --------------------------------------- | --------------- |
| Supabase service role         | Every 90 days                           | Tech lead       |
| Planning Center client secret | On PC security events; minimum annually | Tech lead       |
| Resend API key                | Annually                                | Tech lead       |
| Mailchimp API key             | Annually                                | Marketing admin |
| Session/JWT secrets           | Every 180 days + on compromise          | Tech lead       |

After rotation, update Vercel env + re-deploy. Keep a minimum 1h overlap window for PC/OAuth tokens to avoid sync gaps.

---

## Database

- **Migrations** — forward-only. New file in `supabase/migrations/` per schema change. Never edit a merged migration.
- **RLS** — every table has RLS enabled. Any new table requires an RLS policy in the same migration file.
- **Backups** — Supabase PITR is on. To restore: Supabase dashboard → Project Settings → Database → PITR, select timestamp.
- **Seeding** — `supabase/seed.sql` runs only against local dev DB. Never run against prod.

---

## Post-launch 404 monitoring (first 30 days)

Vercel Analytics surfaces 404s. Every weekday at 9am CT, review the 404 list. If a pattern emerges that maps to a legacy URL, add a redirect to the `redirects` Supabase table (managed via admin → Redirects). Re-confirm the middleware `proxy.ts` loads the table cache every ~60s.

---

## Security checklist (monthly)

- [ ] `pnpm audit` shows zero high/critical vulnerabilities. Resolve or justify in `docs/RUNBOOK.md#exceptions` any that can't be upgraded immediately.
- [ ] CSP header (Phase 3+) still matches the third-party allowlist; any additions documented.
- [ ] Admin allow-list in `ADMIN_EMAILS` env matches the current staff roster — remove separated staff.
- [ ] Supabase RLS policies reviewed — any new table added in the last month has a deny-by-default policy.
- [ ] Sentry PII scrub rules still filter emails, phone numbers, and any payment-adjacent fields.

---

## Exceptions / known-acceptable risks

_(Keep this section short. Every entry needs an owner and a re-evaluate date.)_

- _None yet._
