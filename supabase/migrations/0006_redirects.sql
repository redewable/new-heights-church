-- =====================================================================
-- New Heights Church — 0006_redirects
-- Legacy-URL → new-URL map. Every edit lands here (staff via admin);
-- proxy.ts queries this table on each request (cached) to issue 301s.
-- Seeded with the common WordPress routes from RFP §14.
-- =====================================================================

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text unique not null,
  target_path text not null,
  /** 301 permanent by default. Use 302 for temporary campaign redirects. */
  status_code int not null default 301
    check (status_code in (301, 302, 307, 308)),
  /** Optional editorial label staff can set — shows in admin, not on users. */
  note text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger redirects_set_updated_at
  before update on public.redirects
  for each row execute function public.set_updated_at();

create index if not exists redirects_active_source_idx
  on public.redirects (source_path)
  where active = true;

alter table public.redirects enable row level security;

-- Public CAN read the active map — `proxy.ts` queries with the anon key.
-- Rationale: redirect rules are not sensitive; exposing them via a public
-- read policy lets us avoid round-tripping through a privileged endpoint
-- on every request.
create policy "redirects_public_read"
  on public.redirects
  for select
  using (active = true);

create policy "redirects_staff_all"
  on public.redirects
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Seed the common WordPress → new-site map ----------
insert into public.redirects (source_path, target_path, status_code, note) values
  ('/sermons-main',               '/sermons',                 301, 'WordPress sermon archive root'),
  ('/sermons-main/',              '/sermons',                 301, 'Trailing-slash variant'),
  ('/online',                     '/watch',                   301, 'Legacy livestream landing'),
  ('/online/',                    '/watch',                   301, 'Trailing-slash variant'),
  ('/giving',                     '/give',                    301, 'Legacy giving page'),
  ('/giving/',                    '/give',                    301, 'Trailing-slash variant'),
  ('/bhp',                        '/podcasts#brian-hallam-podcast', 301, 'Brian Hallam Podcast short link'),
  ('/bhp/',                       '/podcasts#brian-hallam-podcast', 301, 'Trailing-slash variant'),
  ('/riseupandbuild',             '/rise-up-and-build',       301, 'Legacy Rise Up campaign page'),
  ('/riseupandbuild/',            '/rise-up-and-build',       301, 'Trailing-slash variant'),
  ('/new-heights-youth-raffle',   '/youth#raffle',            301, 'Raffle entry (lives externally for now)'),
  ('/new-heights-youth-raffle/',  '/youth#raffle',            301, 'Trailing-slash variant')
on conflict (source_path) do nothing;
