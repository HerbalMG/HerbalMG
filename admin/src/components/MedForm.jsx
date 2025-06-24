import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const MedForm = () => {
  const [unit, setUnit] = useState('ml');
  const [form, setForm] = useState({
    name: '',
    brand: '',
    dosage: '',
    tax: '',
    category: '',
    description: '',
    prices: [{ quantity: '', price: '', count: '' }]
  });

  const [errors, setErrors] = useState({});
  const brands = ['Select Brand', 'HealthCo', 'PharmaPlus', 'MediCare', 'WellnessLabs'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUnitChange = (e) => {
    const selectedUnit = e.target.value;
    setUnit(selectedUnit);
    setForm(prev => ({
      ...prev,
      prices: [{ quantity: '', price: '', count: '' }]
    }));
    setErrors({});
  };

  const handlePriceChange = (index, field, value) => {
    const updated = [...form.prices];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, prices: updated }));
  };

  const addQuantityPrice = () => {
    setForm(prev => ({
      ...prev,
      prices: [...prev.prices, { quantity: '', price: '', count: '' }]
    }));
  };

  const removeQuantityPrice = (index) => {
    const updated = [...form.prices];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, prices: updated }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.brand) newErrors.brand = 'Brand is required.';
    if (!form.dosage.trim()) newErrors.dosage = 'Dosage is required.';
    if (!form.category.trim()) newErrors.category = 'Category is required.';
    if (!form.tax || isNaN(form.tax)) newErrors.tax = 'Valid tax is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';


    const quantitiesSet = new Set();
    let hasValidPrice = false;

    form.prices.forEach((item, idx) => {
      if (!item.quantity) {
        newErrors[`quantity_${idx}`] = 'Quantity is required.';
      } else if (quantitiesSet.has(item.quantity)) {
        newErrors[`quantity_${idx}`] = 'Duplicate quantity.';
      } else {
        quantitiesSet.add(item.quantity);
      }

      if (!item.price || parseFloat(item.price) <= 0) {
        newErrors[`price_${idx}`] = 'Valid price required.';
      } else {
        hasValidPrice = true;
      }

      if (!item.count || parseInt(item.count) <= 0) {
        newErrors[`count_${idx}`] = 'Valid count required.';
      }
    });

    if (!hasValidPrice) {
      newErrors.prices = 'At least one valid price entry required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formattedPrices = form.prices.map(item => ({
      quantity: `${item.quantity}${unit}`,
      price: item.price,
      count: item.count
    }));

    const finalData = {
      ...form,
      unit,
      prices: formattedPrices
    };

    console.log('Submitted Product:', finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploader />

      <div>
        <label className="font-medium mr-2">Select Unit:</label>
        <select value={unit} onChange={handleUnitChange} className="border rounded p-2">
          <option value="ml">ml </option>
          <option value="gm">gm </option>
        </select>
      </div>

      <div>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="w-full border rounded p-2"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
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
        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
      </div>

      <div>
        <input
          type="text"
          name="dosage"
          placeholder="Dosage Info"
          className="w-full border rounded p-2"
          value={form.dosage}
          onChange={handleChange}
        />
        {errors.dosage && <p className="text-red-500 text-sm">{errors.dosage}</p>}
      </div>

      <div>
        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full border rounded p-2"
          value={form.category}
          onChange={handleChange}
        />
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>

      <div>
  <textarea
    name="description"
    placeholder="Description"
    className="w-full border rounded p-2"
    value={form.description}
    onChange={handleChange}
    rows={3}
  />
  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
</div>


      <div>
        <input
          type="number"
          name="tax"
          placeholder="Tax (%)"
          className="w-full border rounded p-2"
          value={form.tax}
          onChange={handleChange}
        />
        {errors.tax && <p className="text-red-500 text-sm">{errors.tax}</p>}
      </div>

      <div>
        <label className="font-medium mb-1 block">Prices per Unit</label>
        <div className="space-y-2">
          {form.prices.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {/* Quantity */}
              <div className="relative w-1/4">
                <input
                  type="number"
                  placeholder="Unit"
                  value={item.quantity}
                  onChange={(e) => handlePriceChange(index, 'quantity', e.target.value)}
                  className="border rounded p-1 w-full pr-10"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {unit}
                </span>
                {errors[`quantity_${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`quantity_${index}`]}</p>
                )}
              </div>

              {/* Price */}
              <div className="relative w-1/4">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                  className="border rounded pl-6 p-1 w-full"
                />
                {errors[`price_${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`price_${index}`]}</p>
                )}
              </div>

              {/* Count */}
              <div className="w-1/4">
                <input
                  type="number"
                  placeholder="Total Quantity"
                  value={item.count}
                  onChange={(e) => handlePriceChange(index, 'count', e.target.value)}
                  className="border rounded p-1 w-full"
                />
                {errors[`count_${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`count_${index}`]}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeQuantityPrice(index)}
                className="text-red-600"
              >
                ✕
              </button>
            </div>
          ))}

          {errors.prices && <p className="text-red-500 text-sm">{errors.prices}</p>}

          <button
            type="button"
            onClick={addQuantityPrice}
            className="mt-2 text-blue-600"
          >
            + Add Unit
          </button>
        </div>
      </div>

      <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded">
        Submit {unit === 'ml' ? 'Syrup' : 'Powder'}
      </button>
    </form>
  );
};

export default MedForm;
