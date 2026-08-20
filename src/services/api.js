// Centralized API client for the FastAPI backend.
// All requests go through `request()` so error handling stays consistent.

const BASE_URL = "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let detail = `Error ${response.status}`;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // response had no JSON body
    }
    throw new Error(detail);
  }

  // DELETE endpoints return {"message": "Deleted"} -> still valid JSON
  return response.json();
}

/* ---------------- Communities ---------------- */
export const communitiesApi = {
  list: () => request("/communities/"),
  create: (data) =>
    request("/communities/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/communities/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/communities/${id}`, { method: "DELETE" }),
};

/* ---------------- Neighbors ---------------- */
export const neighborsApi = {
  list: () => request("/neighbors/"),
  create: (data) =>
    request("/neighbors/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/neighbors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/neighbors/${id}`, { method: "DELETE" }),
};

/* ---------------- Payments ---------------- */
// NOTE: the FastAPI router for payments is mounted with prefix "/payment"
// (singular) in payments.py -> router = APIRouter(prefix="/payment", ...)
// The frontend route/page is still called "Payments" (/payments) but the
// API calls below correctly hit /payment/... to match the backend.
export const paymentsApi = {
  list: () => request("/payment/"),
  create: (data) =>
    request("/payment/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/payment/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/payment/${id}`, { method: "DELETE" }),
  markAsPaid: (id) => request(`/payment/${id}/pay`, { method: "PUT" }),
};

/* ---------------- Expenses ---------------- */
export const expensesApi = {
  list: () => request("/expenses/"),
  create: (data) =>
    request("/expenses/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/expenses/${id}`, { method: "DELETE" }),
};

/* ---------------- Incidents ---------------- */
export const incidentsApi = {
  list: () => request("/incidents/"),
  create: (data) =>
    request("/incidents/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/incidents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/incidents/${id}`, { method: "DELETE" }),
};

/* ---------------- Actas ---------------- */
export const actasApi = {
  list: () => request("/actas/"),
  get: (id) => request(`/actas/${id}`),
  create: (data) =>
    request("/actas/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/actas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/actas/${id}`, { method: "DELETE" }),
  generate: (data) =>
    request("/actas/generate", { method: "POST", body: JSON.stringify(data) }),
};

/* ---------------- AI (Ollama / Llama 3.1) ---------------- */
// Backed by app/routers/ai.py -> prefix "/ai"
export const aiApi = {
  analyzeIncident: (description) =>
    request("/ai/analyze-incident", {
      method: "POST",
      body: JSON.stringify({ description }),
    }),
  generateMinute: (data) =>
    request("/ai/generate-minute", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
