-- Esquema para el botón de "like" de la landing de Tultepec.
-- Ejecutar en el SQL Editor de tu proyecto de Supabase, además del
-- schema.sql original (esta es una tabla nueva, independiente).

create table if not exists public.page_likes (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.page_likes is
  'Un "like" anónimo por visitante (identificado por un id aleatorio guardado en su navegador). No hay datos personales.';

alter table public.page_likes enable row level security;

-- Cualquier visitante puede dar like (insertar su propia fila).
drop policy if exists "public can like" on public.page_likes;
create policy "public can like"
  on public.page_likes
  for insert
  to anon
  with check (true);

-- Cualquier visitante puede quitar su like (solo podría borrar otra fila si
-- adivinara su visitor_id, que es un identificador aleatorio no expuesto).
drop policy if exists "public can unlike" on public.page_likes;
create policy "public can unlike"
  on public.page_likes
  for delete
  to anon
  using (true);

-- Necesario para poder consultar el conteo total y si un visitor_id ya dio like.
drop policy if exists "public can read likes" on public.page_likes;
create policy "public can read likes"
  on public.page_likes
  for select
  to anon
  using (true);
