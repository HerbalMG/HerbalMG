const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const MAIN_CATEGORY_ENDPOINT = `${API_URL}/main-category`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export const getMainCategories = async () => {
  const res = await fetch(MAIN_CATEGORY_ENDPOINT, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch main categories');
  return res.json();
};

export const createMainCategory = async (data) => {
  const res = await fetch(MAIN_CATEGORY_ENDPOINT, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save main category');
  return res.json();
};

export const updateMainCategory = async (id, data) => {
  const res = await fetch(`${MAIN_CATEGORY_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update main category');
  return res.json();
};

export const deleteMainCategory = async (id) => {
  const res = await fetch(`${MAIN_CATEGORY_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete main category');
  return res.json();
}; 