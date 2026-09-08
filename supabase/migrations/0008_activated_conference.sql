-- =====================================================================
-- New Heights Church — 0008_activated_conference
-- (1) Add `speakers` so conferences can list guest voices in order.
-- (2) The September 24–27, 2026 conference is named ACTIVATED, with
--     Pastor Paula White, Prophet Dr. Lashund Lambert, and Prophet
--     Richard Summerlin (staff, 2026-09-07). Renames the slug from the
--     0007 placeholder and leaves 301s behind for both old slugs.
-- =====================================================================

alter table public.events
  add column if not exists speakers text[];

update public.events set
  slug        = 'activated-2026',
  title       = 'Activated',
  subtitle    = 'New Heights Conference 2026 · Four days in the Presence with Apostle Brian Hallam, Pastor Paula White, Prophet Dr. Lashund Lambert, and Prophet Richard Summerlin.',
  description = 'Activated is the New Heights Conference 2026 — for the house and the whole region — a Thursday-through-Sunday gathering built around worship, the word, and an open altar. Apostle Brian Hallam hosts, joined by Pastor Paula White, Prophet Dr. Lashund Lambert, and Prophet Richard Summerlin. Come to be activated: in your gifting, in your calling, in the harvest. Registration is required but free.',
  speakers    = array['Pastor Paula White', 'Prophet Dr. Lashund Lambert', 'Prophet Richard Summerlin'],
  start_at    = '2026-09-24 19:00:00-05',
  end_at      = '2026-09-27 12:00:00-05',
  time_note   = 'Thursday evening through Sunday morning',
  location    = 'New Heights Church · Main Room',
  cost_label  = 'Free (registration required)',
  poster_url  = 'https://newheightschurch.info/wp-content/uploads/2026/07/Conference-2026-7-scaled.png',
  registration_status = 'open',
  featured    = true,
  updated_at  = now()
where slug in ('conference-2026', 'fall-conference-2026');

-- Legacy URLs keep working.
insert into public.redirects (source_path, target_path, status_code, note)
values
  ('/events/conference-2026',      '/events/activated-2026', 301, 'Conference renamed Activated (2026-09)'),
  ('/events/fall-conference-2026', '/events/activated-2026', 301, 'Conference renamed Activated (2026-09)')
on conflict (source_path) do update
  set target_path = excluded.target_path,
      status_code = excluded.status_code,
      note        = excluded.note,
      active      = true,
      updated_at  = now();
