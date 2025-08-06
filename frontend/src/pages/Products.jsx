// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ProductCard from '../components/ProductCard';
// import Breadcrumb from '../components/Breadcrumb';
// import ProductFilters from '../components/ProductFilters';


// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Filter states
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedDisease, setSelectedDisease] = useState('');
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [sortBy, setSortBy] = useState('name');
//   const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  
//   // Available filter options
//   const [categories, setCategories] = useState([]);
//   const [diseases, setDiseases] = useState([]);
  
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Parse URL parameters
//   const searchParams = new URLSearchParams(location.search);
//   const isSeasonalMedicine = searchParams.get('seasonal_medicine') === 'true';
//   const isTopProducts = searchParams.get('top_products') === 'true';
//   const isPeoplePreferred = searchParams.get('people_preferred') === 'true';
//   const isMaxDiscount = searchParams.get('maximum_discount') === 'true';
//   const initialCategory = searchParams.get('category') || '';
//   const initialDisease = searchParams.get('disease') || '';

//   useEffect(() => {
//     fetchProducts();
//     fetchFilterOptions();
//   }, [location.search]);

//   useEffect(() => {
//     applyFilters();
//   }, [products, selectedCategory, selectedDisease, priceRange, sortBy, showOnlyDiscounted]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       let url = 'http://localhost:3001/api/product';
//       const params = new URLSearchParams();
      
//       if (isSeasonalMedicine) {
//         params.append('seasonal_medicine', 'true');
//       }
//       if (isTopProducts) {
//         params.append('top_products', 'true');
//       }
//       if (isPeoplePreferred) {
//         params.append('people_preferred', 'true');
//       }
//       if (isMaxDiscount) {
//         params.append('maximum_discount', 'true');
//       }
      
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }
      
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Failed to fetch products');
      
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setProducts(data);
//       } else {
//         setProducts([]);
//         console.error('API error:', data.error || data);
//       }
//     } catch (err) {
//       setError(err.message);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFilterOptions = async () => {
//     try {
//       // Fetch categories
//       const categoriesResponse = await fetch('http://localhost:3001/api/category');
//       if (categoriesResponse.ok) {
//         const categoriesData = await categoriesResponse.json();
//         setCategories(Array.isArray(categoriesData) ? categoriesData : []);
//       }
      
//       // Fetch diseases (assuming there's an API endpoint for diseases)
//       // If not available, we'll use a predefined list
//       const commonDiseases = [
//         'Diabetes', 'Hypertension', 'Arthritis', 'Asthma', 'Migraine',
//         'Digestive Issues', 'Skin Problems', 'Respiratory Issues',
//         'Heart Disease', 'Kidney Problems', 'Liver Issues', 'Anxiety',
//         'Depression', 'Insomnia', 'Joint Pain', 'Back Pain'
//       ];
//       setDiseases(commonDiseases);
      
//     } catch (err) {
//       console.error('Error fetching filter options:', err);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...products];
    
//     // Category filter
//     if (selectedCategory) {
//       filtered = filtered.filter(product => 
//         product.category_id?.toString() === selectedCategory ||
//         product.category?.toLowerCase().includes(selectedCategory.toLowerCase())
//       );
//     }
    
//     // Disease filter (assuming products have disease-related tags or descriptions)
//     if (selectedDisease) {
//       filtered = filtered.filter(product => 
//         product.description?.toLowerCase().includes(selectedDisease.toLowerCase()) ||
//         product.name?.toLowerCase().includes(selectedDisease.toLowerCase()) ||
//         product.tags?.some(tag => tag.toLowerCase().includes(selectedDisease.toLowerCase()))
//       );
//     }
    
//     // Price range filter
//     if (priceRange.min) {
//       filtered = filtered.filter(product => 
//         Number(product.selling_price) >= Number(priceRange.min)
//       );
//     }
//     if (priceRange.max) {
//       filtered = filtered.filter(product => 
//         Number(product.selling_price) <= Number(priceRange.max)
//       );
//     }
    
//     // Discount filter
//     if (showOnlyDiscounted) {
//       filtered = filtered.filter(product => 
//         Number(product.actual_price) > Number(product.selling_price)
//       );
//     }
    
//     // Sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price_low':
//           return Number(a.selling_price) - Number(b.selling_price);
//         case 'price_high':
//           return Number(b.selling_price) - Number(a.selling_price);
//         case 'discount':
//           const discountA = ((Number(a.actual_price) - Number(a.selling_price)) / Number(a.actual_price)) * 100;
//           const discountB = ((Number(b.actual_price) - Number(b.selling_price)) / Number(b.actual_price)) * 100;
//           return discountB - discountA;
//         case 'name':
//         default:
//           return a.name?.localeCompare(b.name) || 0;
//       }
//     });
    
//     setFilteredProducts(filtered);
//   };

//   const clearFilters = () => {
//     setSelectedCategory('');
//     setSelectedDisease('');
//     setPriceRange({ min: '', max: '' });
//     setSortBy('name');
//     setShowOnlyDiscounted(false);
    
//     // Update URL to remove filters but keep the original product type filter
//     const newParams = new URLSearchParams();
//     if (isSeasonalMedicine) {
//       newParams.set('seasonal_medicine', 'true');
//     }
//     if (isTopProducts) {
//       newParams.set('top_products', 'true');
//     }
//     if (isPeoplePreferred) {
//       newParams.set('people_preferred', 'true');
//     }
//     if (isMaxDiscount) {
//       newParams.set('maximum_discount', 'true');
//     }
//     navigate(`/products?${newParams.toString()}`);
//   };

//   // Get page title based on URL parameters
//   const getPageTitle = () => {
//     if (isSeasonalMedicine) return 'Seasonal Products';
//     if (isTopProducts) return 'Top Products';
//     if (isPeoplePreferred) return 'People Preferred Products';
//     if (isMaxDiscount) return 'Maximum Discount Products';
//     return 'All Products';
//   };

//   const breadcrumbItems = [
//     { label: 'Home', path: '/' },
//     { 
//       label: getPageTitle(), 
//       path: '/products' 
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg text-gray-600">Loading products...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg text-red-600">Error: {error}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <Breadcrumb items={breadcrumbItems} />
      
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           {getPageTitle()}
//         </h1>
//         <p className="text-gray-600">
//           {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
//         </p>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//        <div className="lg:w-1/4">
//   <ProductFilters
//     categories={categories}
//     diseases={diseases}
//     selectedCategory={selectedCategory}
//     setSelectedCategory={setSelectedCategory}
//     selectedDisease={selectedDisease}
//     setSelectedDisease={setSelectedDisease}
//     priceRange={priceRange}
//     setPriceRange={setPriceRange}
//     showOnlyDiscounted={showOnlyDiscounted}
//     setShowOnlyDiscounted={setShowOnlyDiscounted}
//     clearFilters={clearFilters}
//   />
// </div>


//         {/* Products Grid */}
//         <div className="lg:w-3/4">
//           {/* Sort Options */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by:</label>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="name">Name (A-Z)</option>
//                 <option value="price_low">Price (Low to High)</option>
//                 <option value="price_high">Price (High to Low)</option>
//                 <option value="discount">Highest Discount</option>
//               </select>
//             </div>
//           </div>

//           {/* Products Grid */}
//           {filteredProducts.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="text-gray-500 text-lg mb-4">No products found</div>
//               <p className="text-gray-400 mb-6">
//                 Try adjusting your filters or search criteria
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import ProductFilters from '../components/ProductFilters';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Available filter options
  const [brands, setBrands] = useState([]);
  const [diseases, setDiseases] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const isSeasonalMedicine = searchParams.get('seasonal_medicine') === 'true';
  const isTopProducts = searchParams.get('top_products') === 'true';
  const isPeoplePreferred = searchParams.get('people_preferred') === 'true';
  const isMaxDiscount = searchParams.get('maximum_discount') === 'true';
  const isFrequentlyBought = searchParams.get('frequently_bought') === 'true';
  const initialBrand = searchParams.get('brand') || '';
  const initialDisease = searchParams.get('disease') || '';
  const initialSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    fetchFilterOptions();
    
    // Initialize filters from URL parameters
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialDisease) setSelectedDisease(initialDisease);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedBrand, selectedDisease, priceRange, sortBy, showOnlyDiscounted, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = 'http://localhost:3001/api/product';
      const params = new URLSearchParams();

      // Add product type filters
      if (isSeasonalMedicine) params.append('seasonal_medicine', 'true');
      if (isTopProducts) params.append('top_products', 'true');
      if (isPeoplePreferred) params.append('people_preferred', 'true');
      if (isMaxDiscount) params.append('maximum_discount', 'true');
      if (isFrequentlyBought) params.append('frequently_bought', 'true');

      // Add additional filters from URL
      if (initialBrand) params.append('brand', initialBrand);
      if (initialDisease) params.append('disease', initialDisease);
      if (initialSearch) params.append('search', initialSearch);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      // Fetch brands
      const brandsResponse = await fetch('http://localhost:3001/api/brand');
      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json();
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      }

      // Try to fetch diseases from API, fallback to predefined list
      try {
        const diseasesResponse = await fetch('http://localhost:3001/api/disease');
        if (diseasesResponse.ok) {
          const diseasesData = await diseasesResponse.json();
          if (Array.isArray(diseasesData) && diseasesData.length > 0) {
            setDiseases(diseasesData);
          } else {
            // Fallback to predefined list
            setDiseases(getPredefinedDiseases());
          }
        } else {
          setDiseases(getPredefinedDiseases());
        }
      } catch (diseaseErr) {
        console.log('Disease API not available, using predefined list');
        setDiseases(getPredefinedDiseases());
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
      // Set fallback data
      setBrands([]);
      setDiseases(getPredefinedDiseases());
    }
  };

  // const getPredefinedDiseases = () => [
  //   'Diabetes', 'Hypertension', 'Arthritis', 'Asthma', 'Migraine',
  //   'Digestive Issues', 'Skin Problems', 'Respiratory Issues',
  //   'Heart Disease', 'Kidney Problems', 'Liver Issues', 'Anxiety',
  //   'Depression', 'Insomnia', 'Joint Pain', 'Back Pain', 'Cold & Flu',
  //   'Fever', 'Headache', 'Stomach Problems', 'Constipation', 'Acidity'
  // ];

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          (product.brand && typeof product.brand === 'object' && product.brand.name?.toLowerCase().includes(query)) ||
          product.category?.toLowerCase().includes(query) ||
          (product.tags && Array.isArray(product.tags) && 
           product.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(query)))
        );
      });
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => {
        // Check if product has brand_id that matches selected brand
        if (product.brand_id?.toString() === selectedBrand) return true;
        
        // Check if product has brand name that matches
        if (product.brand && typeof product.brand === 'string') {
          return product.brand.toLowerCase().includes(selectedBrand.toLowerCase());
        }
        
        // Check if product has brand object with name
        if (product.brand && typeof product.brand === 'object' && product.brand.name) {
          return product.brand.name.toLowerCase().includes(selectedBrand.toLowerCase());
        }
        
        return false;
      });
    }

    // Disease filter
    if (selectedDisease) {
      const diseaseQuery = selectedDisease.toLowerCase();
      filtered = filtered.filter(product => {
        // Check product name
        if (product.name?.toLowerCase().includes(diseaseQuery)) return true;
        
        // Check product description
        if (product.description?.toLowerCase().includes(diseaseQuery)) return true;
        
        // Check product tags
        if (product.tags && Array.isArray(product.tags)) {
          return product.tags.some(tag => 
            typeof tag === 'string' && tag.toLowerCase().includes(diseaseQuery)
          );
        }
        
        // Check product category
        if (product.category?.toLowerCase().includes(diseaseQuery)) return true;
        
        // Check product uses/indications if available
        if (product.uses?.toLowerCase().includes(diseaseQuery)) return true;
        if (product.indications?.toLowerCase().includes(diseaseQuery)) return true;
        
        return false;
      });
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => 
        Number(product.selling_price || 0) >= Number(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => 
        Number(product.selling_price || 0) <= Number(priceRange.max)
      );
    }

    // Discount filter
    if (showOnlyDiscounted) {
      filtered = filtered.filter(product => {
        const actualPrice = Number(product.actual_price || 0);
        const sellingPrice = Number(product.selling_price || 0);
        return actualPrice > sellingPrice && sellingPrice > 0;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return Number(a.selling_price || 0) - Number(b.selling_price || 0);
        case 'price_high':
          return Number(b.selling_price || 0) - Number(a.selling_price || 0);
        case 'discount':
          const getDiscount = (product) => {
            const actual = Number(product.actual_price || 0);
            const selling = Number(product.selling_price || 0);
            return actual > selling ? ((actual - selling) / actual) * 100 : 0;
          };
          return getDiscount(b) - getDiscount(a);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSelectedBrand('');
    setSelectedDisease('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    setShowOnlyDiscounted(false);
    setSearchQuery('');

    const newParams = new URLSearchParams();
    if (isSeasonalMedicine) newParams.set('seasonal_medicine', 'true');
    if (isTopProducts) newParams.set('top_products', 'true');
    if (isPeoplePreferred) newParams.set('people_preferred', 'true');
    if (isMaxDiscount) newParams.set('maximum_discount', 'true');
    if (isFrequentlyBought) newParams.set('frequently_bought', 'true');

    navigate(`/products?${newParams.toString()}`);
  };

  const getPageTitle = () => {
    if (isSeasonalMedicine) return 'Seasonal Products';
    if (isTopProducts) return 'Top Products';
    if (isPeoplePreferred) return 'People Preferred Products';
    if (isMaxDiscount) return 'Maximum Discount Products';
    if (isFrequentlyBought) return 'Frequently Bought Products';
    return 'All Products';
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: getPageTitle(), path: '/products' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* <Breadcrumb items={breadcrumbItems} /> */}

      <div className="mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
  {getPageTitle()}
</h1>

        <p className="text-gray-600">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Filters
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters for Desktop/Tablet */}
        <div className="hidden lg:block lg:w-1/4">
          <ProductFilters
            brands={brands}
            diseases={diseases}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedDisease={selectedDisease}
            setSelectedDisease={setSelectedDisease}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            showOnlyDiscounted={showOnlyDiscounted}
            setShowOnlyDiscounted={setShowOnlyDiscounted}
            clearFilters={clearFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Products Grid Section */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="price_high">Price (High to Low)</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Products Found</h3>
                <p className="text-gray-500 text-sm max-w-md mb-4">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms to discover more options.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50  bg-opacity-50 flex justify-center items-start pt-12">
          <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
              onClick={() => setShowMobileFilters(false)}
            >
              ✕
            </button>
            <ProductFilters
              brands={brands}
              diseases={diseases}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedDisease={selectedDisease}
              setSelectedDisease={setSelectedDisease}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              showOnlyDiscounted={showOnlyDiscounted}
              setShowOnlyDiscounted={setShowOnlyDiscounted}
              clearFilters={() => {
                clearFilters();
                setShowMobileFilters(false);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
