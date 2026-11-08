-- ══════════════════════════════════════════════════════════════════
--  BTL LIVING — admin layer
--  Run in Supabase → SQL Editor. Safe to re-run.
-- ══════════════════════════════════════════════════════════════════

-- ── who is an admin ──────────────────────────────────────────────
create table if not exists public.admins (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  email      text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

alter table public.admins enable row level security;
drop policy if exists "admins read self+peers" on public.admins;
create policy "admins read self+peers" on public.admins
  for select using (public.is_admin());

-- ── product columns the admin edits ─────────────────────────────
alter table public.products
  add column if not exists stock integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ── admin write policies (public still read-only via 0001) ──────
--    catalogue
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

--    orders: admins read + update status; inserts stay public (checkout)
drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders
  for select using (public.is_admin());
drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin read order_items" on public.order_items;
create policy "admin read order_items" on public.order_items
  for select using (public.is_admin());

--    testimonials: full admin control (public reads published only, 0001)
drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

--    newsletter: admins may read the list
drop policy if exists "admin read newsletter" on public.newsletter_subscribers;
create policy "admin read newsletter" on public.newsletter_subscribers
  for select using (public.is_admin());

-- ── storage: admins may upload/replace product images in "media" ─
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());