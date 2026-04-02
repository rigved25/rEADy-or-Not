-- Table for "Did we find the EAD mail?" checks
create table if not exists public.mail_checks (
  checked_at timestamptz not null default now(),
  found boolean not null,
  checked_by text not null default 'Lakshita'
);

alter table public.mail_checks enable row level security;

-- Allow public clients to read latest rows for dashboard display
create policy "Allow public read mail checks"
on public.mail_checks
for select
to anon
using (true);

-- Allow public clients to insert rows (MVP, simple setup)
create policy "Allow public insert mail checks"
on public.mail_checks
for insert
to anon
with check (checked_by = 'Lakshita');
