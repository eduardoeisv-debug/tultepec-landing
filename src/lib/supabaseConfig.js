// Chequeo liviano, sin importar el paquete completo de @supabase/supabase-js
// (que pesa ~130 KB gzip). Componentes que solo necesitan saber si la
// función está disponible (como el aviso en FinalCTA) deben importar esto
// en vez de supabaseClient.js, para no arrastrar esa dependencia al bundle
// principal de la landing.
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);
