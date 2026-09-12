const API_BASE = "http://localhost:8000/api";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getBlocks: () => request("/blocks"),
  createBlock: (payload) =>
    request("/blocks", { method: "POST", body: JSON.stringify(payload) }),
  sanctionBlock: (blockId) =>
    request(`/blocks/${blockId}/sanction`, { method: "POST" }),
  getConflicts: () => request("/conflicts"),
  shadowMerge: (conflictId) =>
    request(`/conflicts/${conflictId}/shadow-merge`, { method: "POST" }),
  getTrains: () => request("/trains"),
  uploadTimetable: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE}/coa/timetable`, {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: formData,
    }).then((res) => res.json());
  },
  whatIf: (trainNo, delayMinutes, rootCause) =>
    request("/simulator/what-if", {
      method: "POST",
      body: JSON.stringify({ trainNo, delayMinutes, rootCause }),
    }),
};