import { useState } from 'react';
import { createCustomer } from '../lib/customerApi';

export default function CreateCustomerForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    houseNumber: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Combine address fields into a single address string
      const address = [
        form.houseNumber,
        form.area,
        form.landmark,
        form.city,
        form.state,
        form.pincode,
        form.country
      ].filter(Boolean).join(', ');

      const newCustomer = await createCustomer({
        name: form.name,
        email: form.email,
        mobile: form.phone, // Backend expects 'mobile' not 'phone'
        address: address,   // Backend expects single 'address' field
        active: true,
      });
      onCreated(newCustomer);
      onClose();
    } catch (err) {
      console.error('Error creating customer:', err);
      setError(err.message || 'Failed to create customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-xl max-h-screen overflow-y-auto relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="border p-2 rounded col-span-2" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="border p-2 rounded col-span-2" />
          <div className="flex">
          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100 text-gray-600">
      +91
    </span>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full border p-2 rounded col-span-2" />
          </div>

          <input name="houseNumber" value={form.houseNumber} onChange={handleChange} placeholder="House Number" required className="border p-2 rounded" />
          <input name="area" value={form.area} onChange={handleChange} placeholder="Area" required className="border p-2 rounded " />
          <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Landmark" className="border p-2 rounded " />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="border p-2 rounded" />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" required className="border p-2 rounded" />
          <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" required className="border p-2 rounded" />
          <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required className="border p-2 rounded" />
          <div className="col-span-2 text-right mt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-4 py-2 rounded ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
