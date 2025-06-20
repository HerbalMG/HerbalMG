import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const SyrupForm = () => {
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    prices: {}
  });

  const quantities = ['50ml', '100ml', '150ml', '200ml', '250ml', '500ml'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (qty, value) => {
    setForm(prev => ({
      ...prev,
      prices: { ...prev.prices, [qty]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Syrup submitted:', form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploader />

      <input
        type="text"
        name="name"
        placeholder="Syrup Name"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <input
        type="text"
        name="dosage"
        placeholder="Dosage Info"
        className="w-full border rounded p-2"
        onChange={handleChange}
      />

      <div>
        <label className="font-medium mb-1 block">Prices per Quantity</label>
        <div className="grid grid-cols-2 gap-4">
          {quantities.map((qty) => (
            <div key={qty} className="flex items-center space-x-2">
              <span className="w-20">{qty}</span>
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={form.prices[qty] || ''}
                onChange={(e) => handlePriceChange(qty, e.target.value)}
                className="flex-1 border rounded p-1"
              />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded">
        Submit Syrup
      </button>
    </form>
  );
};

export default SyrupForm;
