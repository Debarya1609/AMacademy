create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

drop policy if exists "inquiries_read_authenticated" on public.inquiries;
create policy "inquiries_read_authenticated"
on public.inquiries
for select
to authenticated
using (true);

drop policy if exists "inquiries_insert_anon" on public.inquiries;
create policy "inquiries_insert_anon"
on public.inquiries
for insert
to anon, authenticated
with check (true);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null default 'Student / Parent',
  email text not null,
  phone text,
  message text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews_read_public" on public.reviews;
create policy "reviews_read_public"
on public.reviews
for select
to anon, authenticated
using (true);

drop policy if exists "reviews_insert_public" on public.reviews;
create policy "reviews_insert_public"
on public.reviews
for insert
to anon, authenticated
with check (true);

update public.reviews
set role = 'Student'
where role = 'Student / Parent';

alter table public.reviews
alter column role set default 'Student';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reviews_role_allowed'
  ) then
    alter table public.reviews
    add constraint reviews_role_allowed check (role in ('Student', 'Parent'));
  end if;
end $$;

