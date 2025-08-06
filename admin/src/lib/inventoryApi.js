const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_URL = `${API_BASE}/inventory`;

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function getInventories() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return res.json();
}

export async function getInventory(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch inventory item');
  return res.json();
}

export async function createInventory(item) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to create inventory item');
  return res.json();
}

export async function updateInventory(id, item) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to update inventory item');
  return res.json();
}

export async function deleteInventory(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete inventory item');
  return res.json();
}