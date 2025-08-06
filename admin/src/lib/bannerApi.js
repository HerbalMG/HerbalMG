const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_URL = `${BASE_URL}/banner`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = `Error ${res.status} ${res.statusText}`;
    try {
      const errData = await res.json();
      if (errData.message) errorMsg += `: ${errData.message}`;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function getBanners() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createBanner(banner) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(banner),
  });
  return handleResponse(res);
}

export async function deleteBanner(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getProducts() {
  const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const res = await fetch(`${baseApiUrl}/product`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  return res.json();
}
