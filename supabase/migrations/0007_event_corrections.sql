-- =====================================================================
-- New Heights Church — 0007_event_corrections
-- (1) Add a registration_status column so we can render "closed" /
--     "waitlist" / "tbd" CTA states without relying on nulling the URL.
-- (2) Correct the fabricated dates from 0004 with real PC / Brushfire
--     data supplied by staff 2026-04-22.
-- =====================================================================

alter table public.events
  add column if not exists registration_status text
    not null default 'open'
    check (registration_status in ('open', 'closed', 'waitlist', 'tbd'));

create index if not exists events_registration_status_idx
  on public.events (registration_status);

-- ---------- New to New Heights — next session Sunday May 17, 2026 ----------
update public.events set
  start_at = '2026-05-17 08:30:00-05',
  end_at   = '2026-05-17 09:45:00-05',
  time_note = 'Sunday · 8:30–9:45 AM',
  location  = 'New Heights Church · The Upper Room (2nd Floor)',
  subtitle  = 'The first room on the road to Foundations of Faith + serving.',
  registration_status = 'open'
where slug = 'new-to-new-heights';

-- ---------- Foundations of Faith — current 4-week cohort Apr 19 – May 10 ----------
update public.events set
  start_at = '2026-04-26 08:30:00-05',   -- next remaining session
  end_at   = '2026-05-10 09:30:00-05',   -- cohort ends
  time_note = 'Sunday mornings · 8:30–9:30 AM · 4-week cohort',
  location  = 'New Heights Church · The Upper Room (2nd Floor)',
  subtitle  = 'Four Sundays. The whole counsel of God, plainly taught.',
  description = 'Welcome to the family of Christ. As a born-again believer you''re a Christian — Christ-One — redeemed by His sacrifice. This four-week class teaches who Jesus is and what you are, your purpose, what a Christian does, and when and where. The Bible is our guide to knowing who we are and how to live the calling on our life. Come and discover your new family. Remaining sessions: April 26 · May 3 · May 10.',
  registration_status = 'open'
where slug = 'foundations-of-faith';

-- ---------- Youth Camp Encounter — Fri–Sun June 19–21, 2026 ----------
update public.events set
  start_at = '2026-06-19 09:00:00-05',
  end_at   = '2026-06-21 17:00:00-05',
  time_note = 'Friday morning – Sunday afternoon',
  location  = 'Carolina Creek Camps & Retreat Center, Huntsville, TX',
  subtitle  = 'A weekend away with the Youth Army. Entering 6th grade through High School Senior.',
  description = 'Our annual youth camp — worship, word, altar, and the friendships that build a generation. Led by the Youth Army pastoral team at Carolina Creek in Huntsville, TX. Cost is $350 per camper (with a $100 non-refundable deposit); adult leaders require a background check and state-approved child protection training. Applications for 2026 closed March 31.',
  cost_label = '$350 per camper',
  registration_status = 'closed'
where slug = 'youth-camp-encounter';

-- ---------- Fall Conference 2026 — Thu–Sun September 24–27 ----------
update public.events set
  slug = 'conference-2026',                       -- rename since it's the only conference this year
  title = 'New Heights Conference 2026',
  start_at = '2026-09-24 19:00:00-05',
  end_at   = '2026-09-27 10:00:00-05',
  time_note = 'Thursday evening through Sunday morning',
  location  = 'New Heights Church · Main Room',
  subtitle  = 'Three days in the Presence with Apostle Brian Hallam and special guests.',
  description = 'A three-night, four-day gathering for the house and the region. Worship, word, altar. Apostle Brian Hallam and invited voices. Sponsored by New Heights Church — registration is required but free.',
  cost_label = 'Free (registration required)',
  registration_status = 'open'
where slug = 'fall-conference-2026';

-- ---------- Baby Dedications + Raffle already correct (user-confirmed) ----------
-- No date changes; touch updated_at so staff dashboards reflect the audit.
update public.events set updated_at = now() where slug in
  ('baby-dedications-may-10', 'youth-camp-raffle-may-10');
