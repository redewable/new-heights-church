-- =====================================================================
-- New Heights Church — 0002_engagement
-- Connect cards, prayer requests, salvation decisions, newsletter
-- subscribers, and a shared submission_jobs queue for async downstream
-- syncs (Planning Center, Mailchimp, Resend retries).
--
-- RLS posture:
--   - Public can INSERT (the forms). Nothing more.
--   - Staff can SELECT / UPDATE via the `is_staff()` helper from 0001.
--   - No one (not even staff) DELETEs through the API — retention decisions
--     are taken deliberately from the service-role context only.
-- =====================================================================

-- ---------- Connect Cards (§9.1) ----------
create table if not exists public.connect_cards (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  how_heard text,
  first_time boolean not null default true,
  service_date date,
  prayer_request text,
  wants_call boolean not null default false,
  pc_person_id text,               -- set after successful Planning Center sync
  consent_email boolean not null default true,
  user_agent text,
  ip_hash text,                     -- sha256(ip + secret) — never the raw IP
  created_at timestamptz not null default now()
);

create index if not exists connect_cards_created_at_idx
  on public.connect_cards (created_at desc);
create index if not exists connect_cards_first_time_idx
  on public.connect_cards (first_time) where first_time = true;

alter table public.connect_cards enable row level security;

create policy "connect_cards_public_insert"
  on public.connect_cards
  for insert
  with check (true);

create policy "connect_cards_staff_read"
  on public.connect_cards
  for select
  using (public.is_staff());

create policy "connect_cards_staff_update"
  on public.connect_cards
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Prayer Requests (§9.2) ----------
create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  request text not null,
  urgent boolean not null default false,
  share_anonymously boolean not null default false,
  status text not null default 'new'
    check (status in ('new','praying','closed')),
  followed_up boolean not null default false,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger prayer_requests_set_updated_at
  before update on public.prayer_requests
  for each row execute function public.set_updated_at();

create index if not exists prayer_requests_created_at_idx
  on public.prayer_requests (created_at desc);
create index if not exists prayer_requests_status_idx
  on public.prayer_requests (status, created_at desc);

alter table public.prayer_requests enable row level security;

create policy "prayer_requests_public_insert"
  on public.prayer_requests
  for insert
  with check (true);

create policy "prayer_requests_staff_read"
  on public.prayer_requests
  for select
  using (public.is_staff());

create policy "prayer_requests_staff_update"
  on public.prayer_requests
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Decisions (§9.3) — this flow is sacred ----------
create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  decision_type text not null
    check (decision_type in ('salvation','rededication','holy_spirit','water_baptism')),
  first_name text not null,
  last_name text,
  email text,
  phone text,
  service_channel text
    check (service_channel in ('in_person','online')),
  notes text,
  followed_up boolean not null default false,
  follow_up_assigned_to text,
  follow_up_at timestamptz,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger decisions_set_updated_at
  before update on public.decisions
  for each row execute function public.set_updated_at();

create index if not exists decisions_created_at_idx
  on public.decisions (created_at desc);
create index if not exists decisions_type_idx
  on public.decisions (decision_type, created_at desc);
create index if not exists decisions_followup_idx
  on public.decisions (followed_up, created_at) where followed_up = false;

alter table public.decisions enable row level security;

create policy "decisions_public_insert"
  on public.decisions
  for insert
  with check (true);

create policy "decisions_staff_read"
  on public.decisions
  for select
  using (public.is_staff());

create policy "decisions_staff_update"
  on public.decisions
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Newsletter subscribers ----------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text,
  source text,                 -- "footer", "inline-give", "im-new", etc.
  mailchimp_id text,
  confirmed boolean not null default false,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_public_insert"
  on public.newsletter_subscribers
  for insert
  with check (true);

create policy "newsletter_staff_read"
  on public.newsletter_subscribers
  for select
  using (public.is_staff());

create policy "newsletter_staff_update"
  on public.newsletter_subscribers
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Submission Jobs (async downstream sync queue) ----------
-- Per RFP §9: write to Supabase first, then attempt Planning Center sync;
-- sync failures retry async. This table is the queue.
create table if not exists public.submission_jobs (
  id uuid primary key default gen_random_uuid(),
  source_table text not null
    check (source_table in
      ('connect_cards','prayer_requests','decisions','newsletter_subscribers')),
  source_id uuid not null,
  target text not null
    check (target in ('planning_center','mailchimp','resend')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending','retrying','done','failed','skipped')),
  attempts int not null default 0,
  last_error text,
  scheduled_for timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger submission_jobs_set_updated_at
  before update on public.submission_jobs
  for each row execute function public.set_updated_at();

create index if not exists submission_jobs_due_idx
  on public.submission_jobs (status, scheduled_for)
  where status in ('pending','retrying');
create index if not exists submission_jobs_source_idx
  on public.submission_jobs (source_table, source_id);

comment on table public.submission_jobs is
  'Async retry queue for downstream integrations. A tiny cron/worker claims rows where status in (pending, retrying) and scheduled_for <= now(), processes, and updates status.';

alter table public.submission_jobs enable row level security;

create policy "submission_jobs_staff_read"
  on public.submission_jobs
  for select
  using (public.is_staff());

-- Only service-role writes to this table (inserted from the server actions
-- running with the service key, updated by the worker).
create policy "submission_jobs_service_only_write"
  on public.submission_jobs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
