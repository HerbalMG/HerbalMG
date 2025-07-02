const API_URL = 'http://localhost:3001/api/brand';

export async function getBrands() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export async function createBrand(brand) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brand),
  });
  if (!res.ok) throw new Error('Failed to create brand');
  return res.json();
}

export async function deleteBrand(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete brand');
  return res.json();
} 