import React, { useState, useRef, useEffect } from 'react';

const SearchableDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  displayKey = 'name',
  valueKey = 'id' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option => {
    const displayValue = typeof option === 'object' ? option[displayKey] : option;
    return displayValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedOption = options.find(option => {
    const optionValue = typeof option === 'object' ? option[valueKey] : option;
    return optionValue.toString() === value.toString();
  });

  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption[displayKey] : selectedOption)
    : '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    const optionValue = typeof option === 'object' ? option[valueKey] : option;
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 text-sm"
              type="button"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            {isOpen ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {!value && (
            <div
              onClick={handleClear}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-500"
            >
              {placeholder}
            </div>
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const optionValue = typeof option === 'object' ? option[valueKey] : option;
              const displayText = typeof option === 'object' ? option[displayKey] : option;
              
              return (
                <div
                  key={typeof option === 'object' ? option[valueKey] || index : index}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${
                    optionValue.toString() === value.toString() ? 'bg-blue-100 text-blue-800' : ''
                  }`}
                >
                  {displayText}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductFilters = ({
  brands,
  diseases,
  selectedBrand,
  setSelectedBrand,
  selectedDisease,
  setSelectedDisease,
  priceRange,
  setPriceRange,
  showOnlyDiscounted,
  setShowOnlyDiscounted,
  clearFilters,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      {/* Search Filter */}
      {setSearchQuery && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name..."
              className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        <SearchableDropdown
          options={brands}
          value={selectedBrand}
          onChange={setSelectedBrand}
          placeholder="Search brands..."
          displayKey="name"
          valueKey="id"
        />
      </div>

      {/* Disease Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Disease/Condition
        </label>
        <SearchableDropdown
          options={diseases}
          value={selectedDisease}
          onChange={setSelectedDisease}
          placeholder="Search conditions..."
          displayKey={typeof diseases[0] === 'object' ? 'name' : null}
          valueKey={typeof diseases[0] === 'object' ? 'name' : null}
        />
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Discount Filter */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showOnlyDiscounted}
            onChange={(e) => setShowOnlyDiscounted(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Show only discounted products</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;