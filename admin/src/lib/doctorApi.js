const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_URL = `${BASE_URL}/doctor`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function parseError(res, fallback = 'Request failed') {
  let message = fallback;
  try {
    const data = await res.json();
    if (data?.message) message = data.message;
  } catch {}
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  throw new Error(message);
}

export async function getDoctors() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) await parseError(res, 'Failed to fetch doctors');
  return res.json();
}

export async function createDoctor(doctor) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(doctor),
  });
  if (!res.ok) await parseError(res, 'Failed to create doctor');
  return res.json();
}

export async function updateDoctor(id, doctor) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(doctor),
  });
  if (!res.ok) await parseError(res, 'Failed to update doctor');
  return res.json();
}

export async function deleteDoctor(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) await parseError(res, 'Failed to delete doctor');
  return res.json();
}
