-- Run this in Supabase SQL Editor to set up the bucket_items table

-- Create the table
create table if not exists bucket_items (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('sites', 'restaurants', 'events', 'experiences')),
  title text not null,
  note text,
  added_by text not null check (added_by in ('Chad', 'Steve')),
  votes text[] default '{}',
  is_done boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table bucket_items enable row level security;

-- Allow all operations for anon key (private app, 4 trusted users)
create policy "Allow all for anon" on bucket_items
  for all
  using (true)
  with check (true);

-- Enable real-time replication
alter publication supabase_realtime add table bucket_items;
