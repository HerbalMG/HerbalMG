import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { slugToText, extractIdFromSlug, createBreadcrumb, createSlug } from '../utils/slugUtils';

const BrandProducts = () => {
  const { brandSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
    fetchBrandInfo();
  }, [brandSlug]);

  useEffect(() => {
    applySorting();
  }, [products, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to extract ID from slug, otherwise use slug as brand name
      const brandId = extractIdFromSlug(brandSlug);
      const brandName = slugToText(brandSlug.replace(`-${brandId}`, ''));
      
      let url = 'http://localhost:3001/api/product';
      if (brandId) {
        url += `?brandId=${brandId}`;
      } else {
        // Try with slug first, then fallback to name
        url += `?brandSlug=${brandSlug}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        // Fallback to brand name if slug doesn't work
        if (!brandId) {
          const fallbackUrl = `http://localhost:3001/api/product?brand=${encodeURIComponent(brandName)}`;
          const fallbackResponse = await fetch(fallbackUrl);
          if (!fallbackResponse.ok) throw new Error('Failed to fetch products');
          const data = await fallbackResponse.json();
          setProducts(Array.isArray(data) ? data : []);
          return;
        }
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandInfo = async () => {
    try {
      const brandId = extractIdFromSlug(brandSlug);
      console.log('Fetching brand info for:', { brandSlug, brandId });
      
      if (brandId) {
        // Try to fetch by ID first
        console.log('Fetching brand by ID:', brandId);
        const response = await fetch(`http://localhost:3001/api/brand/${brandId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Brand data fetched by ID:', data);
          setBrand(data);
          return;
        } else {
          console.log('Failed to fetch brand by ID, status:', response.status);
        }
      }
      
      // Try to fetch by slug
      console.log('Fetching brand by slug:', brandSlug);
      const slugResponse = await fetch(`http://localhost:3001/api/brand/slug/${brandSlug}`);
      if (slugResponse.ok) {
        const data = await slugResponse.json();
        console.log('Brand data fetched by slug:', data);
        setBrand(data);
      } else {
        console.log('Failed to fetch brand by slug, status:', slugResponse.status);
        
        // Fallback: fetch all brands and find matching one
        try {
          console.log('Trying fallback: fetching all brands');
          const allBrandsResponse = await fetch('http://localhost:3001/api/brand');
          if (allBrandsResponse.ok) {
            const allBrands = await allBrandsResponse.json();
            console.log('All brands fetched:', allBrands.length);
            
            // Try to find brand by name match
            const brandName = slugToText(brandSlug);
            const matchingBrand = allBrands.find(b => 
              b.name.toLowerCase() === brandName.toLowerCase() ||
              b.name.toLowerCase().includes(brandName.toLowerCase())
            );
            
            if (matchingBrand) {
              console.log('Found matching brand:', matchingBrand);
              setBrand(matchingBrand);
            } else {
              console.log('No matching brand found, using mock');
              setBrand({
                name: brandName,
                slug: brandSlug
              });
            }
          } else {
            throw new Error('Failed to fetch all brands');
          }
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
          // Create a mock brand object from slug
          const mockBrand = {
            name: slugToText(brandSlug),
            slug: brandSlug
          };
          console.log('Using mock brand:', mockBrand);
          setBrand(mockBrand);
        }
      }
    } catch (err) {
      console.error('Error fetching brand info:', err);
      const fallbackBrand = {
        name: slugToText(brandSlug),
        slug: brandSlug
      };
      console.log('Using fallback brand:', fallbackBrand);
      setBrand(fallbackBrand);
    }
  };

  const applySorting = () => {
    let sorted = [...products];

    switch (sortBy) {
      case 'price_low':
        sorted.sort((a, b) => Number(a.selling_price || 0) - Number(b.selling_price || 0));
        break;
      case 'price_high':
        sorted.sort((a, b) => Number(b.selling_price || 0) - Number(a.selling_price || 0));
        break;
      case 'discount':
        sorted.sort((a, b) => {
          const getDiscount = (product) => {
            const actual = Number(product.actual_price || 0);
            const selling = Number(product.selling_price || 0);
            return actual > selling ? ((actual - selling) / actual) * 100 : 0;
          };
          return getDiscount(b) - getDiscount(a);
        });
        break;
      case 'name':
      default:
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }

    setSortedProducts(sorted);
  };

  const getBrandTitle = () => {
    return brand?.name || slugToText(brandSlug);
  };

  const breadcrumbItems = createBreadcrumb('brand', brandSlug, getBrandTitle());

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading {getBrandTitle()} products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Debug brand data */}
      {console.log('Current brand state:', brand)}
      {console.log('Banner URL:', brand?.banner_url)}
      
      {brand?.banner_url && (
        <div className="mb-4">
          <img
            src={brand.banner_url}
            alt={`${brand.name} banner`}
            className="w-full h-34 sm:h-48 md:h-48 object-cover rounded-md shadow"
            onLoad={() => console.log('Banner image loaded successfully')}
            onError={(e) => console.error('Banner image failed to load:', e.target.src)}
          />
        </div>
      )}
      
      {/* Show banner URL for debugging */}
      {brand && !brand.banner_url && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Debug: No banner_url found for brand "{brand.name}". Brand data: {JSON.stringify(brand)}
        </div>
      )}
      {/* <Breadcrumb items={breadcrumbItems} /> */}
      
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          {getBrandTitle()} Products
        </h1>
        <p className="text-gray-600">
          {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Sort Options */}
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

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
  <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6">
    {sortedProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
) : (
  <div className="flex items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
    <div className="text-center">
      <div className="text-5xl mb-4">🏷️</div>
      <h3 className="text-xl font-medium text-gray-600 mb-2">No Products Found for {getBrandTitle()}</h3>
      <p className="text-gray-500 text-sm max-w-md">
        This brand doesn't have any products available at the moment. We're working on expanding our inventory. Check back soon!
      </p>
    </div>
  </div>
)}

    </div>
  );
};

export default BrandProducts;