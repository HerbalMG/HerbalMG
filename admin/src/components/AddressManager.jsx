import React, { useState, useEffect } from 'react';

const AddressManager = ({ customerId, onClose }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/customers/${customerId}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      } else {
        setError('Failed to fetch addresses');
      }
    } catch (err) {
      setError('Error fetching addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/customers/${customerId}/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAddress)
      });

      if (response.ok) {
        const address = await response.json();
        setAddresses([...addresses, address]);
        setNewAddress({
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          is_default: false
        });
        setShowAddForm(false);
      } else {
        setError('Failed to add address');
      }
    } catch (err) {
      setError('Error adding address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/customers/${customerId}/addresses/${addressId}/set-default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state
        setAddresses(addresses.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        })));
      } else {
        setError('Failed to set default address');
      }
    } catch (err) {
      setError('Error setting default address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/customers/${customerId}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
      } else {
        setError('Failed to delete address');
      }
    } catch (err) {
      setError('Error deleting address');
    }
  };

  if (loading) return <div className="p-4">Loading addresses...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Addresses</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showAddForm ? 'Cancel' : '+ Add New Address'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 rounded mb-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Address Line 1"
                value={newAddress.address_line1}
                onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                value={newAddress.address_line2}
                onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                className="border p-2 rounded"
              />
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={newAddress.is_default}
                onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="is_default">Set as default address</label>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
              >
                Add Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No addresses found</p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 ${
                  address.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {address.is_default && (
                      <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded mb-2">
                        Default Address
                      </span>
                    )}
                    <div className="text-sm">
                      <div className="font-medium">{address.address_line1}</div>
                      {address.address_line2 && (
                        <div className="text-gray-600">{address.address_line2}</div>
                      )}
                      <div className="text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                      </div>
                      <div className="text-gray-600">{address.country}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressManager;