-- BTL LIVING — schema
-- Run in Supabase → SQL Editor (or `supabase db push` with the CLI).

-- ─────────────────────────────  CATALOG  ─────────────────────────────

create table if not exists public.categories (
  key         text primary key,
  label       text not null,
  blurb       text not null default '',
  sort_order  int  not null default 0
);

create table if not exists public.products (
  slug         text primary key,
  name         text not null,
  category_key text not null references public.categories(key) on delete restrict,
  price        integer not null,                 -- MAD, integer
  price_from   boolean not null default false,   -- "à partir de"
  tagline      text not null default '',
  description  text not null default '',
  matiere      text not null default '',
  finition     text not null default '',
  dimensions   text not null default '',
  delai        text not null default '',
  badge        text,
  image_url    text,                             -- defaults to /products/<slug>.webp in app
  in_stock     boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_key);

-- ─────────────────────────────  ORDERS  ─────────────────────────────

create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  ref         text not null unique default ('BTL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  nom         text not null,
  telephone   text not null,
  ville       text not null,
  adresse     text not null default '',
  note        text not null default '',
  subtotal    integer not null default 0,        -- MAD
  is_estimate boolean not null default false,    -- any "à partir de" line
  status      text not null default 'nouvelle',  -- nouvelle | confirmée | livrée | annulée
  source      text not null default 'site',
  created_at  timestamptz not null default now()
);

create table if not exists public.order_items (
  id         bigint generated always as identity primary key,
  order_id   uuid not null references public.orders(id) on delete cascade,
  slug       text not null,
  name       text not null,
  unit_price integer not null,
  qty        integer not null check (qty > 0),
  price_from boolean not null default false
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ─────────────────────────  TESTIMONIALS / LEADS  ─────────────────────

create table if not exists public.testimonials (
  id         bigint generated always as identity primary key,
  quote      text not null,
  prenom     text not null,
  ville      text not null default '',
  rating     int  not null default 5 check (rating between 1 and 5),
  published  boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ───────────────────────────────  RLS  ──────────────────────────────
-- Public (anon) may READ the catalog + published testimonials, and INSERT
-- orders / order_items / newsletter. Nothing else. Writes from the app's
-- order API use the service_role key, which bypasses RLS.

alter table public.categories             enable row level security;
alter table public.products               enable row level security;
alter table public.orders                 enable row level security;
alter table public.order_items            enable row level security;
alter table public.testimonials           enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "catalog read: categories" on public.categories
  for select using (true);

create policy "catalog read: products" on public.products
  for select using (true);

create policy "testimonials read: published only" on public.testimonials
  for select using (published = true);

create policy "orders: public insert" on public.orders
  for insert with check (true);

create policy "order_items: public insert" on public.order_items
  for insert with check (true);

create policy "newsletter: public insert" on public.newsletter_subscribers
  for insert with check (true);