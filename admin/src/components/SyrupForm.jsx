import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const SyrupForm = () => {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    dosage: '',
    tax: '',
    category: '',
    prices: [{ quantity: '', price: '' }]
  });

  const brands = ['Select Brand', 'HealthCo', 'PharmaPlus', 'MediCare', 'WellnessLabs'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...form.prices];
    updatedPrices[index][field] = value;
    setForm(prev => ({ ...prev, prices: updatedPrices }));
  };

  const addQuantityPrice = () => {
    setForm(prev => ({
      ...prev,
      prices: [...prev.prices, { quantity: '', price: '' }]
    }));
  };

  const removeQuantityPrice = (index) => {
    const updatedPrices = [...form.prices];
    updatedPrices.splice(index, 1);
    setForm(prev => ({ ...prev, prices: updatedPrices }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Append "ml" to quantities before submit
    const formattedPrices = form.prices.map(item => ({
      quantity: item.quantity ? `${item.quantity}ml` : '',
      price: item.price
    }));

    const finalData = {
      ...form,
      prices: formattedPrices
    };

    console.log('Syrup submitted:', finalData);
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
        value={form.name}
      />

      <select
        name="brand"
        className="w-full border rounded p-2"
        onChange={handleChange}
        value={form.brand}
      >
        {brands.map((b, idx) => (
          <option key={idx} value={idx === 0 ? '' : b} disabled={idx === 0}>
            {b}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="dosage"
        placeholder="Dosage Info"
        className="w-full border rounded p-2"
        onChange={handleChange}
        value={form.dosage}
      />

      <input
        type="text"
        name="category"
        placeholder="Category (e.g., Cough, Vitamin)"
        className="w-full border rounded p-2"
        onChange={handleChange}
        value={form.category}
      />

      <input
        type="number"
        name="tax"
        placeholder="Tax (%)"
        className="w-full border rounded p-2"
        onChange={handleChange}
        value={form.tax}
      />

      <div>
        <label className="font-medium mb-1 block">Prices per Quantity</label>
        <div className="space-y-2">
          {form.prices.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative w-1/3">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handlePriceChange(index, 'quantity', e.target.value)}
                  className="border rounded p-1 w-full pr-10"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">ml</span>
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                className="border rounded p-1 w-1/3"
              />
              <button
                type="button"
                onClick={() => removeQuantityPrice(index)}
                className="text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addQuantityPrice}
          className="mt-2 text-blue-600"
        >
          + Add Quantity
        </button>
      </div>

      <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded">
        Submit Syrup
      </button>
    </form>
  );
};

export default SyrupForm;
