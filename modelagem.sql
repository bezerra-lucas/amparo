-- Sistema de Gestao Assistencial (ILPI) - Modelagem completa
-- Stack alvo: Supabase Postgres + RLS, autenticacao via Clerk (Third-party Auth)
-- Observacao: este arquivo e pensado para ser executado no SQL Editor do Supabase.

begin;

-- Extensions
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Core table required early (RBAC)
-- -----------------------------------------------------------------------------

-- NOTE: This table is created early because helper functions below reference it.
create table if not exists public.app_users (
  user_id text primary key,
  role text not null check (role in ('admin','nurse','caregiver','collaborator')),
  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

-- -----------------------------------------------------------------------------
-- Helpers (auth + RBAC)
-- -----------------------------------------------------------------------------

-- Current Clerk user id from JWT (sub)
create or replace function public.app_current_user_id()
returns text
language sql
stable
as $$
  select nullif(auth.jwt()->>'sub', '');
$$;

-- True when there are no active (non-deleted) app users yet.
-- SECURITY DEFINER so it can be evaluated even before RLS is configured.
create or replace function public.app_bootstrap_available()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.app_users u where u.deleted_at is null
  );
$$;

-- Returns current user role (or null) if user exists and is active.
create or replace function public.app_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.role
  from public.app_users u
  where u.user_id = public.app_current_user_id()
    and u.active is true
    and u.deleted_at is null
  limit 1;
$$;

create or replace function public.app_is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_users u
    where u.user_id = public.app_current_user_id()
      and u.active is true
      and u.deleted_at is null
  );
$$;

create or replace function public.app_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.app_user_role() = 'admin';
$$;

create or replace function public.app_has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.app_user_role() = any(roles);
$$;

-- -----------------------------------------------------------------------------
-- Generic timestamps + actor trigger
-- -----------------------------------------------------------------------------

create or replace function public.app_set_timestamps_and_actor()
returns trigger
language plpgsql
as $$
declare
  actor text;
begin
  actor := public.app_current_user_id();

  if tg_op = 'INSERT' then
    new.created_at := coalesce(new.created_at, now());
    new.updated_at := coalesce(new.updated_at, new.created_at, now());
    new.created_by := coalesce(new.created_by, actor);
    new.updated_by := coalesce(new.updated_by, new.created_by, actor);

    -- deleted_at/deleted_by should be null on insert unless explicitly set.
    if new.deleted_at is not null and new.deleted_by is null then
      new.deleted_by := actor;
    end if;

    return new;
  end if;

  if tg_op = 'UPDATE' then
    new.updated_at := now();
    new.updated_by := actor;

    -- soft delete bookkeeping
    if new.deleted_at is not null and old.deleted_at is null then
      new.deleted_by := coalesce(new.deleted_by, actor);
    end if;

    -- restore bookkeeping
    if new.deleted_at is null and old.deleted_at is not null then
      new.deleted_by := null;
    end if;

    return new;
  end if;

  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Audit (timeline)
-- -----------------------------------------------------------------------------

create or replace function public.app_jsonb_diff(
  old_row jsonb,
  new_row jsonb,
  ignore_keys text[]
)
returns jsonb
language plpgsql
immutable
as $$
declare
  result jsonb := '{}'::jsonb;
  k text;
  old_v jsonb;
  new_v jsonb;
begin
  old_row := coalesce(old_row, '{}'::jsonb);
  new_row := coalesce(new_row, '{}'::jsonb);

  for k in
    select key from (
      select jsonb_object_keys(old_row) as key
      union
      select jsonb_object_keys(new_row) as key
    ) keys
  loop
    if ignore_keys is not null and k = any(ignore_keys) then
      continue;
    end if;

    old_v := old_row -> k;
    new_v := new_row -> k;

    if old_v is distinct from new_v then
      result := result || jsonb_build_object(
        k,
        jsonb_build_object('from', old_v, 'to', new_v)
      );
    end if;
  end loop;

  return result;
end;
$$;

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),

  -- standard timestamps (project-wide requirement)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,

  -- actor timestamps (project-wide requirement)
  created_by text null,
  updated_by text null,
  deleted_by text null,

  -- business timestamp for the audit event
  occurred_at timestamptz not null default now(),

  actor_user_id text null,
  action text not null check (action in ('insert','update','soft_delete')),
  table_name text not null,
  record_pk text null,

  changes jsonb null,
  snapshot jsonb null
);

create index if not exists audit_events_occurred_at_idx on public.audit_events (occurred_at desc);
create index if not exists audit_events_actor_idx on public.audit_events (actor_user_id);
create index if not exists audit_events_table_idx on public.audit_events (table_name);
create index if not exists audit_events_record_pk_idx on public.audit_events (record_pk);

alter table public.audit_events enable row level security;

drop policy if exists audit_events_admin_select on public.audit_events;
create policy audit_events_admin_select
on public.audit_events
for select
to authenticated
using (public.app_is_admin());

-- No direct inserts/updates/deletes from client.

create or replace function public.app_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pk_col text := tg_argv[0];
  ignore_keys text[] := array[
    'created_at','updated_at','deleted_at','created_by','updated_by','deleted_by'
  ];
  old_row jsonb;
  new_row jsonb;
  pk text;
  act text;
  diff jsonb;
begin
  -- Never audit audit_events itself.
  if tg_table_name = 'audit_events' then
    return null;
  end if;

  if tg_op = 'INSERT' then
    new_row := to_jsonb(new);
    pk := nullif(new_row ->> pk_col, '');

    insert into public.audit_events (
      occurred_at,
      actor_user_id,
      action,
      table_name,
      record_pk,
      changes,
      snapshot
    ) values (
      now(),
      public.app_current_user_id(),
      'insert',
      tg_table_name,
      pk,
      null,
      new_row
    );

    return null;
  end if;

  if tg_op = 'UPDATE' then
    old_row := to_jsonb(old);
    new_row := to_jsonb(new);
    pk := nullif(coalesce(new_row ->> pk_col, old_row ->> pk_col), '');

    if old.deleted_at is null and new.deleted_at is not null then
      act := 'soft_delete';
    else
      act := 'update';
    end if;

    diff := public.app_jsonb_diff(old_row, new_row, ignore_keys);
    if diff = '{}'::jsonb then
      diff := null;
    end if;

    insert into public.audit_events (
      occurred_at,
      actor_user_id,
      action,
      table_name,
      record_pk,
      changes,
      snapshot
    ) values (
      now(),
      public.app_current_user_id(),
      act,
      tg_table_name,
      pk,
      diff,
      null
    );

    return null;
  end if;

  return null;
end;
$$;

-- -----------------------------------------------------------------------------
-- Domain tables
-- -----------------------------------------------------------------------------

-- App users (RBAC)
-- Table `app_users` is created near the top (required by helper functions).

create index if not exists app_users_role_idx on public.app_users (role);
create index if not exists app_users_active_idx on public.app_users (active);

alter table public.app_users enable row level security;

drop policy if exists app_users_select_self on public.app_users;
create policy app_users_select_self
on public.app_users
for select
to authenticated
using (
  public.app_current_user_id() is not null
  and deleted_at is null
  and user_id = public.app_current_user_id()
);

drop policy if exists app_users_select_admin_all on public.app_users;
create policy app_users_select_admin_all
on public.app_users
for select
to authenticated
using (public.app_is_admin());

drop policy if exists app_users_insert_bootstrap_admin on public.app_users;
create policy app_users_insert_bootstrap_admin
on public.app_users
for insert
to authenticated
with check (
  public.app_current_user_id() is not null
  and public.app_bootstrap_available()
  and user_id = public.app_current_user_id()
  and role = 'admin'
  and deleted_at is null
);

drop policy if exists app_users_insert_admin on public.app_users;
create policy app_users_insert_admin
on public.app_users
for insert
to authenticated
with check (
  public.app_is_admin()
  and deleted_at is null
);

drop policy if exists app_users_update_admin on public.app_users;
create policy app_users_update_admin
on public.app_users
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists app_users_set_timestamps on public.app_users;
create trigger app_users_set_timestamps
before insert or update on public.app_users
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists app_users_audit on public.app_users;
create trigger app_users_audit
after insert or update on public.app_users
for each row execute function public.app_audit_trigger('user_id');

-- Residents
create table if not exists public.residents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  admitted_at date null,
  status text not null default 'active' check (status in ('active','inactive','discharged','deceased')),
  dependency_level text null,
  diet_restrictions text null,
  mobility_notes text null,
  general_notes text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists residents_full_name_idx on public.residents (full_name);
create index if not exists residents_status_idx on public.residents (status);
create index if not exists residents_deleted_at_idx on public.residents (deleted_at);

alter table public.residents enable row level security;

drop policy if exists residents_select_admin_all on public.residents;
create policy residents_select_admin_all
on public.residents
for select
to authenticated
using (public.app_is_admin());

drop policy if exists residents_select_staff on public.residents;
create policy residents_select_staff
on public.residents
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists residents_insert_admin_nurse on public.residents;
create policy residents_insert_admin_nurse
on public.residents
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists residents_update_admin_nurse on public.residents;
create policy residents_update_admin_nurse
on public.residents
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists residents_update_admin_any on public.residents;
create policy residents_update_admin_any
on public.residents
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists residents_set_timestamps on public.residents;
create trigger residents_set_timestamps
before insert or update on public.residents
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists residents_audit on public.residents;
create trigger residents_audit
after insert or update on public.residents
for each row execute function public.app_audit_trigger('id');

-- Resident contacts
create table if not exists public.resident_contacts (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  name text not null,
  relationship text null,
  phone text null,
  notes text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists resident_contacts_resident_idx on public.resident_contacts (resident_id);
create index if not exists resident_contacts_deleted_at_idx on public.resident_contacts (deleted_at);

alter table public.resident_contacts enable row level security;

drop policy if exists resident_contacts_select_admin_all on public.resident_contacts;
create policy resident_contacts_select_admin_all
on public.resident_contacts
for select
to authenticated
using (public.app_is_admin());

drop policy if exists resident_contacts_select_staff on public.resident_contacts;
create policy resident_contacts_select_staff
on public.resident_contacts
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists resident_contacts_write_admin_nurse on public.resident_contacts;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists resident_contacts_insert_admin_nurse on public.resident_contacts;
create policy resident_contacts_insert_admin_nurse
on public.resident_contacts
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists resident_contacts_update_admin_nurse on public.resident_contacts;
create policy resident_contacts_update_admin_nurse
on public.resident_contacts
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists resident_contacts_update_admin_any on public.resident_contacts;
create policy resident_contacts_update_admin_any
on public.resident_contacts
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists resident_contacts_set_timestamps on public.resident_contacts;
create trigger resident_contacts_set_timestamps
before insert or update on public.resident_contacts
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists resident_contacts_audit on public.resident_contacts;
create trigger resident_contacts_audit
after insert or update on public.resident_contacts
for each row execute function public.app_audit_trigger('id');

-- Rooms / beds / assignments (optional but modeled)
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  label text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create unique index if not exists rooms_label_uniq_active
on public.rooms (label)
where deleted_at is null;

alter table public.rooms enable row level security;

drop policy if exists rooms_select_admin_all on public.rooms;
create policy rooms_select_admin_all
on public.rooms
for select
to authenticated
using (public.app_is_admin());

drop policy if exists rooms_select_staff on public.rooms;
create policy rooms_select_staff
on public.rooms
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists rooms_write_admin on public.rooms;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists rooms_insert_admin on public.rooms;
create policy rooms_insert_admin
on public.rooms
for insert
to authenticated
with check (public.app_is_admin() and deleted_at is null);

drop policy if exists rooms_update_admin on public.rooms;
create policy rooms_update_admin
on public.rooms
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists rooms_set_timestamps on public.rooms;
create trigger rooms_set_timestamps
before insert or update on public.rooms
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists rooms_audit on public.rooms;
create trigger rooms_audit
after insert or update on public.rooms
for each row execute function public.app_audit_trigger('id');

create table if not exists public.beds (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id),
  label text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists beds_room_idx on public.beds (room_id);
create unique index if not exists beds_room_label_uniq_active
on public.beds (room_id, label)
where deleted_at is null;

alter table public.beds enable row level security;

drop policy if exists beds_select_admin_all on public.beds;
create policy beds_select_admin_all
on public.beds
for select
to authenticated
using (public.app_is_admin());

drop policy if exists beds_select_staff on public.beds;
create policy beds_select_staff
on public.beds
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists beds_write_admin on public.beds;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists beds_insert_admin on public.beds;
create policy beds_insert_admin
on public.beds
for insert
to authenticated
with check (public.app_is_admin() and deleted_at is null);

drop policy if exists beds_update_admin on public.beds;
create policy beds_update_admin
on public.beds
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists beds_set_timestamps on public.beds;
create trigger beds_set_timestamps
before insert or update on public.beds
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists beds_audit on public.beds;
create trigger beds_audit
after insert or update on public.beds
for each row execute function public.app_audit_trigger('id');

create table if not exists public.resident_bed_assignments (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  bed_id uuid not null references public.beds(id),
  from_date date not null,
  to_date date null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null,

  constraint resident_bed_assignments_dates_ck
    check (to_date is null or to_date >= from_date)
);

create index if not exists resident_bed_assignments_resident_idx on public.resident_bed_assignments (resident_id);
create index if not exists resident_bed_assignments_bed_idx on public.resident_bed_assignments (bed_id);

alter table public.resident_bed_assignments enable row level security;

drop policy if exists resident_bed_assignments_select_admin_all on public.resident_bed_assignments;
create policy resident_bed_assignments_select_admin_all
on public.resident_bed_assignments
for select
to authenticated
using (public.app_is_admin());

drop policy if exists resident_bed_assignments_select_staff on public.resident_bed_assignments;
create policy resident_bed_assignments_select_staff
on public.resident_bed_assignments
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists resident_bed_assignments_write_admin_nurse on public.resident_bed_assignments;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists resident_bed_assignments_insert_admin_nurse on public.resident_bed_assignments;
create policy resident_bed_assignments_insert_admin_nurse
on public.resident_bed_assignments
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists resident_bed_assignments_update_admin_nurse on public.resident_bed_assignments;
create policy resident_bed_assignments_update_admin_nurse
on public.resident_bed_assignments
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists resident_bed_assignments_update_admin_any on public.resident_bed_assignments;
create policy resident_bed_assignments_update_admin_any
on public.resident_bed_assignments
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists resident_bed_assignments_set_timestamps on public.resident_bed_assignments;
create trigger resident_bed_assignments_set_timestamps
before insert or update on public.resident_bed_assignments
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists resident_bed_assignments_audit on public.resident_bed_assignments;
create trigger resident_bed_assignments_audit
after insert or update on public.resident_bed_assignments
for each row execute function public.app_audit_trigger('id');

-- Resident item definitions and movements
create table if not exists public.resident_item_defs (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  category text not null check (category in ('diapers','hygiene','misc')),
  name text not null,
  unit text null,
  min_quantity numeric not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists resident_item_defs_resident_idx on public.resident_item_defs (resident_id);
create index if not exists resident_item_defs_category_idx on public.resident_item_defs (category);

alter table public.resident_item_defs enable row level security;

drop policy if exists resident_item_defs_select_admin_all on public.resident_item_defs;
create policy resident_item_defs_select_admin_all
on public.resident_item_defs
for select
to authenticated
using (public.app_is_admin());

drop policy if exists resident_item_defs_select_staff on public.resident_item_defs;
create policy resident_item_defs_select_staff
on public.resident_item_defs
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists resident_item_defs_write_admin_nurse on public.resident_item_defs;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists resident_item_defs_insert_admin_nurse on public.resident_item_defs;
create policy resident_item_defs_insert_admin_nurse
on public.resident_item_defs
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists resident_item_defs_update_admin_nurse on public.resident_item_defs;
create policy resident_item_defs_update_admin_nurse
on public.resident_item_defs
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists resident_item_defs_update_admin_any on public.resident_item_defs;
create policy resident_item_defs_update_admin_any
on public.resident_item_defs
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists resident_item_defs_set_timestamps on public.resident_item_defs;
create trigger resident_item_defs_set_timestamps
before insert or update on public.resident_item_defs
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists resident_item_defs_audit on public.resident_item_defs;
create trigger resident_item_defs_audit
after insert or update on public.resident_item_defs
for each row execute function public.app_audit_trigger('id');

create table if not exists public.resident_item_movements (
  id uuid primary key default gen_random_uuid(),
  resident_item_def_id uuid not null references public.resident_item_defs(id),
  movement_type text not null check (movement_type in ('in','out','adjustment')),
  quantity numeric not null,
  reason text null,
  occurred_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists resident_item_movements_def_idx on public.resident_item_movements (resident_item_def_id);
create index if not exists resident_item_movements_occurred_at_idx on public.resident_item_movements (occurred_at desc);

alter table public.resident_item_movements enable row level security;

drop policy if exists resident_item_movements_select_admin_all on public.resident_item_movements;
create policy resident_item_movements_select_admin_all
on public.resident_item_movements
for select
to authenticated
using (public.app_is_admin());

drop policy if exists resident_item_movements_select_staff on public.resident_item_movements;
create policy resident_item_movements_select_staff
on public.resident_item_movements
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists resident_item_movements_insert_staff on public.resident_item_movements;
create policy resident_item_movements_insert_staff
on public.resident_item_movements
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists resident_item_movements_update_admin_nurse on public.resident_item_movements;
create policy resident_item_movements_update_admin_nurse
on public.resident_item_movements
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop trigger if exists resident_item_movements_set_timestamps on public.resident_item_movements;
create trigger resident_item_movements_set_timestamps
before insert or update on public.resident_item_movements
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists resident_item_movements_audit on public.resident_item_movements;
create trigger resident_item_movements_audit
after insert or update on public.resident_item_movements
for each row execute function public.app_audit_trigger('id');

-- Nursing reports
create table if not exists public.nursing_reports (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  report_date date not null,
  shift text not null check (shift in ('day','night')),
  body text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists nursing_reports_resident_idx on public.nursing_reports (resident_id);
create index if not exists nursing_reports_date_idx on public.nursing_reports (report_date desc);

create unique index if not exists nursing_reports_unique_active
on public.nursing_reports (resident_id, report_date, shift)
where deleted_at is null;

alter table public.nursing_reports enable row level security;

drop policy if exists nursing_reports_select_admin_all on public.nursing_reports;
create policy nursing_reports_select_admin_all
on public.nursing_reports
for select
to authenticated
using (public.app_is_admin());

drop policy if exists nursing_reports_select_staff on public.nursing_reports;
create policy nursing_reports_select_staff
on public.nursing_reports
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists nursing_reports_write_admin_nurse on public.nursing_reports;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists nursing_reports_insert_admin_nurse on public.nursing_reports;
create policy nursing_reports_insert_admin_nurse
on public.nursing_reports
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists nursing_reports_update_admin_nurse on public.nursing_reports;
create policy nursing_reports_update_admin_nurse
on public.nursing_reports
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists nursing_reports_update_admin_any on public.nursing_reports;
create policy nursing_reports_update_admin_any
on public.nursing_reports
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists nursing_reports_set_timestamps on public.nursing_reports;
create trigger nursing_reports_set_timestamps
before insert or update on public.nursing_reports
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists nursing_reports_audit on public.nursing_reports;
create trigger nursing_reports_audit
after insert or update on public.nursing_reports
for each row execute function public.app_audit_trigger('id');

-- Medications
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  form text null,
  notes text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create unique index if not exists medications_name_uniq_active
on public.medications (name)
where deleted_at is null;

alter table public.medications enable row level security;

drop policy if exists medications_select_admin_all on public.medications;
create policy medications_select_admin_all
on public.medications
for select
to authenticated
using (public.app_is_admin());

drop policy if exists medications_select_active_users on public.medications;
create policy medications_select_active_users
on public.medications
for select
to authenticated
using (
  deleted_at is null
  and public.app_is_active_user()
);

drop policy if exists medications_write_admin_nurse on public.medications;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists medications_insert_admin_nurse on public.medications;
create policy medications_insert_admin_nurse
on public.medications
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists medications_update_admin_nurse on public.medications;
create policy medications_update_admin_nurse
on public.medications
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists medications_update_admin_any on public.medications;
create policy medications_update_admin_any
on public.medications
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists medications_set_timestamps on public.medications;
create trigger medications_set_timestamps
before insert or update on public.medications
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists medications_audit on public.medications;
create trigger medications_audit
after insert or update on public.medications
for each row execute function public.app_audit_trigger('id');

-- Prescriptions
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  medication_id uuid null references public.medications(id),
  dose text not null,
  route text null,
  times text[] not null,
  start_date date null,
  end_date date null,
  active boolean not null default true,
  notes text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists prescriptions_resident_idx on public.prescriptions (resident_id);
create index if not exists prescriptions_medication_idx on public.prescriptions (medication_id);

alter table public.prescriptions enable row level security;

drop policy if exists prescriptions_select_admin_all on public.prescriptions;
create policy prescriptions_select_admin_all
on public.prescriptions
for select
to authenticated
using (public.app_is_admin());

drop policy if exists prescriptions_select_staff on public.prescriptions;
create policy prescriptions_select_staff
on public.prescriptions
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists prescriptions_write_admin_nurse on public.prescriptions;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists prescriptions_insert_admin_nurse on public.prescriptions;
create policy prescriptions_insert_admin_nurse
on public.prescriptions
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists prescriptions_update_admin_nurse on public.prescriptions;
create policy prescriptions_update_admin_nurse
on public.prescriptions
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists prescriptions_update_admin_any on public.prescriptions;
create policy prescriptions_update_admin_any
on public.prescriptions
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists prescriptions_set_timestamps on public.prescriptions;
create trigger prescriptions_set_timestamps
before insert or update on public.prescriptions
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists prescriptions_audit on public.prescriptions;
create trigger prescriptions_audit
after insert or update on public.prescriptions
for each row execute function public.app_audit_trigger('id');

-- Medication administrations (MAR events)
create table if not exists public.med_administrations (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  prescription_id uuid not null references public.prescriptions(id),
  scheduled_at timestamptz not null,
  status text not null check (status in ('given','not_given')),
  given_at timestamptz null,
  reason_not_given text null,

  medication_name text null,
  dose_snapshot text null,
  route_snapshot text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists med_admin_resident_idx on public.med_administrations (resident_id);
create index if not exists med_admin_prescription_idx on public.med_administrations (prescription_id);
create index if not exists med_admin_scheduled_idx on public.med_administrations (scheduled_at);

create unique index if not exists med_admin_unique_slot_active
on public.med_administrations (prescription_id, scheduled_at)
where deleted_at is null;

alter table public.med_administrations enable row level security;

drop policy if exists med_administrations_select_admin_all on public.med_administrations;
create policy med_administrations_select_admin_all
on public.med_administrations
for select
to authenticated
using (public.app_is_admin());

drop policy if exists med_administrations_select_staff on public.med_administrations;
create policy med_administrations_select_staff
on public.med_administrations
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists med_administrations_insert_staff on public.med_administrations;
create policy med_administrations_insert_staff
on public.med_administrations
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse','caregiver'])
);

drop policy if exists med_administrations_update_admin_nurse on public.med_administrations;
create policy med_administrations_update_admin_nurse
on public.med_administrations
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop trigger if exists med_administrations_set_timestamps on public.med_administrations;
create trigger med_administrations_set_timestamps
before insert or update on public.med_administrations
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists med_administrations_audit on public.med_administrations;
create trigger med_administrations_audit
after insert or update on public.med_administrations
for each row execute function public.app_audit_trigger('id');

-- Medication stock movements
create table if not exists public.med_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications(id),
  movement_type text not null check (movement_type in ('in','out','adjustment')),
  quantity numeric not null,
  lot text null,
  expires_on date null,
  reason text null,
  occurred_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists med_inventory_medication_idx on public.med_inventory_movements (medication_id);
create index if not exists med_inventory_occurred_at_idx on public.med_inventory_movements (occurred_at desc);

alter table public.med_inventory_movements enable row level security;

drop policy if exists med_inventory_select_admin_all on public.med_inventory_movements;
create policy med_inventory_select_admin_all
on public.med_inventory_movements
for select
to authenticated
using (public.app_is_admin());

drop policy if exists med_inventory_select_admin_nurse on public.med_inventory_movements;
create policy med_inventory_select_admin_nurse
on public.med_inventory_movements
for select
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists med_inventory_write_admin_nurse on public.med_inventory_movements;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists med_inventory_insert_admin_nurse on public.med_inventory_movements;
create policy med_inventory_insert_admin_nurse
on public.med_inventory_movements
for insert
to authenticated
with check (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
);

drop policy if exists med_inventory_update_admin_nurse on public.med_inventory_movements;
create policy med_inventory_update_admin_nurse
on public.med_inventory_movements
for update
to authenticated
using (
  deleted_at is null
  and public.app_has_role(array['admin','nurse'])
)
with check (public.app_has_role(array['admin','nurse']));

drop policy if exists med_inventory_update_admin_any on public.med_inventory_movements;
create policy med_inventory_update_admin_any
on public.med_inventory_movements
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists med_inventory_movements_set_timestamps on public.med_inventory_movements;
create trigger med_inventory_movements_set_timestamps
before insert or update on public.med_inventory_movements
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists med_inventory_movements_audit on public.med_inventory_movements;
create trigger med_inventory_movements_audit
after insert or update on public.med_inventory_movements
for each row execute function public.app_audit_trigger('id');

-- Staff profiles
create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text null,
  name text not null,
  team text not null check (team in ('nursing','caregiver','kitchen','other')),
  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists staff_profiles_user_idx on public.staff_profiles (user_id);
create index if not exists staff_profiles_team_idx on public.staff_profiles (team);

alter table public.staff_profiles enable row level security;

drop policy if exists staff_profiles_select_admin_all on public.staff_profiles;
create policy staff_profiles_select_admin_all
on public.staff_profiles
for select
to authenticated
using (public.app_is_admin());

drop policy if exists staff_profiles_select_self on public.staff_profiles;
create policy staff_profiles_select_self
on public.staff_profiles
for select
to authenticated
using (
  deleted_at is null
  and public.app_is_active_user()
  and user_id is not null
  and user_id = public.app_current_user_id()
);

drop policy if exists staff_profiles_write_admin on public.staff_profiles;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists staff_profiles_insert_admin on public.staff_profiles;
create policy staff_profiles_insert_admin
on public.staff_profiles
for insert
to authenticated
with check (public.app_is_admin() and deleted_at is null);

drop policy if exists staff_profiles_update_admin on public.staff_profiles;
create policy staff_profiles_update_admin
on public.staff_profiles
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists staff_profiles_set_timestamps on public.staff_profiles;
create trigger staff_profiles_set_timestamps
before insert or update on public.staff_profiles
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists staff_profiles_audit on public.staff_profiles;
create trigger staff_profiles_audit
after insert or update on public.staff_profiles
for each row execute function public.app_audit_trigger('id');

-- Shifts
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  shift text not null check (shift in ('day','night')),
  staff_id uuid not null references public.staff_profiles(id),
  amount numeric null,
  status text not null default 'pending' check (status in ('pending','confirmed','paid')),
  notes text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists shifts_date_shift_idx on public.shifts (date, shift);
create index if not exists shifts_staff_date_idx on public.shifts (staff_id, date);

alter table public.shifts enable row level security;

drop policy if exists shifts_select_admin_all on public.shifts;
create policy shifts_select_admin_all
on public.shifts
for select
to authenticated
using (public.app_is_admin());

drop policy if exists shifts_select_self on public.shifts;
create policy shifts_select_self
on public.shifts
for select
to authenticated
using (
  deleted_at is null
  and public.app_is_active_user()
  and exists (
    select 1
    from public.staff_profiles sp
    where sp.id = shifts.staff_id
      and sp.deleted_at is null
      and sp.user_id = public.app_current_user_id()
  )
);

drop policy if exists shifts_write_admin on public.shifts;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists shifts_insert_admin on public.shifts;
create policy shifts_insert_admin
on public.shifts
for insert
to authenticated
with check (public.app_is_admin() and deleted_at is null);

drop policy if exists shifts_update_admin on public.shifts;
create policy shifts_update_admin
on public.shifts
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists shifts_set_timestamps on public.shifts;
create trigger shifts_set_timestamps
before insert or update on public.shifts
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists shifts_audit on public.shifts;
create trigger shifts_audit
after insert or update on public.shifts
for each row execute function public.app_audit_trigger('id');

-- Resident billing profiles
create table if not exists public.resident_billing_profiles (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  monthly_amount numeric not null,
  due_day int not null check (due_day between 1 and 28),
  last_adjustment_at date null,
  adjustment_interval_months int not null default 12,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create unique index if not exists resident_billing_profiles_resident_uniq_active
on public.resident_billing_profiles (resident_id)
where deleted_at is null;

alter table public.resident_billing_profiles enable row level security;

drop policy if exists resident_billing_profiles_select_admin on public.resident_billing_profiles;
create policy resident_billing_profiles_select_admin
on public.resident_billing_profiles
for select
to authenticated
using (public.app_is_admin());

drop policy if exists resident_billing_profiles_write_admin on public.resident_billing_profiles;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists resident_billing_profiles_insert_admin on public.resident_billing_profiles;
create policy resident_billing_profiles_insert_admin
on public.resident_billing_profiles
for insert
to authenticated
with check (public.app_is_admin() and deleted_at is null);

drop policy if exists resident_billing_profiles_update_admin on public.resident_billing_profiles;
create policy resident_billing_profiles_update_admin
on public.resident_billing_profiles
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists resident_billing_profiles_set_timestamps on public.resident_billing_profiles;
create trigger resident_billing_profiles_set_timestamps
before insert or update on public.resident_billing_profiles
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists resident_billing_profiles_audit on public.resident_billing_profiles;
create trigger resident_billing_profiles_audit
after insert or update on public.resident_billing_profiles
for each row execute function public.app_audit_trigger('id');

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id),
  competence date null,
  amount numeric not null,
  due_date date not null,
  status text not null default 'open' check (status in ('open','paid','late','cancelled')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists invoices_resident_idx on public.invoices (resident_id);
create index if not exists invoices_due_date_idx on public.invoices (due_date);
create index if not exists invoices_status_idx on public.invoices (status);

alter table public.invoices enable row level security;

drop policy if exists invoices_admin_select on public.invoices;
create policy invoices_admin_select
on public.invoices
for select
to authenticated
using (public.app_is_admin());

drop policy if exists invoices_admin_write on public.invoices;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists invoices_insert_admin on public.invoices;
create policy invoices_insert_admin
on public.invoices
for insert
to authenticated
with check (public.app_is_admin() and deleted_at is null);

drop policy if exists invoices_update_admin on public.invoices;
create policy invoices_update_admin
on public.invoices
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists invoices_set_timestamps on public.invoices;
create trigger invoices_set_timestamps
before insert or update on public.invoices
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists invoices_audit on public.invoices;
create trigger invoices_audit
after insert or update on public.invoices
for each row execute function public.app_audit_trigger('id');

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id),
  paid_at date not null,
  amount numeric not null,
  method text null,
  reference text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  created_by text null,
  updated_by text null,
  deleted_by text null
);

create index if not exists payments_invoice_idx on public.payments (invoice_id);
create index if not exists payments_paid_at_idx on public.payments (paid_at desc);

alter table public.payments enable row level security;

drop policy if exists payments_admin_select on public.payments;
create policy payments_admin_select
on public.payments
for select
to authenticated
using (public.app_is_admin());

drop policy if exists payments_admin_write on public.payments;

-- Writes (soft delete only; no physical delete policy)
drop policy if exists payments_insert_admin on public.payments;
create policy payments_insert_admin
on public.payments
for insert
to authenticated
with check (public.app_is_admin() and deleted_at is null);

drop policy if exists payments_update_admin on public.payments;
create policy payments_update_admin
on public.payments
for update
to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

drop trigger if exists payments_set_timestamps on public.payments;
create trigger payments_set_timestamps
before insert or update on public.payments
for each row execute function public.app_set_timestamps_and_actor();

drop trigger if exists payments_audit on public.payments;
create trigger payments_audit
after insert or update on public.payments
for each row execute function public.app_audit_trigger('id');

-- Audit events timestamps trigger (keep consistent), but do not audit audit_events.
drop trigger if exists audit_events_set_timestamps on public.audit_events;
create trigger audit_events_set_timestamps
before insert or update on public.audit_events
for each row execute function public.app_set_timestamps_and_actor();

-- -----------------------------------------------------------------------------
-- Admin timeline view (for UI)
-- -----------------------------------------------------------------------------

create or replace view public.admin_timeline as
select
  ae.id,
  ae.occurred_at,
  ae.actor_user_id,
  ae.action,
  ae.table_name,
  ae.record_pk,
  ae.changes,
  ae.snapshot
from public.audit_events ae
where ae.deleted_at is null;

commit;
