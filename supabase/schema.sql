-- Esquema para la funcionalidad "Comparte tu memoria" de la landing de Tultepec.
-- Ejecutar en el SQL Editor de tu proyecto de Supabase (https://app.supabase.com).

create extension if not exists "pgcrypto";

create table if not exists public.community_memories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  display_name text,
  relationship text not null default 'otro'
    check (relationship in ('vecino', 'familia_pirotecnica', 'visitante', 'otro')),
  memory_text text not null
    check (char_length(memory_text) between 20 and 1200),
  contact_email text,
  consent_public boolean not null default true,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'))
);

comment on table public.community_memories is
  'Memorias enviadas por visitantes de la landing de Tultepec. Requieren moderación manual (status) antes de mostrarse públicamente.';
comment on column public.community_memories.contact_email is
  'Opcional, solo para seguimiento interno. Nunca se expone en el frontend.';

alter table public.community_memories enable row level security;

-- Cualquier visitante (rol anon de Supabase) puede enviar una memoria,
-- pero siempre queda en estado "pending": no puede auto-aprobarse.
drop policy if exists "public can submit memories" on public.community_memories;
create policy "public can submit memories"
  on public.community_memories
  for insert
  to anon
  with check (status = 'pending');

-- El público solo puede leer memorias ya aprobadas y con consentimiento explícito,
-- pensado para una futura sección "memorias de la comunidad" en la landing.
drop policy if exists "public can read approved memories" on public.community_memories;
create policy "public can read approved memories"
  on public.community_memories
  for select
  to anon
  using (status = 'approved' and consent_public = true);

-- No se exponen policies de update/delete para el rol anon:
-- la moderación (aprobar/rechazar) se hace desde el dashboard de Supabase
-- o con la service role key, nunca desde el navegador.
