
const BASE_URL = "https://m6i5hfjwjnu3z3mmiihuwbuhwa0izria.lambda-url.eu-north-1.on.aws/";

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
      
    }
    throw new Error(detail);
  }

  return response.json();
}

/* ---------------- Communities ---------------- */
export const communitiesApi = {
  list: () => request("/communities"),
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


export const paymentsApi = {
  list: () => request("/payment/"),
  create: (data) =>
    request("/payment/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/payment/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/payment/${id}`, { method: "DELETE" }),
  markAsPaid: (id) => request(`/payment/${id}/pay`, { method: "PUT" }),
};

export const expensesApi = {
  list: () => request("/expenses/"),
  create: (data) =>
    request("/expenses/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/expenses/${id}`, { method: "DELETE" }),
};


export const incidentsApi = {
  list: () => request("/incidents/"),
  create: (data) =>
    request("/incidents/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/incidents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/incidents/${id}`, { method: "DELETE" }),
};


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
