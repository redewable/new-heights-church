-- =====================================================================
-- New Heights Church — 0005_grow_engagement
-- Three interest-capture tables for the Grow pages:
--   baptism_interest        (§9.4 — no fixed date; staff matches to next Sunday)
--   baby_dedications        (§9.5 — next one May 10, 2026)
--   volunteer_applications  (§9.7 — First-Touch Team; N2N + Foundations prereq)
--
-- RLS stance mirrors 0002 engagement tables: public insert, staff read+update.
-- =====================================================================

-- ---------- Baptism interest ----------
create table if not exists public.baptism_interest (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  date_of_birth date,
  /** Under 18 requires parent consent — UI collects both names + contact. */
  parent_consent boolean not null default false,
  parent_name text,
  parent_phone text,
  /** The new convert's short testimony — given, not required. */
  testimony text,
  preferred_service text,
  status text not null default 'new'
    check (status in ('new','scheduled','baptized','paused')),
  scheduled_for date,
  baptized_on date,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger baptism_interest_set_updated_at
  before update on public.baptism_interest
  for each row execute function public.set_updated_at();

create index if not exists baptism_interest_status_idx
  on public.baptism_interest (status, created_at desc);

alter table public.baptism_interest enable row level security;

create policy "baptism_interest_public_insert"
  on public.baptism_interest
  for insert
  with check (true);

create policy "baptism_interest_staff_read"
  on public.baptism_interest
  for select
  using (public.is_staff());

create policy "baptism_interest_staff_update"
  on public.baptism_interest
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Baby dedications ----------
create table if not exists public.baby_dedications (
  id uuid primary key default gen_random_uuid(),
  parent_first_name text not null,
  parent_last_name text not null,
  partner_first_name text,
  partner_last_name text,
  email text not null,
  phone text not null,
  child_first_name text not null,
  child_last_name text,
  child_date_of_birth date,
  preferred_service_date date,
  notes text,
  status text not null default 'new'
    check (status in ('new','scheduled','dedicated')),
  scheduled_for date,
  dedicated_on date,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger baby_dedications_set_updated_at
  before update on public.baby_dedications
  for each row execute function public.set_updated_at();

create index if not exists baby_dedications_status_idx
  on public.baby_dedications (status, created_at desc);
create index if not exists baby_dedications_preferred_idx
  on public.baby_dedications (preferred_service_date);

alter table public.baby_dedications enable row level security;

create policy "baby_dedications_public_insert"
  on public.baby_dedications
  for insert
  with check (true);

create policy "baby_dedications_staff_read"
  on public.baby_dedications
  for select
  using (public.is_staff());

create policy "baby_dedications_staff_update"
  on public.baby_dedications
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Volunteer applications (First-Touch Team + ministry teams) ----------
-- Gate: completed_n2n AND completed_foundations. Staff verifies before
-- onboarding; the form itself takes the applicant's word, but the admin
-- can reject with a note.
create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  /** Ministry teams the applicant wants to serve on — multi-select. */
  ministry_areas text[] not null default '{}'::text[],
  availability text,
  /** Self-attestation for the gating classes. Staff confirms via PC. */
  completed_n2n boolean not null default false,
  completed_foundations boolean not null default false,
  background_check_consent boolean not null default false,
  notes text,
  status text not null default 'new'
    check (status in ('new','reviewing','approved','waitlist','declined')),
  reviewed_at timestamptz,
  reviewed_by text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger volunteer_applications_set_updated_at
  before update on public.volunteer_applications
  for each row execute function public.set_updated_at();

create index if not exists volunteer_applications_status_idx
  on public.volunteer_applications (status, created_at desc);

alter table public.volunteer_applications enable row level security;

create policy "volunteer_applications_public_insert"
  on public.volunteer_applications
  for insert
  with check (true);

create policy "volunteer_applications_staff_read"
  on public.volunteer_applications
  for select
  using (public.is_staff());

create policy "volunteer_applications_staff_update"
  on public.volunteer_applications
  for update
  using (public.is_staff())
  with check (public.is_staff());
