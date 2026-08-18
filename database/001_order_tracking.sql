create extension if not exists pgcrypto;

create table if not exists public.bx_orders (
  id uuid primary key default gen_random_uuid(),
  paypal_order_id text not null unique,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'processing', 'delivered', 'cancelled', 'refunded')),
  pack text not null,
  platform text not null,
  service_type text not null,
  handle text,
  normalized_handle text,
  post_link text,
  customer_email text not null,
  amount numeric(10,2) not null,
  currency text not null default 'EUR',
  followers_ordered integer not null default 0,
  likes_ordered integer not null default 0,
  followers_baseline integer,
  followers_guaranteed_floor integer,
  paid_at timestamptz,
  delivered_at timestamptz,
  warranty_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bx_order_snapshots (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.bx_orders(id) on delete cascade,
  stage text not null check (stage in ('order', 'pre_delivery', 'post_delivery', 'claim', 'refill')),
  metric text not null check (metric in ('followers', 'likes', 'views')),
  count_value integer not null check (count_value >= 0),
  source text not null check (source in ('admin_controlled', 'meta_api')),
  note text,
  recorded_at timestamptz not null default now()
);

create index if not exists bx_orders_status_created_idx on public.bx_orders(status, created_at desc);
create index if not exists bx_snapshots_order_idx on public.bx_order_snapshots(order_id, recorded_at);

alter table public.bx_orders enable row level security;
alter table public.bx_order_snapshots enable row level security;

grant select, insert, update, delete on table public.bx_orders to service_role;
grant select, insert, update, delete on table public.bx_order_snapshots to service_role;
grant usage, select on sequence public.bx_order_snapshots_id_seq to service_role;

comment on table public.bx_orders is 'Booster X server-side order and warranty tracking';
comment on table public.bx_order_snapshots is 'Immutable, timestamped audience snapshots recorded by Booster X';
