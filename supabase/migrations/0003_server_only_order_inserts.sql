-- Orders are created by the checkout API using the service role.
begin;
drop policy if exists "orders: public insert" on public.orders;
drop policy if exists "order_items: public insert" on public.order_items;
commit;
