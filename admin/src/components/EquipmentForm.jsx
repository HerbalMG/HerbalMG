import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const EquipmentForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    usage: '',
    gst: '',
    description: '',
    quantity: '',
    brand: '',
    category: ''
  });

  const brands = ['3M', 'GE Healthcare', 'Philips', 'Siemens', 'Other'];
  const categories = ['Diagnostic', 'Surgical', 'Monitoring', 'Therapeutic', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Equipment submitted:', form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploader />

      <input
        type="text"
        name="name"
        placeholder="Equipment Name"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      {/* Brand Dropdown */}
      <select
        name="brand"
        className="w-full border rounded p-2"
        value={form.brand}
        onChange={handleChange}
      >
        <option value="">Select Brand</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>{brand}</option>
        ))}
      </select>

      {/* Category Dropdown */}
      <input
  type="text"
  name="category"
  placeholder="Category"
  className="w-full border rounded p-2"
  onChange={handleChange}
/>


      {/* Price with Rupee Prefix */}
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="pl-7 w-full border rounded p-2"
          onChange={handleChange}
        />
      </div>

      {/* GST */}
      <input
        type="number"
        name="gst"
        placeholder="GST (%)"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      {/* Quantity */}
      <input
        type="number"
        name="quantity"
        placeholder="Total Quantity"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      {/* Description */}
      <textarea
        name="description"
        rows="3"
        placeholder="Description"
        className="w-full border rounded p-2"
        onChange={handleChange}
      ></textarea>

      {/* Usage Instructions */}
      <textarea
        name="usage"
        rows="3"
        placeholder="How to Use"
        className="w-full border rounded p-2"
        onChange={handleChange}
      ></textarea>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
        Submit Equipment
      </button>
    </form>
  );
};

export default EquipmentForm;
