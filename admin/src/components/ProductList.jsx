import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../lib/productApi';
import { getBrands } from '../lib/brandApi';
import { getMainCategories } from '../lib/categoryApi';
import { getDiseases } from '../lib/diseaseApi';
import toast from 'react-hot-toast';
import Select from 'react-select';

const ProductList = ({ onEdit, onView }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [brandSearch, setBrandSearch] = useState('');
const [categorySearch, setCategorySearch] = useState('');

  
  // Filter options
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [diseases, setDiseases] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    brandId: '',
    categoryId: '',
    diseaseId: '',
    seasonal_medicine: '',
    frequently_bought: '',
    top_products: '',
    people_preferred: '',
    medicine_type: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      console.log('Fetching filter options...');
      
      // Fetch each option separately to identify which one is failing
      try {
        const brandsData = await getBrands();
        console.log('Brands fetched:', brandsData);
        setBrands(brandsData || []);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setBrands([]);
        toast.error('Failed to load brands');
      }
      
      try {
        const categoriesData = await getMainCategories();
        console.log('Categories fetched:', categoriesData);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
        toast.error('Failed to load categories');
      }
      
      try {
        const diseasesData = await getDiseases();
        console.log('Diseases fetched:', diseasesData);
        setDiseases(diseasesData || []);
      } catch (err) {
        console.error('Error fetching diseases:', err);
        setDiseases([]);
        toast.error('Failed to load diseases');
      }
      
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.key?.toLowerCase().includes(searchTerm) ||
        product.brand_name?.toLowerCase().includes(searchTerm) ||
        product.key_ingredients?.toLowerCase().includes(searchTerm) ||
        product.strength?.toLowerCase().includes(searchTerm)
      );
    }

    // Brand filter
    if (filters.brandId) {
      filtered = filtered.filter(product => 
        product.brand_id?.toString() === filters.brandId
      );
    }

    // Category filter - using category field (string) instead of main_category_id
    if (filters.categoryId) {
      const selectedCategory = categories.find(c => c.id.toString() === filters.categoryId);
      if (selectedCategory) {
        filtered = filtered.filter(product => 
          product.category?.toLowerCase() === selectedCategory.name?.toLowerCase()
        );
      }
    }

    // Disease filter - search in product name, description, and key ingredients
    if (filters.diseaseId) {
      const selectedDisease = diseases.find(d => d.id.toString() === filters.diseaseId);
      if (selectedDisease) {
        const diseaseTerm = selectedDisease.name?.toLowerCase();
        filtered = filtered.filter(product => 
          product.name?.toLowerCase().includes(diseaseTerm) ||
          product.description?.toLowerCase().includes(diseaseTerm) ||
          product.key_ingredients?.toLowerCase().includes(diseaseTerm) ||
          product.key?.toLowerCase().includes(diseaseTerm)
        );
      }
    }

    // Medicine type filter - handle different type formats
    if (filters.medicine_type) {
      filtered = filtered.filter(product => {
        const productType = product.medicine_type?.toLowerCase();
        const filterType = filters.medicine_type.toLowerCase();
        
        // Handle different naming conventions
        if (filterType === 'tablet' && (productType === 'tablet' || productType === null)) return true;
        if (filterType === 'capsule' && productType === 'capsule') return true;
        if (filterType === 'liquid' && (productType === 'syrup' || productType === 'liquid')) return true;
        if (filterType === 'gram' && (productType === 'powder' || productType === 'gram')) return true;
        
        return productType === filterType;
      });
    }

    // Boolean filters - handle null values properly
    if (filters.seasonal_medicine === 'true') {
      filtered = filtered.filter(product => product.seasonal_medicine === true);
    } else if (filters.seasonal_medicine === 'false') {
      filtered = filtered.filter(product => product.seasonal_medicine === false || product.seasonal_medicine === null);
    }

    if (filters.frequently_bought === 'true') {
      filtered = filtered.filter(product => product.frequently_bought === true);
    } else if (filters.frequently_bought === 'false') {
      filtered = filtered.filter(product => product.frequently_bought === false || product.frequently_bought === null);
    }

    if (filters.top_products === 'true') {
      filtered = filtered.filter(product => product.top_products === true);
    } else if (filters.top_products === 'false') {
      filtered = filtered.filter(product => product.top_products === false || product.top_products === null);
    }

    if (filters.people_preferred === 'true') {
      filtered = filtered.filter(product => product.people_preferred === true);
    } else if (filters.people_preferred === 'false') {
      filtered = filtered.filter(product => product.people_preferred === false || product.people_preferred === null);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brandId: '',
      categoryId: '',
      diseaseId: '',
      seasonal_medicine: '',
      frequently_bought: '',
      top_products: '',
      people_preferred: '',
      medicine_type: ''
    });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      toast.success('Product deleted successfully');
      fetchProducts(); // Refresh the list
    } catch (err) {
      toast.error('Failed to delete product');
      console.error('Delete error:', err);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Brand Filter */}
      <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Brand ({brands.length} available)
  </label>
  <Select
    options={brands.map(brand => ({
      value: brand.id,
      label: brand.name
    }))}
    value={filters.brandId ? {
      value: filters.brandId,
      label: brands.find(b => b.id === parseInt(filters.brandId))?.name
    } : null}
    onChange={(selectedOption) =>
      handleFilterChange('brandId', selectedOption ? selectedOption.value.toString() : '')
    }
    isClearable
    placeholder={brands.length === 0 ? "Loading brands..." : "Select brand..."}
    className="react-select-container"
    classNamePrefix="react-select"
    isDisabled={brands.length === 0}
  />
</div>



          {/* Category Filter */}
         <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Category ({categories.length} available)
  </label>
  <Select
    options={categories.map(category => ({
      value: category.id,
      label: category.name
    }))}
    value={filters.categoryId ? {
      value: filters.categoryId,
      label: categories.find(c => c.id === parseInt(filters.categoryId))?.name
    } : null}
    onChange={(selectedOption) =>
      handleFilterChange('categoryId', selectedOption ? selectedOption.value.toString() : '')
    }
    isClearable
    placeholder={categories.length === 0 ? "Loading categories..." : "Select category..."}
    className="react-select-container"
    classNamePrefix="react-select"
    isDisabled={categories.length === 0}
  />
</div>

          {/* Disease Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disease ({diseases.length} available)
            </label>
            <Select
              options={diseases.map(disease => ({
                value: disease.id,
                label: disease.name
              }))}
              value={filters.diseaseId ? {
                value: filters.diseaseId,
                label: diseases.find(d => d.id === parseInt(filters.diseaseId))?.name
              } : null}
              onChange={(selectedOption) =>
                handleFilterChange('diseaseId', selectedOption ? selectedOption.value.toString() : '')
              }
              isClearable
              placeholder={diseases.length === 0 ? "Loading diseases..." : "Select disease..."}
              className="react-select-container"
              classNamePrefix="react-select"
              isDisabled={diseases.length === 0}
            />
          </div>



          {/* Medicine Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine Type
            </label>
            <select
              value={filters.medicine_type}
              onChange={(e) => handleFilterChange('medicine_type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="syrup">Syrup/Liquid</option>
              <option value="powder">Powder/Gram</option>
            </select>
          </div>

          {/* Boolean Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seasonal Medicine
            </label>
            <select
              value={filters.seasonal_medicine}
              onChange={(e) => handleFilterChange('seasonal_medicine', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequently Bought
            </label>
            <select
              value={filters.frequently_bought}
              onChange={(e) => handleFilterChange('frequently_bought', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Top Products
            </label>
            <select
              value={filters.top_products}
              onChange={(e) => handleFilterChange('top_products', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              People Preferred
            </label>
            <select
              value={filters.people_preferred}
              onChange={(e) => handleFilterChange('people_preferred', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => {
                console.log('Debug - Current state:');
                console.log('Brands:', brands);
                console.log('Categories:', categories);
                console.log('Diseases:', diseases);
                fetchFilterOptions();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Debug Filters
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {brands.find(b => b.id === product.brand_id)?.name || 'N/A'}

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.medicine_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>₹{product.selling_price}</div>
                    {product.actual_price > product.selling_price && (
                      <div className="text-xs text-gray-500 line-through">
                        ₹{product.actual_price}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {product.seasonal_medicine && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Seasonal
                        </span>
                      )}
                      {product.frequently_bought && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Frequent
                        </span>
                      )}
                      {product.top_products && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Top
                        </span>
                      )}
                      {product.people_preferred && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Preferred
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;