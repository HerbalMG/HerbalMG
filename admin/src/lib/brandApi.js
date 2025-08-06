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

// Get all brands
export const getBrands = async () => {
  try {
    const response = await fetch(`${API_BASE}/brand`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

// Get top brands only
export const getTopBrands = async () => {
  try {
    const response = await fetch(`${API_BASE}/brand/top`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch top brands: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching top brands:', error);
    throw error;
  }
};

// Get brand by ID
export const getBrand = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/brand/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brand: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching brand:', error);
    throw error;
  }
};

// Get brand by slug
export const getBrandBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE}/brand/slug/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brand: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching brand by slug:', error);
    throw error;
  }
};

// Create brand
export const createBrand = async (brandData) => {
  try {
    const response = await fetch(`${API_BASE}/brand`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(brandData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create brand: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

// Update brand
export const updateBrand = async (id, brandData) => {
  try {
    const response = await fetch(`${API_BASE}/brand/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(brandData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update brand: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

// Delete brand
export const deleteBrand = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/brand/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete brand: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

// Delete uploaded image
export const deleteUploadedImage = async (imageUrl) => {
  try {
    const response = await fetch(`${API_BASE}/upload/delete`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageUrl }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete image: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting uploaded image:', error);
    throw error;
  }
};