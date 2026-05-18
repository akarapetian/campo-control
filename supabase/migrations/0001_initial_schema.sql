create extension if not exists pgcrypto;

create type public.app_role as enum (
  'owner_admin',
  'office_user',
  'field_user',
  'read_only_accountant'
);

create type public.cash_flow_direction as enum ('in', 'out');
create type public.cash_flow_status as enum ('scheduled', 'due', 'overdue', 'settled', 'cancelled');
create type public.import_status as enum ('draft', 'validated', 'committed', 'failed');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role public.app_role not null default 'field_user',
  notification_email text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.counterparties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'other',
  contact_details text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.cattle (
  id uuid primary key default gen_random_uuid(),
  tag text not null unique,
  label text,
  status text not null default 'active',
  sex text,
  breed text,
  birth_date date,
  acquisition_date date,
  origin text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.weight_records (
  id uuid primary key default gen_random_uuid(),
  cattle_id uuid not null references public.cattle (id) on delete cascade,
  recorded_at date not null,
  weight numeric(10, 2) not null check (weight > 0),
  unit text not null default 'kg',
  notes text,
  recorded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.health_records (
  id uuid primary key default gen_random_uuid(),
  cattle_id uuid not null references public.cattle (id) on delete cascade,
  event_date date not null,
  type text not null,
  symptoms text,
  treatment text,
  medication text,
  veterinarian text,
  follow_up_date date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.cattle_sales (
  id uuid primary key default gen_random_uuid(),
  cattle_id uuid references public.cattle (id) on delete set null,
  lot_description text,
  animal_count integer check (animal_count is null or animal_count > 0),
  buyer_id uuid references public.counterparties (id),
  sale_date date not null,
  gross_amount_ars numeric(14, 2) not null check (gross_amount_ars >= 0),
  gross_amount_usd numeric(14, 2),
  notes text,
  created_at timestamptz not null default now(),
  check (cattle_id is not null or lot_description is not null)
);

create table public.crop_fields (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location_notes text,
  area numeric(12, 2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.crop_cycles (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references public.crop_fields (id) on delete cascade,
  crop_type text not null,
  season text,
  start_date date,
  end_date date,
  status text not null default 'planned',
  notes text,
  created_at timestamptz not null default now()
);

create table public.crop_events (
  id uuid primary key default gen_random_uuid(),
  crop_cycle_id uuid not null references public.crop_cycles (id) on delete cascade,
  field_id uuid not null references public.crop_fields (id) on delete cascade,
  event_date date not null,
  event_type text not null,
  quantity numeric(14, 2),
  unit text,
  cost_category text,
  is_output boolean not null default false,
  notes text,
  recorded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  counterparty_id uuid references public.counterparties (id),
  type text not null,
  start_date date,
  end_date date,
  summary text,
  status text not null default 'active',
  attachment_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  counterparty_id uuid references public.counterparties (id),
  crop_field_id uuid references public.crop_fields (id),
  crop_cycle_id uuid references public.crop_cycles (id),
  cattle_id uuid references public.cattle (id),
  service_date date not null,
  description text not null,
  cost_ars numeric(14, 2),
  contract_id uuid references public.contracts (id),
  notes text,
  created_at timestamptz not null default now()
);

create table public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  direction public.cash_flow_direction not null,
  category text not null,
  counterparty_id uuid references public.counterparties (id),
  crop_field_id uuid references public.crop_fields (id),
  crop_cycle_id uuid references public.crop_cycles (id),
  service_id uuid references public.services (id),
  amount_ars numeric(14, 2) not null check (amount_ars >= 0),
  amount_usd numeric(14, 2),
  transaction_date date not null,
  description text,
  attachment_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  contact_details text,
  job_role text,
  start_date date,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create table public.work_entries (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  work_date date not null,
  description text not null,
  hours numeric(8, 2),
  days numeric(8, 2),
  quantity numeric(12, 2),
  notes text,
  created_at timestamptz not null default now()
);

create table public.employee_payments (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  payment_date date not null,
  amount_ars numeric(14, 2) not null check (amount_ars >= 0),
  type text not null,
  period_start date,
  period_end date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.cash_flow_items (
  id uuid primary key default gen_random_uuid(),
  direction public.cash_flow_direction not null,
  counterparty_id uuid references public.counterparties (id),
  cattle_sale_id uuid references public.cattle_sales (id) on delete set null,
  contract_id uuid references public.contracts (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  financial_transaction_id uuid references public.financial_transactions (id) on delete set null,
  employee_payment_id uuid references public.employee_payments (id) on delete set null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'ARS',
  issue_date date not null,
  expected_cash_date date not null,
  payment_terms text not null default 'upfront',
  payment_method text,
  status public.cash_flow_status not null default 'scheduled',
  assigned_user_id uuid references public.profiles (id),
  settled_date date,
  created_at timestamptz not null default now()
);

create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  source_file_name text not null,
  record_type text not null,
  status public.import_status not null default 'draft',
  created_by uuid references public.profiles (id),
  row_count integer not null default 0,
  error_count integer not null default 0,
  committed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.import_errors (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches (id) on delete cascade,
  row_number integer not null,
  field text,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  cash_flow_item_id uuid not null references public.cash_flow_items (id) on delete cascade,
  reminder_date date not null,
  channel text not null default 'email',
  status text not null default 'pending',
  recipient text,
  created_at timestamptz not null default now()
);

create function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.is_admin_or_office()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in ('owner_admin', 'office_user')
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'owner_admin'
$$;

alter table public.profiles enable row level security;
alter table public.counterparties enable row level security;
alter table public.cattle enable row level security;
alter table public.weight_records enable row level security;
alter table public.health_records enable row level security;
alter table public.cattle_sales enable row level security;
alter table public.crop_fields enable row level security;
alter table public.crop_cycles enable row level security;
alter table public.crop_events enable row level security;
alter table public.contracts enable row level security;
alter table public.services enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.cash_flow_items enable row level security;
alter table public.employees enable row level security;
alter table public.work_entries enable row level security;
alter table public.employee_payments enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_errors enable row level security;
alter table public.reminders enable row level security;

-- owner/admin can manage profiles and settings.
create policy "admins manage profiles"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

-- users can read their own profile.
create policy "users read own profile"
on public.profiles
for select
using (id = auth.uid());

-- field users can read cattle operations.
create policy "field users can read cattle operations"
on public.cattle
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user', 'read_only_accountant'));

create policy "cattle writable by office admin"
on public.cattle
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "cattle weights readable by allowed roles"
on public.weight_records
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user', 'read_only_accountant'));

create policy "field users can add cattle weights"
on public.weight_records
for all
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user', 'field_user'));

create policy "cattle health readable by allowed roles"
on public.health_records
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user', 'read_only_accountant'));

create policy "field users can add cattle health"
on public.health_records
for all
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user', 'field_user'));

create policy "cattle sales readable by office admin accountant"
on public.cattle_sales
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "cattle sales writable by office admin"
on public.cattle_sales
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "crop fields readable by allowed roles"
on public.crop_fields
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user', 'read_only_accountant'));

create policy "crop fields writable by office admin"
on public.crop_fields
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "crop cycles readable by allowed roles"
on public.crop_cycles
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user', 'read_only_accountant'));

create policy "crop cycles writable by office admin"
on public.crop_cycles
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "crop events readable by allowed roles"
on public.crop_events
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user', 'read_only_accountant'));

create policy "crop events writable by office admin field"
on public.crop_events
for all
using (public.current_app_role() in ('owner_admin', 'office_user', 'field_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user', 'field_user'));

create policy "counterparties readable by office admin accountant"
on public.counterparties
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "counterparties writable by office admin"
on public.counterparties
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "contracts readable by office admin accountant"
on public.contracts
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "contracts writable by office admin"
on public.contracts
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "services readable by office admin accountant"
on public.services
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "services writable by office admin"
on public.services
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

-- field users cannot access finance.
create policy "finance readable by office admin accountant"
on public.financial_transactions
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "finance writable by office admin"
on public.financial_transactions
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "cash flow readable by office admin accountant"
on public.cash_flow_items
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "cash flow writable by office admin"
on public.cash_flow_items
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

-- read only accountants can read reports.
create policy "read only accountants can read reports"
on public.employee_payments
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

-- read only accountants cannot mutate operations.
create policy "employee payments writable by office admin"
on public.employee_payments
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "employees readable by office admin accountant"
on public.employees
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "employees writable by office admin"
on public.employees
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "work entries readable by office admin accountant"
on public.work_entries
for select
using (public.current_app_role() in ('owner_admin', 'office_user', 'read_only_accountant'));

create policy "work entries writable by office admin"
on public.work_entries
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "imports writable by office admin"
on public.import_batches
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "import errors readable by office admin"
on public.import_errors
for select
using (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "import errors writable by office admin"
on public.import_errors
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));

create policy "reminders writable by office admin"
on public.reminders
for all
using (public.current_app_role() in ('owner_admin', 'office_user'))
with check (public.current_app_role() in ('owner_admin', 'office_user'));
