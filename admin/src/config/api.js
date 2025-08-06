const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/login`,
    LOGOUT: `${API_BASE_URL}/logout`,
  },
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/product`,
  PRODUCT_PRICE: `${API_BASE_URL}/product_price`,
  
  // Categories
  MAIN_CATEGORY: `${API_BASE_URL}/main-category`,
  SUB_CATEGORY: `${API_BASE_URL}/sub-categories`,
  
  // Brands
  BRANDS: `${API_BASE_URL}/brand`,
  
  // Customers
  CUSTOMERS: `${API_BASE_URL}/customers`,
  
  // Orders
  ORDER_ITEMS: `${API_BASE_URL}/order-items`,
  
  // Payments
  PAYMENTS: `${API_BASE_URL}/payments`,
  
  // Blog
  BLOG: `${API_BASE_URL}/blog`,
  
  // Banner
  BANNER: `${API_BASE_URL}/banner`,
  
  // Reference Books
  REFERENCE_BOOKS: `${API_BASE_URL}/reference-books`,
  
  // Diseases
  DISEASES: `${API_BASE_URL}/disease`,
  
  // Doctors
  DOCTORS: `${API_BASE_URL}/doctor`,
  
  // Delivery Status
  DELIVERY_STATUS: `${API_BASE_URL}/delivery_status`,
  
  // Images
  IMAGES: `${API_BASE_URL}/images`,
  
  // Upload
  UPLOAD: `${API_BASE_URL}/upload`,
  
  // Search
  SEARCH: `${API_BASE_URL}/search`,
  
  // Location
  LOCATION: `${API_BASE_URL}/location`,
  
  // Google Sheets
  GOOGLE_SHEETS: `${API_BASE_URL}/google-sheets`,
};

// API helper functions
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_ENDPOINTS;