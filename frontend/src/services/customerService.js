const API_BASE_URL = 'http://localhost:3001/api';

// Create or get customer
export const createOrGetCustomer = async (customerData) => {
  try {
    // First try to find existing customer by email
    const existingResponse = await fetch(`${API_BASE_URL}/customer/email/${customerData.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (existingResponse.ok) {
      const existingCustomer = await existingResponse.json();
      return existingCustomer;
    }

    // If customer doesn't exist, create new one
    const response = await fetch(`${API_BASE_URL}/customer/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating/getting customer:', error);
    throw error;
  }
};