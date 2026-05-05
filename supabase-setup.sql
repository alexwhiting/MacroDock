create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  account jsonb,
  theme text,
  recent_foods jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists theme text;

alter table public.profiles
  add column if not exists recent_foods jsonb not null default '[]'::jsonb;

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;

create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own profile" on public.profiles;

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profile_updated_at();

create table if not exists public.diary_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  diary_date date not null,
  foods jsonb not null default '[]'::jsonb,
  workouts jsonb not null default '[]'::jsonb,
  water integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, diary_date)
);

alter table public.diary_days enable row level security;

drop policy if exists "Users can read their own diary days" on public.diary_days;

create policy "Users can read their own diary days"
  on public.diary_days
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own diary days" on public.diary_days;

create policy "Users can insert their own diary days"
  on public.diary_days
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own diary days" on public.diary_days;

create policy "Users can update their own diary days"
  on public.diary_days
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_diary_day_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists diary_days_set_updated_at on public.diary_days;

create trigger diary_days_set_updated_at
  before update on public.diary_days
  for each row
  execute function public.set_diary_day_updated_at();
