// Envía el comentario a la función serverless (api/submit-comment.js), que
// verifica el captcha en el servidor antes de guardar en Supabase. Mismo
// patrón que src/lib/submitMemory.js.
export async function submitComment(payload) {
  try {
    const res = await fetch("/api/submit-comment", {
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
