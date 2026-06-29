-- Run this if you already applied 001_travel_plans.sql without user_id

alter table public.travel_plans
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists travel_plans_user_id_idx
  on public.travel_plans (user_id);

drop policy if exists "Allow public read access" on public.travel_plans;
drop policy if exists "Allow public insert access" on public.travel_plans;
drop policy if exists "Allow public delete access" on public.travel_plans;

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
