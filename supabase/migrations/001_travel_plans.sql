-- Run this in Supabase SQL Editor (Dashboard > SQL)

create table if not exists public.travel_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint travel_plans_date_range check (end_date >= start_date)
);

create index if not exists travel_plans_created_at_idx
  on public.travel_plans (created_at desc);

alter table public.travel_plans enable row level security;

create policy "Allow public read access"
  on public.travel_plans
  for select
  using (true);

create policy "Allow public insert access"
  on public.travel_plans
  for insert
  with check (true);

create policy "Allow public delete access"
  on public.travel_plans
  for delete
  using (true);
