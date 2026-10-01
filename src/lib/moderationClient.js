async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok, status: res.status, data };
}

export function login(password) {
  return postJson("/api/moderation-login", { password });
}

export function logout() {
  return postJson("/api/moderation-logout");
}

export async function fetchMemories() {
  const res = await fetch("/api/moderation-memories", { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok, status: res.status, memories: data.memories || [] };
}

export function updateMemoryStatus(id, status) {
  return postJson("/api/moderation-update", { id, status });
}
