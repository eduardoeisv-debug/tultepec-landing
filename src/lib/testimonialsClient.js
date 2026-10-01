import { isSupabaseConfigured } from "./supabaseConfig.js";
import { RELATIONSHIP_DISPLAY_LABELS } from "../data/relationships.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const REST_URL = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : null;

const authHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

async function fetchCuratedTestimonials() {
  const params = new URLSearchParams({
    select: "id,quote,name,role,display_order,created_at",
    published: "eq.true",
    order: "display_order.asc",
  });

  const res = await fetch(`${REST_URL}/curated_testimonials?${params}`, { headers: authHeaders });
  if (!res.ok) return [];
  const rows = await res.json();
  return rows.map((r) => ({
    id: `curated-${r.id}`,
    quote: r.quote,
    name: r.name,
    role: r.role,
    createdAt: r.created_at,
    order: r.display_order,
  }));
}

async function fetchApprovedMemories() {
  const params = new URLSearchParams({
    select: "id,created_at,display_name,relationship,memory_text",
    status: "eq.approved",
    consent_public: "eq.true",
    order: "created_at.desc",
  });

  const res = await fetch(`${REST_URL}/community_memories?${params}`, { headers: authHeaders });
  if (!res.ok) return [];
  const rows = await res.json();
  return rows.map((r) => ({
    id: `memory-${r.id}`,
    quote: r.memory_text,
    name: r.display_name || "Anónimo",
    role: RELATIONSHIP_DISPLAY_LABELS[r.relationship] || RELATIONSHIP_DISPLAY_LABELS.otro,
    createdAt: r.created_at,
    order: null,
  }));
}

// Une los testimonios curados (editados desde /moderar) con las memorias que
// la propia comunidad envió y ya fueron aprobadas -- todo en un solo listado
// para "Voces del pueblo". Los curados van primero, en el orden definido
// desde el panel; las memorias de la comunidad los siguen, de más reciente a
// más antigua. Si una de las dos fuentes falla, igual se muestra la otra.
export async function fetchVoices() {
  if (!isSupabaseConfigured) return { data: [], error: null };

  try {
    const [curated, memories] = await Promise.all([
      fetchCuratedTestimonials().catch(() => []),
      fetchApprovedMemories().catch(() => []),
    ]);
    return { data: [...curated, ...memories], error: null };
  } catch (error) {
    return { data: null, error };
  }
}
