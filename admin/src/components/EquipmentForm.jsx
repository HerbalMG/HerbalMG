import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const EquipmentForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    usage: ''
  });

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

      <input
        type="number"
        name="price"
        placeholder="Price"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

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
