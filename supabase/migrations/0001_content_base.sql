-- =====================================================================
-- New Heights Church — 0001_content_base
-- Sermons, series, and a shared `updated_at` trigger.
-- RLS is ON for every table; public read is scoped to "published" rows.
-- Staff write access lives in policy `staff_write_<table>` and is gated
-- by the `staff_emails` table populated via the admin allow-list.
-- =====================================================================

-- ---------- Utility: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Staff allow-list ----------
create table if not exists public.staff_emails (
  email text primary key,
  role text not null default 'editor' check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default now()
);

comment on table public.staff_emails is
  'Authoritative list of staff who may write to content tables. Seeded from ADMIN_EMAILS env on first deploy; thereafter edited via /admin/users.';

alter table public.staff_emails enable row level security;

-- Only service_role can touch this table directly. Application code checks
-- the user's JWT email against this list inside security definer functions.
create policy "staff_emails_service_only"
  on public.staff_emails
  for all
  using (auth.role() = 'service_role');

-- Helper: is the current auth'd user a staff member?
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_emails s
    where s.email = coalesce(
      auth.jwt() ->> 'email',
      (auth.jwt() -> 'user_metadata' ->> 'email')
    )
  );
$$;

-- ---------- Series ----------
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  poster_url text,
  start_date date,
  end_date date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger series_set_updated_at
  before update on public.series
  for each row execute function public.set_updated_at();

alter table public.series enable row level security;

create policy "series_public_read"
  on public.series
  for select
  using (published = true);

create policy "series_staff_all"
  on public.series
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Sermons ----------
create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  speaker text not null default 'Apostle Brian Hallam',
  series_id uuid references public.series(id) on delete set null,
  service_date date not null,
  youtube_id text,                 -- 11-char YouTube video id (e.g. dQw4w9WgXcQ)
  audio_url text,
  duration_seconds integer,
  poster_url text,
  transcript text,
  notes_url text,
  scripture_refs text[] default '{}'::text[],  -- e.g. {'John 2:1-11'}
  topics text[] default '{}'::text[],
  pillar text check (pillar in ('harvest','bride','habitation')),
  views integer not null default 0,
  published boolean not null default false,
  published_at timestamptz,
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(speaker, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(scripture_refs, '{}'), ' ')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(topics, '{}'), ' ')), 'C') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'D')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger sermons_set_updated_at
  before update on public.sermons
  for each row execute function public.set_updated_at();

create index if not exists sermons_search_idx on public.sermons using gin (search);
create index if not exists sermons_service_date_idx on public.sermons (service_date desc);
create index if not exists sermons_series_id_idx on public.sermons (series_id);
create index if not exists sermons_pillar_idx on public.sermons (pillar) where pillar is not null;
create index if not exists sermons_published_idx on public.sermons (published, service_date desc);

comment on column public.sermons.youtube_id is
  '11-character YouTube video id. Source of truth for the media file; we embed via youtube-nocookie.com.';

alter table public.sermons enable row level security;

create policy "sermons_public_read"
  on public.sermons
  for select
  using (published = true);

create policy "sermons_staff_all"
  on public.sermons
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- View count bump ----------
-- Small RPC so the client increments views without needing an UPDATE policy
-- on every authenticated user. Rate limiting happens at the route handler.
create or replace function public.bump_sermon_view(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.sermons
     set views = views + 1
   where slug = p_slug
     and published = true;
$$;

revoke all on function public.bump_sermon_view(text) from public;
grant execute on function public.bump_sermon_view(text) to anon, authenticated;
