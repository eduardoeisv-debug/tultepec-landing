import { isSupabaseConfigured } from "./supabaseConfig.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const REST_URL = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : null;

const authHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Trae los eventos publicados y los agrupa por mes (1-12), cada uno ya
// ordenado por día (los que no tienen día específico van al final) y luego
// por `display_order`. Siempre devuelve los 12 meses, aunque alguno no
// tenga eventos todavía.
export async function fetchFestivalCalendar() {
  if (!isSupabaseConfigured) return { months: emptyMonths(), error: null };

  try {
    const params = new URLSearchParams({
      select: "id,month,day,title,description,is_highlight,is_example",
      published: "eq.true",
      order: "month.asc,day.asc.nullsfirst,display_order.asc",
    });
    const res = await fetch(`${REST_URL}/festival_events?${params}`, { headers: authHeaders });
    if (!res.ok) return { months: emptyMonths(), error: null };

    const rows = await res.json();
    const months = emptyMonths();
    for (const row of rows) {
      const bucket = months[row.month - 1];
      if (bucket) bucket.events.push(row);
    }
    return { months, error: null };
  } catch (error) {
    return { months: emptyMonths(), error };
  }
}

function emptyMonths() {
  return MONTH_NAMES.map((name, i) => ({ month: i + 1, name, events: [] }));
}
