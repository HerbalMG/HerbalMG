import React, { useEffect, useState } from 'react';

const BrandFilterAside = ({ selectedBrands, onBrandChange }) => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/brand')
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error('Failed to fetch brands:', err));
  }, []);

  const handleCheckboxChange = (brandId) => {
    const isSelected = selectedBrands.includes(brandId);
    const updated = isSelected
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];

    onBrandChange(updated); // Call parent callback
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-full sm:w-64 p-4 bg-white shadow rounded h-fit sticky top-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter by Brand</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search brands..."
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Brand Checkboxes */}
      <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <li key={brand.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onChange={() => handleCheckboxChange(brand.id)}
                className="accent-blue-600"
              />
              <label htmlFor={`brand-${brand.id}`} className="text-gray-700">
                {brand.name}
              </label>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-400">No brands found</li>
        )}
      </ul>
    </aside>
  );
};

export default BrandFilterAside;
