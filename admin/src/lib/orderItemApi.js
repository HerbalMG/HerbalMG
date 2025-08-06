const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ORDER_ITEM_ENDPOINT = `${API_URL}/order-items`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getOrderItems() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch order items');
  return res.json();
}

export async function getOrderItem(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch order item');
  return res.json();
}

export async function createOrderItem(item) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to create order item');
  return res.json();
}

export async function updateOrderItem(id, item) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to update order item');
  return res.json();
}

export async function deleteOrderItem(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete order item');
  return res.json();
} 