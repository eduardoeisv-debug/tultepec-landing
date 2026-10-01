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

export async function fetchAllTestimonials() {
  const res = await fetch("/api/testimonials-list", { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok, status: res.status, testimonials: data.testimonials || [] };
}

export function saveTestimonial(testimonial) {
  return postJson("/api/testimonials-save", testimonial);
}

export function deleteTestimonial(id) {
  return postJson("/api/testimonials-delete", { id });
}
