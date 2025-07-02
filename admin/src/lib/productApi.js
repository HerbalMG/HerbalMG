const API_URL = 'http://localhost:3001/api/product';

export async function getProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
} 