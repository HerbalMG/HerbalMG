const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get all reference books
export const getReferenceBooks = async () => {
  try {
    const response = await fetch(`${API_BASE}/reference-books`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reference books: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reference books:', error);
    throw error;
  }
};

// Get reference book by ID
export const getReferenceBook = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/reference-books/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reference book: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reference book:', error);
    throw error;
  }
};

// Create reference book
export const createReferenceBook = async (bookData) => {
  try {
    const response = await fetch(`${API_BASE}/reference-books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create reference book: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating reference book:', error);
    throw error;
  }
};

// Update reference book
export const updateReferenceBook = async (id, bookData) => {
  try {
    const response = await fetch(`${API_BASE}/reference-books/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update reference book: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating reference book:', error);
    throw error;
  }
};

// Delete reference book
export const deleteReferenceBook = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/reference-books/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete reference book: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting reference book:', error);
    throw error;
  }
};