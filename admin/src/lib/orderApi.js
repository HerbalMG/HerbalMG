const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token || localStorage.getItem('token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get all orders
export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE}/order-items`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/order-items/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE}/order-items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create order: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order
export const updateOrder = async (id, orderData) => {
  try {
    const response = await fetch(`${API_BASE}/order-items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update order: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/order-items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete order: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};