const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const CUSTOMER_ENDPOINT = `${API_URL}/customers`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getCustomers() {
  const res = await fetch(CUSTOMER_ENDPOINT, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function getCustomer(id) {
  const res = await fetch(`${CUSTOMER_ENDPOINT}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch customer');
  return res.json();
}

export async function createCustomer(customer) {
  const res = await fetch(CUSTOMER_ENDPOINT, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  return res.json();
}

export async function updateCustomer(id, customer) {
  const res = await fetch(`${CUSTOMER_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return res.json();
}

export async function deleteCustomer(id) {
  const res = await fetch(`${CUSTOMER_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete customer');
  return res.json();
} 