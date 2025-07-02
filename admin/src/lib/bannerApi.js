const API_URL = 'http://localhost:3001/api/banner';

export async function getBanners() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch banners');
  return res.json();
}

export async function createBanner(banner) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(banner),
  });
  if (!res.ok) throw new Error('Failed to create banner');
  return res.json();
}

export async function deleteBanner(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete banner');
  return res.json();
} 