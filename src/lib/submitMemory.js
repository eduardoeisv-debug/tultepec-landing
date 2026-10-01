// Envía la memoria a la función serverless (api/submit-memory.js), que
// verifica el captcha en el servidor antes de guardar en Supabase. Nunca
// inserta directo desde el navegador para esta acción.
export async function submitMemory(payload) {
  try {
    const res = await fetch("/api/submit-memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      return { error: new Error(data.error || `HTTP ${res.status}`) };
    }
    return { error: null };
  } catch (error) {
    return { error };
  }
}
