-- Esquema para los comentarios del sitio (botón junto al "me gusta").
-- Mismo patrón que community_memories: cualquiera puede enviar uno, pero
-- siempre queda "pending" hasta que se revisa desde /moderar.
-- Ejecutar en el SQL Editor de tu proyecto de Supabase.

create table if not exists public.page_comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  display_name text,
  comment_text text not null check (char_length(comment_text) between 2 and 500),
  contact_email text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'))
);

comment on table public.page_comments is
  'Comentarios enviados desde el botón junto al "me gusta". Requieren moderación manual (status) antes de mostrarse públicamente.';
comment on column public.page_comments.contact_email is
  'Opcional, solo para seguimiento interno. Nunca se expone en el frontend.';

alter table public.page_comments enable row level security;

-- Cualquier visitante (rol anon) puede enviar un comentario, pero siempre
-- queda en estado "pending": no puede auto-aprobarse.
drop policy if exists "public can submit comments" on public.page_comments;
create policy "public can submit comments"
  on public.page_comments
  for insert
  to anon
  with check (status = 'pending');

-- El público solo puede leer comentarios ya aprobados.
drop policy if exists "public can read approved comments" on public.page_comments;
create policy "public can read approved comments"
  on public.page_comments
  for select
  to anon
  using (status = 'approved');

-- No hay policies de update/delete para "anon": la moderación (aprobar /
-- rechazar) se hace solo con la service_role key, desde el panel /moderar.
