-- ===========================================
-- NEW HEIGHTS CHURCH - DATABASE SCHEMA
-- Initial Migration
-- ===========================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ===========================================
-- CORE USER TABLESS
-- ===========================================

-- PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- USER ROLES
create table if not exists public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null, -- member | volunteer | kids_leader | staff_admin | super_admin
  granted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- Helper function to check roles
create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role = role_name
  );
$$;

-- ===========================================
-- HOUSEHOLD & CHILDREN
-- ===========================================

-- HOUSEHOLDS
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- HOUSEHOLD MEMBERS (many-to-many)
create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'guardian', -- guardian | adult | youth
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

-- CHILDREN
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  first_name text not null,
  last_name text,
  date_of_birth date,
  photo_url text,
  allergies text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AUTHORIZED PICKUPS (optional but recommended for security)
create table if not exists public.authorized_pickups (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  authorized_user_id uuid references public.profiles(id) on delete cascade,
  -- For non-user pickups (grandparents, etc.)
  name text,
  phone text,
  relationship text,
  photo_url text,
  is_primary boolean default false,
  created_at timestamptz not null default now()
);

-- ===========================================
-- KIDS CHECK-IN SYSTEM
-- ===========================================

-- ROOMS
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_age_months int,
  max_age_months int,
  capacity int,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ROOM LEADERS (many-to-many)
create table if not exists public.room_leaders (
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

-- SERVICES (scheduled instances)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- CHECKINS
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  room_id uuid not null references public.rooms(id),
  checked_in_at timestamptz not null default now(),
  checked_out_at timestamptz,
  checked_in_by uuid not null references public.profiles(id),
  checked_out_by uuid references public.profiles(id),
  released_to uuid references public.profiles(id), -- Who picked up
  status text not null default 'checked_in', -- checked_in | checked_out | void
  pickup_token text, -- 4-6 digit verification code
  created_at timestamptz not null default now()
);

-- Create index for quick lookup during services
create index if not exists idx_checkins_service_status 
  on public.checkins(service_id, status);
create index if not exists idx_checkins_room_status 
  on public.checkins(room_id, status);

-- PARENT NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.checkins(id) on delete cascade,
  room_id uuid not null references public.rooms(id),
  type text not null default 'need_parent', -- need_parent | general | emergency
  message text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  acknowledged_by uuid references public.profiles(id),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id),
  status text not null default 'sent' -- sent | acknowledged | resolved | cancelled
);

-- ===========================================
-- PUSH NOTIFICATIONS
-- ===========================================

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

-- ===========================================
-- MEMBER FEATURES
-- ===========================================

-- SAVED ITEMS (sermons, podcasts)
create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null, -- sermon | podcast_episode
  ref_id text not null,    -- sanity document id or podcast guid
  created_at timestamptz not null default now(),
  unique (user_id, item_type, ref_id)
);

-- BAPTISM REGISTRATION
create table if not exists public.baptism_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  full_name text not null,
  phone text,
  email text,
  preferred_date date,
  notes text,
  status text not null default 'submitted', -- submitted | contacted | scheduled | completed
  created_at timestamptz not null default now()
);

-- TRAINING PROGRESS
create table if not exists public.training_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_ref text not null, -- sanity course id or slug
  progress jsonb not null default '{}'::jsonb,
  started_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, course_ref)
);

-- ===========================================
-- AUDIT LOG (Immutable)
-- ===========================================

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  meta jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Create index for quick audit lookups
create index if not exists idx_audit_log_entity 
  on public.audit_log(entity_type, entity_id);
create index if not exists idx_audit_log_actor 
  on public.audit_log(actor_id, created_at desc);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.children enable row level security;
alter table public.authorized_pickups enable row level security;
alter table public.rooms enable row level security;
alter table public.room_leaders enable row level security;
alter table public.services enable row level security;
alter table public.checkins enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.saved_items enable row level security;
alter table public.baptism_registrations enable row level security;
alter table public.training_progress enable row level security;
alter table public.audit_log enable row level security;

-- ===========================================
-- RLS POLICIES
-- ===========================================

-- PROFILES
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Staff can view all profiles"
  on public.profiles for select
  using (public.has_role('staff_admin') or public.has_role('super_admin'));

-- HOUSEHOLDS
create policy "Users can view their households"
  on public.households for select
  using (
    id in (
      select household_id from public.household_members
      where user_id = auth.uid()
    )
  );

create policy "Users can create households"
  on public.households for insert
  with check (created_by = auth.uid());

create policy "Guardians can update their households"
  on public.households for update
  using (
    id in (
      select household_id from public.household_members
      where user_id = auth.uid() and member_role = 'guardian'
    )
  );

-- CHILDREN
create policy "Users can view children in their households"
  on public.children for select
  using (
    household_id in (
      select household_id from public.household_members
      where user_id = auth.uid()
    )
  );

create policy "Guardians can manage children"
  on public.children for all
  using (
    household_id in (
      select household_id from public.household_members
      where user_id = auth.uid() and member_role = 'guardian'
    )
  );

create policy "Kids leaders can view all children"
  on public.children for select
  using (public.has_role('kids_leader') or public.has_role('staff_admin'));

-- ROOMS (public read)
create policy "Anyone can view active rooms"
  on public.rooms for select
  using (active = true);

create policy "Staff can manage rooms"
  on public.rooms for all
  using (public.has_role('staff_admin') or public.has_role('super_admin'));

-- SERVICES (public read)
create policy "Anyone can view services"
  on public.services for select
  using (true);

create policy "Staff can manage services"
  on public.services for all
  using (public.has_role('staff_admin') or public.has_role('super_admin'));

-- CHECKINS
create policy "Users can view their children's checkins"
  on public.checkins for select
  using (
    child_id in (
      select c.id from public.children c
      join public.household_members hm on c.household_id = hm.household_id
      where hm.user_id = auth.uid()
    )
  );

create policy "Users can create checkins for their children"
  on public.checkins for insert
  with check (
    child_id in (
      select c.id from public.children c
      join public.household_members hm on c.household_id = hm.household_id
      where hm.user_id = auth.uid()
    )
  );

create policy "Kids leaders can view room checkins"
  on public.checkins for select
  using (
    room_id in (
      select room_id from public.room_leaders
      where user_id = auth.uid()
    )
    or public.has_role('kids_leader')
    or public.has_role('staff_admin')
  );

create policy "Kids leaders can update room checkins"
  on public.checkins for update
  using (
    room_id in (
      select room_id from public.room_leaders
      where user_id = auth.uid()
    )
    or public.has_role('kids_leader')
    or public.has_role('staff_admin')
  );

-- NOTIFICATIONS
create policy "Users can view notifications for their children"
  on public.notifications for select
  using (
    checkin_id in (
      select ck.id from public.checkins ck
      join public.children c on ck.child_id = c.id
      join public.household_members hm on c.household_id = hm.household_id
      where hm.user_id = auth.uid()
    )
  );

create policy "Users can acknowledge notifications"
  on public.notifications for update
  using (
    checkin_id in (
      select ck.id from public.checkins ck
      join public.children c on ck.child_id = c.id
      join public.household_members hm on c.household_id = hm.household_id
      where hm.user_id = auth.uid()
    )
  );

create policy "Kids leaders can create notifications"
  on public.notifications for insert
  with check (
    public.has_role('kids_leader') or public.has_role('staff_admin')
  );

-- PUSH SUBSCRIPTIONS
create policy "Users can manage own subscriptions"
  on public.push_subscriptions for all
  using (user_id = auth.uid());

-- SAVED ITEMS
create policy "Users can manage own saved items"
  on public.saved_items for all
  using (user_id = auth.uid());

-- BAPTISM REGISTRATIONS
create policy "Users can view own registrations"
  on public.baptism_registrations for select
  using (user_id = auth.uid());

create policy "Users can create registrations"
  on public.baptism_registrations for insert
  with check (true); -- Anyone can register

create policy "Staff can view all registrations"
  on public.baptism_registrations for select
  using (public.has_role('staff_admin'));

-- TRAINING PROGRESS
create policy "Users can manage own progress"
  on public.training_progress for all
  using (user_id = auth.uid());

-- AUDIT LOG (read-only for admins)
create policy "Super admins can view audit log"
  on public.audit_log for select
  using (public.has_role('super_admin'));

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  
  -- Give new users the 'member' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'member');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update timestamps
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.households
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.children
  for each row execute procedure public.handle_updated_at();

-- ===========================================
-- SEED DATA (Demo)
-- ===========================================

-- Insert default rooms
insert into public.rooms (name, min_age_months, max_age_months, capacity) values
  ('Nursery', 0, 12, 10),
  ('Toddlers', 12, 24, 12),
  ('Pre-K', 24, 60, 15),
  ('Elementary', 60, 144, 20)
on conflict do nothing;
