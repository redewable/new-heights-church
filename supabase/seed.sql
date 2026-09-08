-- =====================================================================
-- NHC local-dev seed. Only run against the local supabase project,
-- never production. `supabase db reset` applies this automatically.
--
-- Sermons mirror lib/sermons/fixtures.ts — the Church's six most recent
-- real services from the New Heights YouTube channel
-- (UCKRwjr7sT9avbEUDsY2BLiA, pulled 2026-09-07). Real video IDs, real
-- dates. No placeholder pillar / scripture / topic tags: staff tag in admin.
-- =====================================================================

-- Seed the staff allow-list with a convenience local account.
insert into public.staff_emails (email, role) values
  ('dev@localhost', 'admin'),
  ('admin@newheightschurch.info', 'admin')
on conflict (email) do nothing;

-- The two standing series.
insert into public.series (slug, title, description, start_date, published) values
  (
    'sunday-morning',
    'Sunday Morning @ New Heights',
    'The weekend gathering — worship, the Word of God, and an open altar. Every Sunday at 10 AM with Apostle Brian Hallam.',
    '2026-01-04',
    true
  ),
  (
    'wednesday-evening',
    'Wednesday Evening @ New Heights',
    'The midweek refill — prayer, the prophetic, and the presence of God. Every Wednesday at 7 PM with Apostle Brian Hallam.',
    '2026-01-07',
    true
  )
on conflict (slug) do nothing;

-- The six most recent services.
insert into public.sermons (
  slug, title, description, speaker, series_id, service_date,
  youtube_id, duration_seconds, scripture_refs, topics, pillar, published, published_at
)
select * from (values
  (
    'sunday-morning-2026-09-06',
    'Sunday Morning · September 6, 2026',
    'Sunday morning service at New Heights Church with Apostle Brian Hallam — worship, the Word of God, and the altar. September 6, 2026.',
    'Apostle Brian Hallam',
    (select id from public.series where slug = 'sunday-morning'),
    date '2026-09-06',
    '2fNnE7R1jfQ',
    null::int,
    array[]::text[],
    array[]::text[],
    null,
    true,
    timestamptz '2026-09-06 10:00-05'
  ),
  (
    'wednesday-evening-2026-09-02',
    'Wednesday Evening · September 2, 2026',
    'Wednesday evening service at New Heights Church with Apostle Brian Hallam — prayer, the prophetic, and the presence of God. September 2, 2026.',
    'Apostle Brian Hallam',
    (select id from public.series where slug = 'wednesday-evening'),
    date '2026-09-02',
    'kP3C1SlllRk',
    null::int,
    array[]::text[],
    array[]::text[],
    null,
    true,
    timestamptz '2026-09-02 19:00-05'
  ),
  (
    'sunday-morning-2026-08-30',
    'Sunday Morning · August 30, 2026',
    'Sunday morning service at New Heights Church with Apostle Brian Hallam — worship, the Word of God, and the altar. August 30, 2026.',
    'Apostle Brian Hallam',
    (select id from public.series where slug = 'sunday-morning'),
    date '2026-08-30',
    'b0bkcZJo05g',
    null::int,
    array[]::text[],
    array[]::text[],
    null,
    true,
    timestamptz '2026-08-30 10:00-05'
  ),
  (
    'wednesday-evening-2026-08-26',
    'Wednesday Evening · August 26, 2026',
    'Wednesday evening service at New Heights Church with Apostle Brian Hallam — prayer, the prophetic, and the presence of God. August 26, 2026.',
    'Apostle Brian Hallam',
    (select id from public.series where slug = 'wednesday-evening'),
    date '2026-08-26',
    'j0PfC7luZrE',
    null::int,
    array[]::text[],
    array[]::text[],
    null,
    true,
    timestamptz '2026-08-26 19:00-05'
  ),
  (
    'sunday-morning-2026-08-23',
    'Sunday Morning · August 23, 2026',
    'Sunday morning service at New Heights Church with Apostle Brian Hallam — worship, the Word of God, and the altar. August 23, 2026.',
    'Apostle Brian Hallam',
    (select id from public.series where slug = 'sunday-morning'),
    date '2026-08-23',
    'tu8wWQ0HW8s',
    null::int,
    array[]::text[],
    array[]::text[],
    null,
    true,
    timestamptz '2026-08-23 10:00-05'
  ),
  (
    'wednesday-evening-2026-08-19',
    'Wednesday Evening · August 19, 2026',
    'Wednesday evening service at New Heights Church with Apostle Brian Hallam — prayer, the prophetic, and the presence of God. August 19, 2026.',
    'Apostle Brian Hallam',
    (select id from public.series where slug = 'wednesday-evening'),
    date '2026-08-19',
    'tHLnZvjBzSE',
    null::int,
    array[]::text[],
    array[]::text[],
    null,
    true,
    timestamptz '2026-08-19 19:00-05'
  )
) as v
on conflict (slug) do nothing;
