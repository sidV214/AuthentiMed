const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

export async function api(endpoint, { method = 'GET', body, token } = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const options = {
    method,
    headers,
    ...(body && method !== 'GET' && { body: JSON.stringify(body) }),
  };
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
