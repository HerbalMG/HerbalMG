import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import searchAnalytics from '../utils/searchAnalytics';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({
    products: [],
    brands: [],
    diseases: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [totalCounts, setTotalCounts] = useState({});
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    category: '',
    medicine_type: '',
    min_price: '',
    max_price: '',
    prescription_required: '',
    in_stock: true
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    hasMore: false
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
      // Track the search when component loads
      searchAnalytics.trackSearch(query);
    }
  }, [query, sortBy, filters, pagination.offset]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        q: searchQuery,
        sortBy,
        limit: pagination.limit,
        offset: pagination.offset,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
        )
      });

      const response = await fetch(`http://localhost:3001/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      setResults(data.results || {
        products: [],
        brands: [],
        diseases: [],
        categories: []
      });
      
      setTotalCounts(data.totalCounts || {});
      setPagination(prev => ({
        ...prev,
        hasMore: data.pagination?.hasMore || false
      }));
      
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to old search method
      await performFallbackSearch(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  const performFallbackSearch = async (searchQuery) => {
    try {
      const searchPromises = [
        // Search products
        fetch(`http://localhost:3001/api/product?search=${encodeURIComponent(searchQuery)}`).then(res => 
          res.ok ? res.json().then(data => Array.isArray(data) ? data : []) : []
        ),
        // Search brands
        fetch(`http://localhost:3001/api/brand`).then(res => 
          res.ok ? res.json().then(data => 
            Array.isArray(data) ? data.filter(brand => 
              brand.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) : []
          ) : []
        ),
        // Search diseases
        fetch(`http://localhost:3001/api/disease`).then(res => 
          res.ok ? res.json().then(data => 
            Array.isArray(data) ? data.filter(disease => 
              disease.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) : []
          ) : []
        ),
        // Search medicine categories
        Promise.resolve().then(() => {
          const medicineCategories = [
            { id: 1, name: 'Ayurvedic' },
            { id: 2, name: 'Unani' },
            { id: 3, name: 'Homeopathic' }
          ];
          
          return medicineCategories.filter(category => 
            category.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }),
      ];

      const [products, brands, diseases, categories] = await Promise.all(searchPromises);
      
      setResults({
        products,
        brands,
        diseases,
        categories
      });
    } catch (error) {
      console.error('Fallback search error:', error);
    }
  };

  const getTotalResults = () => {
    return Object.values(totalCounts).reduce((sum, count) => sum + count, 0) || 
           (results.products.length + results.brands.length + results.diseases.length + results.categories.length);
  };

  const tabs = [
    { key: 'all', label: 'All', count: getTotalResults() },
    { key: 'products', label: 'Products', count: totalCounts.products || results.products.length },
    { key: 'brands', label: 'Brands', count: totalCounts.brands || results.brands.length },
    { key: 'diseases', label: 'Diseases', count: totalCounts.diseases || results.diseases.length },
    { key: 'categories', label: 'Categories', count: totalCounts.categories || results.categories.length },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const loadMore = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      medicine_type: '',
      min_price: '',
      max_price: '',
      prescription_required: '',
      in_stock: true
    });
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Searching for "{query}"...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {getTotalResults()} result{getTotalResults() !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search Controls */}
      <div className="mb-6 space-y-4">
        {/* Sort and Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name A-Z</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1 border rounded text-sm hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Supplement">Supplement</option>
                  <option value="Personal Care">Personal Care</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Type</label>
                <select
                  value={filters.medicine_type}
                  onChange={(e) => handleFilterChange('medicine_type', e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">All Types</option>
                  <option value="Ayurvedic">Ayurvedic</option>
                  <option value="Unani">Unani</option>
                  <option value="Homeopathic">Homeopathic</option>
                  <option value="Allopathic">Allopathic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    className="w-full border rounded px-2 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    className="w-full border rounded px-2 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.in_stock}
                      onChange={(e) => handleFilterChange('in_stock', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">In Stock Only</span>
                  </label>
                  <select
                    value={filters.prescription_required}
                    onChange={(e) => handleFilterChange('prescription_required', e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Products</option>
                    <option value="false">No Prescription</option>
                    <option value="true">Prescription Required</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-8">
        {/* Products */}
        {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Products {totalCounts.products && `(${totalCounts.products} total)`}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  {product.brand_name && (
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
                      {product.brand_name}
                    </div>
                  )}
                  {product.relevance_score && (
                    <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {Math.round(product.relevance_score)}% match
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {(activeTab === 'all' || activeTab === 'brands') && results.brands.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Brands</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    {brand.logo_url && (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-16 h-16 mx-auto mb-2 object-contain"
                      />
                    )}
                    <h3 className="font-medium text-gray-800">{brand.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Diseases */}
        {(activeTab === 'all' || activeTab === 'diseases') && results.diseases.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Diseases & Conditions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.diseases.map((disease) => (
                <Link
                  key={disease.id}
                  to={`/products?disease=${encodeURIComponent(disease.name)}`}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🩺</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{disease.name}</h3>
                      <p className="text-sm text-gray-600">View related products</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {(activeTab === 'all' || activeTab === 'categories') && results.categories.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📂</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">Browse products</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {pagination.hasMore && getTotalResults() > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Results'}
          </button>
        </div>
      )}

      {/* No Results */}
      {getTotalResults() === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No results found for "{query}"
          </div>
          <p className="text-gray-400 mb-6">
            Try searching with different keywords, adjusting filters, or browse our categories.
          </p>
          <div className="space-y-4">
            <Link
              to={`/request-product?query=${encodeURIComponent(query)}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request this product
            </Link>
            <div className="text-sm text-gray-500">
              <p>Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {['Ayurvedic', 'Diabetes', 'Blood Pressure', 'Pain Relief', 'Vitamins'].map(term => (
                  <Link
                    key={term}
                    to={`/search?q=${encodeURIComponent(term)}`}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;