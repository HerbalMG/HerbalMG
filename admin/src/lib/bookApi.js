const API_URL = 'http://localhost:3001/api/book';

export async function getBooks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function createBook(book) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to create book');
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete book');
  return res.json();
} 