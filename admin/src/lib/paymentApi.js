const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const PAYMENT_ENDPOINT = `${API_URL}/payments`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getPayments() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
}

export async function getPayment(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch payment');
  return res.json();
}

export async function createPayment(payment) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payment),
  });
  if (!res.ok) throw new Error('Failed to create payment');
  return res.json();
}

export async function updatePayment(id, payment) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payment),
  });
  if (!res.ok) throw new Error('Failed to update payment');
  return res.json();
}

export async function deletePayment(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete payment');
  return res.json();
} 