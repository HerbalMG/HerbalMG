const API_URL = 'http://localhost:3001/api/doctor';

export async function getDoctors() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
}

export async function createDoctor(doctor) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctor),
  });
  if (!res.ok) throw new Error('Failed to create doctor');
  return res.json();
}

export async function updateDoctor(id, doctor) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctor),
  });
  if (!res.ok) throw new Error('Failed to update doctor');
  return res.json();
}

export async function deleteDoctor(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete doctor');
  return res.json();
} 