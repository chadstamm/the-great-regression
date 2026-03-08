-- Run this in Supabase SQL Editor to set up the database
-- =====================================================

-- 1. USERS TABLE
-- Stores user profiles (name + icon). No email/password needed.
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text not null default 'caravel',
  created_at timestamptz default now()
);

alter table users enable row level security;

create policy "Allow all for anon" on users
  for all
  using (true)
  with check (true);

-- 2. BUCKET ITEMS TABLE
create table if not exists bucket_items (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('sites', 'restaurants', 'events', 'experiences')),
  title text not null,
  note text,
  added_by text not null,
  icon text not null default 'caravel',
  votes text[] default '{}',
  is_done boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table bucket_items enable row level security;

create policy "Allow all for anon" on bucket_items
  for all
  using (true)
  with check (true);

-- 3. QUIOSQUE LOGS TABLE
create table if not exists quiosque_logs (
  id uuid default gen_random_uuid() primary key,
  duration integer not null,
  date timestamptz not null,
  note text,
  people text[] default '{}',
  created_at timestamptz default now()
);

alter table quiosque_logs enable row level security;

create policy "Allow all for anon" on quiosque_logs
  for all
  using (true)
  with check (true);

-- 4. ENABLE REAL-TIME
alter publication supabase_realtime add table bucket_items;
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table quiosque_logs;
