import { useEffect, useState } from 'react';

export default function BrandFilterAside({ selectedBrands, onBrandChange }) {
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

    onBrandChange(updated);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-full sm:w-64 p-4 bg-white shadow rounded">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Filter by Brand</h2>

      <input
        type="text"
        placeholder="Search brands..."
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
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
}


export const DiseaseFilterAside = ({ selectedDiseases, onDiseaseChange }) => {
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/disease')
      .then((res) => res.json())
      .then((data) => setDiseases(data))
      .catch((err) => console.error('Failed to fetch diseases:', err));
  }, []);

  const handleCheckboxChange = (diseaseId) => {
    const isSelected = selectedDiseases.includes(diseaseId);
    const updated = isSelected
      ? selectedDiseases.filter((id) => id !== diseaseId)
      : [...selectedDiseases, diseaseId];

    onDiseaseChange(updated);
  };

  const filteredDiseases = diseases.filter((disease) =>
    disease.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-full sm:w-64 p-4 bg-white shadow rounded">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Filter by Disease</h2>

      <input
        type="text"
        placeholder="Search diseases..."
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {filteredDiseases.length > 0 ? (
          filteredDiseases.map((disease) => (
            <li key={disease.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`disease-${disease.id}`}
                checked={selectedDiseases.includes(disease.id)}
                onChange={() => handleCheckboxChange(disease.id)}
                className="accent-blue-600"
              />
              <label htmlFor={`disease-${disease.id}`} className="text-gray-700">
                {disease.name}
              </label>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-400">No diseases found</li>
        )}
      </ul>
    </aside>
  );
};
