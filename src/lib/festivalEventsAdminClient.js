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

export async function fetchAllFestivalEvents() {
  const res = await fetch("/api/festival-events-list", { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok, status: res.status, events: data.events || [] };
}

export function saveFestivalEvent(event) {
  return postJson("/api/festival-events-save", event);
}

export function deleteFestivalEvent(id) {
  return postJson("/api/festival-events-delete", { id });
}
