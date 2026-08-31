-- =========================================================================
-- my-finance schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- AFTER you have created your login user (Authentication > Users > Add user).
-- =========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type account_type as enum ('bank', 'investment', 'voucher', 'credit', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_kind as enum ('expense', 'income');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  kind transaction_kind not null,
  name text not null,
  color text not null,
  sort_order int not null default 0,
  unique (kind, name)
);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type account_type not null,
  is_liability boolean not null default false,
  current_balance numeric(14,2) not null default 0,
  balance_updated_at timestamptz not null default now(),
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists account_balance_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  balance numeric(14,2) not null,
  recorded_at timestamptz not null default now()
);

create table if not exists holidays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  constraint holiday_range_valid check (end_date >= start_date)
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete restrict,
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  amount numeric(14,2) not null check (amount > 0),
  occurred_on date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on transactions (user_id, occurred_on desc);
create index if not exists transactions_account_idx on transactions (account_id);
create index if not exists account_balance_history_account_idx on account_balance_history (account_id, recorded_at);
create index if not exists accounts_user_idx on accounts (user_id, display_order);
create index if not exists holidays_user_idx on holidays (user_id, start_date);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table accounts enable row level security;
alter table account_balance_history enable row level security;
alter table holidays enable row level security;
alter table transactions enable row level security;
alter table categories enable row level security;

create policy "categories are readable by any authenticated user"
  on categories for select
  to authenticated
  using (true);

create policy "own accounts only"
  on accounts for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own balance history only"
  on account_balance_history for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own holidays only"
  on holidays for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own transactions only"
  on transactions for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Seed reference data: categories (shared, no user_id)
-- ---------------------------------------------------------------------------

insert into categories (kind, name, color, sort_order) values
  ('expense', 'Fuel', '#f59e0b', 1),
  ('expense', 'Groceries', '#22c55e', 2),
  ('expense', 'Sport', '#06b6d4', 3),
  ('expense', 'Transports', '#3b82f6', 4),
  ('expense', 'Rent', '#ef4444', 5),
  ('expense', 'Entertainment', '#a855f7', 6),
  ('expense', 'Online shopping', '#ec4899', 7),
  ('expense', 'Restaurant', '#f97316', 8),
  ('expense', 'Wellness', '#14b8a6', 9),
  ('expense', 'ETF', '#6366f1', 10),
  ('expense', 'Stocks', '#8b5cf6', 11),
  ('expense', 'Crypto', '#eab308', 12),
  ('income', 'Salary', '#10b981', 1),
  ('income', 'Interests', '#84cc16', 2)
on conflict (kind, name) do nothing;

-- ---------------------------------------------------------------------------
-- Seed your personal accounts.
-- This grabs the first (only) user in auth.users, so run it once you have
-- created your login. current_balance starts at 0 - set real balances from
-- the Accounts page after logging in.
-- ---------------------------------------------------------------------------

do $$
declare
  the_user_id uuid;
begin
  select id into the_user_id from auth.users order by created_at limit 1;

  if the_user_id is null then
    raise notice 'No user found in auth.users yet - create your login user first, then re-run this block.';
  else
    insert into accounts (user_id, name, type, is_liability, current_balance, display_order)
    values
      (the_user_id, 'Trade Republic', 'bank', false, 0, 1),
      (the_user_id, 'Banca di Imola', 'bank', false, 0, 2),
      (the_user_id, 'Trade Republic Investment Account', 'investment', false, 0, 3),
      (the_user_id, 'PayPal', 'bank', false, 0, 4),
      (the_user_id, 'Revolut', 'bank', false, 0, 5),
      (the_user_id, 'Satispay', 'bank', false, 0, 6),
      (the_user_id, 'Buoni Pasto', 'voucher', false, 0, 7),
      (the_user_id, 'Buoni Cad-hoc', 'voucher', false, 0, 8),
      (the_user_id, 'Bwin', 'other', false, 0, 9),
      (the_user_id, 'Credit (with someone else)', 'credit', true, 0, 10)
    on conflict do nothing;

    insert into account_balance_history (user_id, account_id, balance)
    select user_id, id, current_balance from accounts where user_id = the_user_id
    on conflict do nothing;
  end if;
end $$;
