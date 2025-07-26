export async function fetchWithAuth(url, token, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers,
  };

  return fetch(url, config);
}
