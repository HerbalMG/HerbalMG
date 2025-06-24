import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const TabletForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    dosage: '',
    brand: '',
    quantity: '',
    description: '',
    gst: '',
    category: '', // Added category to form state
  });

  const brands = ['Pfizer', 'Sun Pharma', 'Cipla', 'Dr. Reddy’s', 'Other'];
  const categories = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Other']; // Example categories

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tablet/Capsule submitted:', form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploader />

      <input
        type="text"
        name="name"
        placeholder="Medicine Name"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <select
        name="brand"
        className="w-full border rounded p-2"
        onChange={handleChange}
        value={form.brand}
      >
        <option value="">Select Brand</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* 👇 New Category Field */}
     <input
  type="text"
  name="category"
  placeholder="Category"
  className="w-full border rounded p-2"
  onChange={handleChange}
/>


      <input
        type="number"
        name="price"
        placeholder="Price"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <input
        type="text"
        name="dosage"
        placeholder="Dosage Information"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <input
        type="number"
        name="quantity"
        placeholder="Total Quantity"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border rounded p-2"
        rows={3}
        onChange={handleChange}
      />

      <input
        type="number"
        name="gst"
        placeholder="GST (%)"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
        Submit Tablet
      </button>
    </form>
  );
};

export default TabletForm;
