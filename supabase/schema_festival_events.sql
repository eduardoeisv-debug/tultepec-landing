-- Esquema para el "Calendario de fiestas", gestionado desde el panel de
-- moderación (/moderar), no por envío público.
-- Ejecutar en el SQL Editor de tu proyecto de Supabase.

create table if not exists public.festival_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  month int not null check (month between 1 and 12),
  day int check (day between 1 and 31),
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 400),
  is_highlight boolean not null default false,
  is_example boolean not null default true,
  display_order int not null default 0,
  published boolean not null default true
);

comment on table public.festival_events is
  'Eventos del calendario anual de fiestas de Tultepec. Se administran desde /moderar. `is_example` marca contenido de ejemplo/placeholder (se muestra con una etiqueta "Ejemplo" en la landing) hasta que se confirme con información real.';

alter table public.festival_events enable row level security;

-- El público solo puede leer los que estén marcados como publicados.
drop policy if exists "public can read published festival events" on public.festival_events;
create policy "public can read published festival events"
  on public.festival_events
  for select
  to anon
  using (published = true);

-- No hay policies de insert/update/delete para "anon": esas operaciones
-- solo las hacen las funciones serverless del panel de moderación, usando
-- la service_role key (que salta RLS).

-- Datos iniciales: la misma versión de ejemplo que ya existía en el código,
-- para que la sección no quede vacía en cuanto se despliegue esto. Marzo es
-- el único evento confirmado (Feria Nacional de la Pirotecnia / San Juan de
-- Dios); el resto son marcadores de posición, editables desde /moderar.
insert into public.festival_events (month, day, title, description, is_highlight, is_example, display_order, published)
values
  (1, 6, 'Año Nuevo y Día de Reyes', 'Recibimiento del año con cohetes y la tradicional rosca en las plazas del pueblo.', false, true, 1, true),
  (2, 2, 'Día de la Candelaria', 'Bendición de semillas y tamales en las capillas de las colonias.', false, true, 1, true),
  (3, 8, 'Feria Nacional de la Pirotecnia', 'El evento más importante del año: castillos monumentales, toritos y la fiesta patronal de San Juan de Dios.', true, false, 1, true),
  (4, null, 'Semana Santa', 'Procesiones y representaciones religiosas por las calles del centro.', false, true, 1, true),
  (5, null, 'Fiestas de mayo', 'Kermeses y encuentros comunitarios organizados por los barrios del pueblo.', false, true, 1, true),
  (6, null, 'Corpus Christi', 'Danzas y procesiones en honor al Santísimo por las principales calles.', false, true, 1, true),
  (7, null, 'Feria de verano', 'Actividades culturales y artesanales para toda la familia.', false, true, 1, true),
  (8, null, 'Fiestas patronales de barrio', 'Celebraciones locales con música, comida y cohetes en distintas colonias.', false, true, 1, true),
  (9, 16, 'Fiestas Patrias', 'Grito de Independencia y desfile cívico en el centro del pueblo.', false, true, 1, true),
  (10, null, 'Preparativos de Día de Muertos', 'Los talleres comienzan a decorar con motivos de cempasúchil y papel picado.', false, true, 1, true),
  (11, 2, 'Día de Muertos', 'Ofrendas, flor de cempasúchil y procesiones en honor a los difuntos.', false, true, 1, true),
  (12, null, 'Posadas y Navidad', 'Posadas, pastorelas y el cierre de año con un último castillo encendido.', false, true, 1, true)
on conflict do nothing;
