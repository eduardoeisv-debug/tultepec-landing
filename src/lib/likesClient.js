import { isSupabaseConfigured } from "./supabaseConfig.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const REST_URL = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : null;

const authHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

export { isSupabaseConfigured };

// Devuelve { count, liked } en una sola consulta: el total de likes y si
// `visitorId` ya está entre ellos.
export async function fetchLikeStatus(visitorId) {
  if (!isSupabaseConfigured) return { count: 0, liked: false, error: null };

  try {
    const res = await fetch(`${REST_URL}/page_likes?select=visitor_id`, {
      headers: { ...authHeaders, Prefer: "count=exact" },
    });
    if (!res.ok) return { count: 0, liked: false, error: new Error(`HTTP ${res.status}`) };

    const rows = await res.json();
    const range = res.headers.get("content-range"); // "0-9/23"
    const count = range ? Number(range.split("/")[1]) : rows.length;
    const liked = rows.some((r) => r.visitor_id === visitorId);

    return { count, liked, error: null };
  } catch (error) {
    return { count: 0, liked: false, error };
  }
}

export async function likePage(visitorId) {
  if (!isSupabaseConfigured) return { error: new Error("Supabase no configurado") };

  try {
    const res = await fetch(`${REST_URL}/page_likes`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ visitor_id: visitorId }),
    });
    if (!res.ok && res.status !== 409) return { error: new Error(`HTTP ${res.status}`) };
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function unlikePage(visitorId) {
  if (!isSupabaseConfigured) return { error: new Error("Supabase no configurado") };

  try {
    const res = await fetch(`${REST_URL}/page_likes?visitor_id=eq.${encodeURIComponent(visitorId)}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (!res.ok) return { error: new Error(`HTTP ${res.status}`) };
    return { error: null };
  } catch (error) {
    return { error };
  }
}
