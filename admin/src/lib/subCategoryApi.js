const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SUB_CATEGORY_ENDPOINT = `${API_URL}/sub-categories`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export const getSubCategories = async () => {
  const res = await fetch(SUB_CATEGORY_ENDPOINT, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch sub categories');
  return res.json();
};

export const createSubCategory = async (data) => {
  const res = await fetch(SUB_CATEGORY_ENDPOINT, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save sub category');
  return res.json();
};

export const updateSubCategory = async (id, data) => {
  const res = await fetch(`${SUB_CATEGORY_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update sub category');
  return res.json();
};

export const deleteSubCategory = async (id) => {
  const res = await fetch(`${SUB_CATEGORY_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete sub category');
  return res.json();
}; 