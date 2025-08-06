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

// Get all diseases
export const getDiseases = async () => {
  try {
    const response = await fetch(`${API_BASE}/disease`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch diseases: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching diseases:', error);
    throw error;
  }
};

// Get disease by ID
export const getDisease = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/disease/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch disease: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching disease:', error);
    throw error;
  }
};

// Get disease by slug
export const getDiseaseBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE}/disease/slug/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch disease: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching disease by slug:', error);
    throw error;
  }
};

// Create disease
export const createDisease = async (diseaseData) => {
  try {
    const response = await fetch(`${API_BASE}/disease`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(diseaseData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create disease: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating disease:', error);
    throw error;
  }
};

// Update disease
export const updateDisease = async (id, diseaseData) => {
  try {
    const response = await fetch(`${API_BASE}/disease/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(diseaseData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update disease: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating disease:', error);
    throw error;
  }
};

// Delete disease
export const deleteDisease = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/disease/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete disease: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting disease:', error);
    throw error;
  }
};