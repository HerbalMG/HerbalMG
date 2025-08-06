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

// Main Categories
export const getMainCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/main-category`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch main categories: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching main categories:', error);
    throw error;
  }
};

export const getMainCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/main-category/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch main category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching main category:', error);
    throw error;
  }
};

export const getMainCategoryBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE}/main-category/slug/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch main category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching main category by slug:', error);
    throw error;
  }
};

export const createMainCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE}/main-category`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create main category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating main category:', error);
    throw error;
  }
};

export const updateMainCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_BASE}/main-category/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update main category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating main category:', error);
    throw error;
  }
};

export const deleteMainCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/main-category/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete main category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting main category:', error);
    throw error;
  }
};

// Sub Categories
export const getSubCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/sub-categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sub categories: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sub categories:', error);
    throw error;
  }
};

export const getSubCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/sub-category/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sub category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sub category:', error);
    throw error;
  }
};

export const getSubCategoryBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE}/sub-category/slug/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sub category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sub category by slug:', error);
    throw error;
  }
};

export const createSubCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE}/sub-category`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create sub category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating sub category:', error);
    throw error;
  }
};

export const updateSubCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_BASE}/sub-category/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update sub category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating sub category:', error);
    throw error;
  }
};

export const deleteSubCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/sub-category/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete sub category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting sub category:', error);
    throw error;
  }
};