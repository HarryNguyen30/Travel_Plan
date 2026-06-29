-- ============================================================
-- Travel Plan — Chạy TOÀN BỘ file này trên Supabase SQL Editor
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

create table if not exists public.travel_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
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

create index if not exists travel_plans_user_id_idx
  on public.travel_plans (user_id);

alter table public.travel_plans enable row level security;

drop policy if exists "Allow public read access" on public.travel_plans;
drop policy if exists "Allow public insert access" on public.travel_plans;
drop policy if exists "Allow public delete access" on public.travel_plans;
drop policy if exists "Users can view own plans" on public.travel_plans;
drop policy if exists "Users can insert own plans" on public.travel_plans;
drop policy if exists "Users can delete own plans" on public.travel_plans;

create policy "Users can view own plans"
  on public.travel_plans
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.travel_plans
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.travel_plans
  for delete
  using (auth.uid() = user_id);
