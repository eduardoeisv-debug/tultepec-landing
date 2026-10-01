-- Esquema para "Voces del pueblo" (testimonios curados), gestionados desde
-- el panel de moderación (/moderar), no por envío público.
-- Ejecutar en el SQL Editor de tu proyecto de Supabase.

create table if not exists public.curated_testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  quote text not null check (char_length(quote) between 10 and 600),
  name text not null,
  role text not null,
  display_order int not null default 0,
  published boolean not null default true
);

comment on table public.curated_testimonials is
  'Testimonios curados que se muestran en "Voces del pueblo". Se administran desde /moderar, no desde un formulario público.';

alter table public.curated_testimonials enable row level security;

-- El público solo puede leer los que estén marcados como publicados.
drop policy if exists "public can read published testimonials" on public.curated_testimonials;
create policy "public can read published testimonials"
  on public.curated_testimonials
  for select
  to anon
  using (published = true);

-- No hay policies de insert/update/delete para "anon": esas operaciones
-- solo las hacen las funciones serverless del panel de moderación, usando
-- la service_role key (que salta RLS).

-- Datos iniciales: los 3 testimonios de ejemplo que ya existían en el
-- código, para que la sección no quede vacía en cuanto se despliegue esto.
-- Puedes editarlos o borrarlos desde /moderar cuando quieras.
insert into public.curated_testimonials (quote, name, role, display_order, published)
values
  (
    'Aprendí a armar mi primer torito con mi abuelo antes de aprender a leer. Aquí el oficio no se estudia, se hereda.',
    'Nombre de ejemplo',
    'Maestro pirotécnico de tercera generación (testimonio ilustrativo)',
    1,
    true
  ),
  (
    'Cada castillo que se enciende en la feria lleva el nombre de una familia detrás, aunque nadie lo vea desde la calle.',
    'Nombre de ejemplo',
    'Artesana de taller familiar (testimonio ilustrativo)',
    2,
    true
  ),
  (
    'No le tememos al fuego, lo respetamos. Ese respeto es lo primero que se enseña en cualquier taller de Tultepec.',
    'Nombre de ejemplo',
    'Vocero de agremiación pirotécnica local (testimonio ilustrativo)',
    3,
    true
  )
on conflict do nothing;
