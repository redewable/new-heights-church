# Staff Guide — Editing the New Heights Church website

> This doc is for ministry staff. It will be expanded with screenshots + a walkthrough video before Phase 7 (launch). The skeleton below tracks the features we're building so staff can follow along.

---

## Signing in

Go to `/admin` and enter your work email. We'll send a one-time magic link. Your email must be on the approved staff list — if you're not in yet, ask the Exec Admin to add you.

There are no passwords to remember. The magic link lasts 10 minutes and works once.

---

## What you can do (by phase as features ship)

### After Phase 2 — Sermons & Media

- **Import a sermon from YouTube.** Paste the YouTube URL, review the auto-filled title / description / thumbnail / duration, tag it to a series, assign a pillar (Harvest / Bride / Habitation), add scripture references, publish.
- **Create a series.** Title, description, poster, start/end dates.
- **Schedule a sermon** to publish at a future date — useful for Sunday-morning drops.

### After Phase 3 — Engagement

- **See today's submissions** on the dashboard: connect cards, prayer requests, decisions — with a CSV export button.
- **Mark a follow-up as done** — simple checkbox so multiple staff don't duplicate outreach.
- **Update the home banner** — write the headline, optional call-to-action, set active/inactive or schedule a window.
- **Approve testimonies** — staff-written or volunteer-submitted short quotes that appear on the home carousel.

### After Phase 4 — Events & Giving

- **Feature an event** on the home page and top of `/events`.
- **Update Rise Up and Build progress** — goal, pledged, given. A pastor-only field.

### After Phase 6 — Redirects & legacy URLs

- **Add a 301** — paste the old WordPress URL, type the new URL, save. We verify it's not a loop, then it's live in ~60s.
- **Privacy Policy / Terms / Child Protection** can be edited as MDX documents (plain text with a few formatting helpers).

---

## Voice & tone when you're writing

When you write an announcement, a testimony caption, or event description, use the brand voice. Short version:

- **Bold, scriptural, prophetic, family-oriented.** Not corporate, not "all welcome / warm smiles."
- **Write like a church that expects God to show up.**
- Examples we like:
  - "Sundays, 10 AM. Come hungry." (not "Join us on Sundays at 10 AM")
  - "You were not built for less." (not "We want to help you grow")
- For form labels, keep it plain. For headlines, lean prophetic and direct.

Full guide: `docs/BRAND.md`.

---

## Images

- Use original NHC photography. No stock unless approved.
- Upload to `/admin/media`. Images are automatically resized and delivered as AVIF / WebP.
- **Always add alt text.** One sentence describing what's in the image. If it's purely decorative, type `(decorative)` and we handle the rest.
- Posters for sermons should be 16:9 (1920x1080 ideal).

---

## Don'ts

- Do **not** paste payment-card info anywhere — we never handle card data. If someone emails one, delete it and tell them to use the giving link.
- Do **not** upload photos of minors without parental consent on file.
- Do **not** share the magic-link URL with anyone — it's effectively a password for your admin session.
- Do **not** edit URLs of published sermons after they've been out more than 48 hours. Use a redirect instead (Phase 6 admin feature).

---

## Something's broken

- For content bugs: create a row in `/admin/issues` (Phase 3+) or Slack the tech lead.
- If the admin panel itself is broken: email the vendor contact in `docs/RUNBOOK.md#who-to-call`.
- If you believe someone's submission didn't reach you, don't assume it's lost — the backend queue retries. Check the submission table via "All submissions."

---

_This guide will be rewritten with real screenshots and a training video before launch. Until then, the feature list above tracks what's live at each phase._
