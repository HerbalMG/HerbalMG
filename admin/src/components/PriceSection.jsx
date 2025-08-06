import React from 'react';

const PriceSection = ({ prices, setPrices, errors, formType }) => {
  const handlePriceChange = (idx, field, value) => {
    const updated = prices.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    
    // Auto-calculate selling price when actual price or discount changes
    if (field === 'actualPrice' || field === 'discount') {
      const actual = parseFloat(updated[idx].actualPrice) || 0;
      const discount = parseFloat(updated[idx].discount) || 0;
      
      if (actual > 0) {
        const discountAmount = (actual * discount) / 100;
        const sellingPrice = actual - discountAmount;
        updated[idx].sellingPrice = sellingPrice > 0 ? sellingPrice.toFixed(2) : "";
      } else {
        updated[idx].sellingPrice = "";
      }
    }
    
    setPrices(updated);
  };

  const addPriceRow = () => setPrices(prices.concat({ 
    size: '', // Empty by default, suffix will show the type
    quantity: '', 
    actualPrice: '', 
    discount: '0', // Default discount to 0
    sellingPrice: '' 
  }));
  const removePriceRow = idx => {
    if (prices.length === 1) return;
    setPrices(prices.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="font-medium block mb-1">Prices per portion of Size</label>
      <div className="space-y-2 ">
        {prices.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1/5 relative">
              <label className="text-sm">Product Size</label>
              <input
                type="text"
                placeholder={
                  formType === "tablet" ? "e.g., 10" : 
                  formType === "capsule" ? "e.g., 30" :
                  formType === "ml" ? "e.g., 100" :
                  formType === "gm" ? "e.g., 50" : "e.g., 100"
                }
                value={item.size}
                onChange={e => handlePriceChange(index, 'size', e.target.value)}
                className="border rounded p-1 w-full pr-16"
              />
              <span className="absolute right-3 top-7 text-gray-600 pointer-events-none select-none text-sm">
                {formType === "tablet" ? "tablets" : 
                 formType === "capsule" ? "capsules" :
                 formType === "ml" ? "ml" :
                 formType === "gm" ? "gm" : formType}
              </span>
              {errors[`size_${index}`] && <p className="text-red-500 text-sm ">{errors[`size_${index}`]}</p>}
            </div>
            <div className="w-1/5 relative">
              <label className="text-sm">Actual Price</label>
              <span className="absolute left-2 top-7 text-gray-500">₹</span>
              <input
                type="number"
                step="0.01"
                placeholder="Actual Price "
                value={item.actualPrice}
                onChange={e => handlePriceChange(index, 'actualPrice', e.target.value)}
                className="border rounded p-1 pl-6 w-full"
              />
              {errors[`actualPrice_${index}`] && <p className="text-red-500 text-sm">{errors[`actualPrice_${index}`]}</p>}
            </div>
            <div className="w-1/5">
              <label className="text-sm">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
                value={item.discount}
                onChange={e => handlePriceChange(index, 'discount', e.target.value)}
                className="border rounded p-1 w-full"
              />
              {errors[`discount_${index}`] && <p className="text-red-500 text-sm">{errors[`discount_${index}`]}</p>}
            </div>
            <div className="w-1/5 relative">
              <label className="text-sm">Selling Price</label>
              <span className="absolute left-2 top-7 text-gray-500">₹</span>
              <input
                type="number"
                step="0.01"
                placeholder="Selling Price"
                value={item.sellingPrice}
                onChange={e => handlePriceChange(index, 'sellingPrice', e.target.value)}
                className="border rounded p-1 pl-6 w-full"
              />
              {errors[`sellingPrice_${index}`] && <p className="text-red-500 text-sm">{errors[`sellingPrice_${index}`]}</p>}
            </div>
            <div className="w-1/5">
              <label className="text-sm">Quantity</label>
              <input
                type="number"
                placeholder="Eg:150"
                value={item.quantity}
                onChange={e => handlePriceChange(index, 'quantity', e.target.value)}
                className="border rounded p-1 w-full"
              />
              {errors[`quantity_${index}`] && <p className="text-red-500 text-sm">{errors[`quantity_${index}`]}</p>}
            </div>
            <button
              type="button"
              onClick={() => removePriceRow(index)}
              className="text-red-600 mt-6"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addPriceRow} className="mt-2 text-blue-600">+ Add More Size</button>
      </div>
    </div>
  );
};

export default PriceSection; 