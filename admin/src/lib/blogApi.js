const API_URL = 'http://localhost:3001/api/blog';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getBlogs() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function getBlog(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch blog');
  return res.json();
}

export async function createBlog(blog) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error('Failed to create blog');
  return res.json();
}

export async function updateBlog(id, blog) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error('Failed to update blog');
  return res.json();
}

export async function deleteBlog(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete blog');
  return res.json();
} 