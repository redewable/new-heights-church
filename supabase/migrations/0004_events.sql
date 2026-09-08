-- =====================================================================
-- New Heights Church — 0004_events
-- Events = editorial wrappers around whatever platform owns the
-- registration (Planning Center, Brushfire, or our own internal forms).
-- The DB stores the content + metadata; `registration_url` + platform
-- tell the UI which CTA badge and behavior to render.
-- =====================================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  /** Free-form "all-week" / "weekly" / specific room — human-readable only. */
  time_note text,
  location text,
  /** Audience filter on /events. */
  ministry text check (ministry in
    ('kids','youth','adults','church_wide','conferences','worship_nights','discipleship')),
  /** Optional pillar tag so events can mirror the three-pillar language. */
  pillar text check (pillar in ('harvest','bride','habitation')),
  /** Where the actual registration lives. NULL = no registration needed. */
  registration_url text,
  registration_platform text check (registration_platform in
    ('planning_center','brushfire','internal','external')),
  /** Optional display cost (e.g. "$99" or "Free"). Not a transaction. */
  cost_label text,
  poster_url text,
  /** CMS-editable pin for the top of the list. */
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

create index if not exists events_start_at_idx on public.events (start_at);
create index if not exists events_ministry_idx on public.events (ministry);
create index if not exists events_featured_idx on public.events (featured, start_at)
  where featured = true and published = true;
create index if not exists events_published_idx on public.events (published, start_at);

alter table public.events enable row level security;

create policy "events_public_read"
  on public.events
  for select
  using (published = true);

create policy "events_staff_all"
  on public.events
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- =====================================================================
-- Seed the six real current initiatives.
-- Dates are best-known as of 2026-04-21; staff can correct via admin.
-- =====================================================================
insert into public.events (
  slug, title, subtitle, description,
  start_at, end_at, time_note, location, ministry, pillar,
  registration_url, registration_platform, cost_label,
  featured, published, published_at
) values
  (
    'new-to-new-heights',
    'New to New Heights',
    'The first room on the road to Foundations of Faith + serving.',
    'The introduction class for every new guest. A short, welcoming walk through who we are, what we preach, and the discipleship path — New to New Heights → Foundations of Faith → First-Touch Team. Required before serving.',
    '2026-05-04 11:30:00-05', '2026-05-04 13:00:00-05',
    'Sunday following second service', 'NHC Classroom A', 'discipleship', 'bride',
    'https://experiencenewheights.churchcenter.com/registrations/events/3584132',
    'planning_center', 'Free',
    true, true, now()
  ),
  (
    'foundations-of-faith',
    'Foundations of Faith',
    'What we believe, why it matters, where you fit.',
    'A multi-week discipleship cohort — the whole counsel of God laid out plainly. After New to New Heights, this is the second class on the path; it qualifies you to join the First-Touch Team and serve the house.',
    '2026-05-18 18:30:00-05', '2026-05-18 20:00:00-05',
    'Sunday evenings · multi-week cohort', 'NHC Classroom B', 'discipleship', 'bride',
    'https://experiencenewheights.churchcenter.com/registrations/events/3558344',
    'planning_center', 'Free',
    true, true, now()
  ),
  (
    'baby-dedications-may-10',
    'Baby Dedications',
    'Consecrating the next generation at the altar.',
    'Parents bring their children before the house; pastors lay hands, declare a word, and the family stands together in covenant. The whole Church witnesses and prays.',
    '2026-05-10 10:00:00-05', '2026-05-10 12:00:00-05',
    'Sunday service', 'NHC Main Room', 'church_wide', 'habitation',
    '/connect/baby-dedication',
    'internal', 'Free',
    true, true, now()
  ),
  (
    'youth-camp-encounter',
    'Youth Camp Encounter',
    'A week away with the Youth Army.',
    'Our annual youth camp — worship, word, altar, and the kind of friendships that build a generation. Led by the Youth Army pastoral team. Register early; spots fill up.',
    '2026-07-14 09:00:00-05', '2026-07-18 17:00:00-05',
    'Monday morning through Friday afternoon', 'Camp (off-site)', 'youth', null,
    'https://experiencenewheights.churchcenter.com/registrations/events/3478925',
    'planning_center', null,
    true, true, now()
  ),
  (
    'youth-camp-raffle-may-10',
    'Youth Camp Raffle Drawing',
    'One camper goes free.',
    'The annual raffle drawing for a full Youth Camp scholarship. Winner announced live at Sunday service; enter through the raffle page before the drawing.',
    '2026-05-10 10:00:00-05', '2026-05-10 12:00:00-05',
    'Sunday service', 'NHC Main Room', 'youth', null,
    'https://newheightschurch.info/new-heights-youth-raffle/',
    'external', null,
    false, true, now()
  ),
  (
    'fall-conference-2026',
    'New Heights Fall Conference 2026',
    'A three-day gathering for the house and the region.',
    'Three days, two nights, one room under the glory — Apostle Brian Hallam and invited voices carrying word + worship + altar. Open to our family and the wider region. Registration is through Brushfire.',
    '2026-11-06 19:00:00-06', '2026-11-08 12:00:00-06',
    'Friday evening through Sunday morning', 'NHC Main Room', 'conferences', null,
    'https://brushfire.com/newheightschurch/newheightsconference2026/627904',
    'brushfire', null,
    true, true, now()
  )
on conflict (slug) do nothing;
