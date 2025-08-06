const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  // Check both locations for token
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token || localStorage.getItem('token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get all products with enhanced filtering
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const url = `${API_BASE}/product${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/product/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get product by slug
export const getProductBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE}/product/slug/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};

// Get product prices
export const getProductPrices = async (productId) => {
  try {
    const response = await fetch(`${API_BASE}/product_price/product/${productId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product prices: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product prices:', error);
    throw error;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE}/product`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE}/product/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/product/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Create product prices
export const createProductPrices = async (productId, prices) => {
  try {
    console.log('Creating product prices via API:', { productId, prices });
    const response = await fetch(`${API_BASE}/product_price`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, prices }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create product prices: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Product prices created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating product prices:', error);
    throw error;
  }
};

// Update product prices
export const updateProductPrices = async (productId, prices) => {
  try {
    console.log('Updating product prices via API:', { productId, prices });
    const response = await fetch(`${API_BASE}/product_price/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prices }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update product prices: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Product prices updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating product prices:', error);
    throw error;
  }
};

// Delete image
export const deleteImage = async (imageUrl) => {
  try {
    const response = await fetch(`${API_BASE}/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete image: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (searchTerm, filters = {}) => {
  try {
    const params = new URLSearchParams({
      search: searchTerm,
      ...filters
    });
    
    const response = await fetch(`${API_BASE}/product?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};