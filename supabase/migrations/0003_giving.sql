-- =====================================================================
-- New Heights Church — 0003_giving
-- Pledges (intent, never payment), campaign progress, year-end statement
-- requests. All RLS-protected; public insert, staff read+update.
--
-- We NEVER store card data. Everything payment-adjacent rides on
-- Pushpay/Engiven/Edward Jones (per RFP §1 PCI-DSS non-negotiable).
-- =====================================================================

-- ---------- Campaign Progress ----------
-- Small table, admin-edited. Surfaces on /rise-up-and-build and /give.
create table if not exists public.campaign_progress (
  id uuid primary key default gen_random_uuid(),
  campaign text not null unique,            -- slug: 'rise-up-and-build', etc.
  title text not null,
  blurb text,
  goal_cents bigint not null,
  pledged_cents bigint not null default 0,
  given_cents bigint not null default 0,
  next_milestone text,
  next_milestone_date date,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger campaign_progress_set_updated_at
  before update on public.campaign_progress
  for each row execute function public.set_updated_at();

alter table public.campaign_progress enable row level security;

create policy "campaign_progress_public_read"
  on public.campaign_progress
  for select
  using (active = true);

create policy "campaign_progress_staff_all"
  on public.campaign_progress
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Pledges (§9.9) ----------
-- NOT a payment. Captures intent only. A confirmation email sends a link
-- to Pushpay so the donor can set up the actual recurring gift there.
create table if not exists public.pledges (
  id uuid primary key default gen_random_uuid(),
  campaign text not null references public.campaign_progress(campaign) on delete restrict,
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  amount_cents bigint not null check (amount_cents > 0),
  frequency text not null check (frequency in ('one_time','monthly','quarterly','annually')),
  note text,
  consent_followup boolean not null default true,
  pushpay_initiated_at timestamptz,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger pledges_set_updated_at
  before update on public.pledges
  for each row execute function public.set_updated_at();

create index if not exists pledges_campaign_idx
  on public.pledges (campaign, created_at desc);
create index if not exists pledges_email_idx
  on public.pledges (lower(email));

alter table public.pledges enable row level security;

create policy "pledges_public_insert"
  on public.pledges
  for insert
  with check (true);

create policy "pledges_staff_read"
  on public.pledges
  for select
  using (public.is_staff());

create policy "pledges_staff_update"
  on public.pledges
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Year-End Giving Statement Requests (§9.11) ----------
-- Donor asks for a consolidated year-end statement; staff generates and
-- emails manually (until we automate Pushpay statement merging).
create table if not exists public.statement_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  tax_year int not null check (tax_year between 2000 and 2100),
  notes text,
  fulfilled boolean not null default false,
  fulfilled_at timestamptz,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger statement_requests_set_updated_at
  before update on public.statement_requests
  for each row execute function public.set_updated_at();

create index if not exists statement_requests_fulfilled_idx
  on public.statement_requests (fulfilled, created_at)
  where fulfilled = false;

alter table public.statement_requests enable row level security;

create policy "statement_requests_public_insert"
  on public.statement_requests
  for insert
  with check (true);

create policy "statement_requests_staff_read"
  on public.statement_requests
  for select
  using (public.is_staff());

create policy "statement_requests_staff_update"
  on public.statement_requests
  for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- Seed the Rise Up + Growth campaigns ----------
insert into public.campaign_progress (campaign, title, blurb, goal_cents, pledged_cents, given_cents, next_milestone, active)
values
  (
    'rise-up-and-build',
    'Rise Up and Build',
    'Every seat filled, every square foot sanctified, every ceiling raised for what the Lord is doing in this season.',
    250000000,  -- $2.5M placeholder — real numbers via admin
    0,
    0,
    'Phase 1 groundbreaking',
    true
  ),
  (
    'giving-towards-growth',
    'Giving Towards Growth for The Harvest',
    'A focused push into the first pillar. Seats, altars, and staff for the next season of souls.',
    50000000,   -- $500k placeholder
    0,
    0,
    null,
    true
  )
on conflict (campaign) do nothing;
