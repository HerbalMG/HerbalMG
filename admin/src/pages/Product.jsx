import React, { useState } from 'react';
import EquipmentForm from '../components/EquipmentForm';
import MedicineForm from '../components/MedicineForm';

const Product = () => {
  const [category, setCategory] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Select Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Category --</option>
          <option value="equipment">Medical Equipment</option>
          <option value="medicine">Medicine</option>
        </select>
      </div>

      {/* Conditional Forms */}
      {category === 'equipment' && <EquipmentForm />}
      {category === 'medicine' && <MedicineForm />}
    </div>
  );
};

export default Product;
