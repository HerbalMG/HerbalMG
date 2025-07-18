import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // Ensure the path is correct
// import BrandFilterAside from '../components/BrandFilterAside'; // Uncomment if needed

import {Banners} from '../components/Banner'

const BrandProducts = () => {
  const { brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch products for this brand
    fetch(`http://localhost:3001/api/product?brandId=${brandId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch brand info
    fetch(`http://localhost:3001/api/brand/${brandId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setBrand(data))
      .catch(() => {});
  }, [brandId]);

  // Sort products based on sortBy
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = Number(a.selling_price);
    const priceB = Number(b.selling_price);
    const discountA =
      Number(a.actual_price) && Number(a.selling_price)
        ? (Number(a.actual_price) - Number(a.selling_price)) /
          Number(a.actual_price)
        : 0;
    const discountB =
      Number(b.actual_price) && Number(b.selling_price)
        ? (Number(b.actual_price) - Number(b.selling_price)) /
          Number(b.actual_price)
        : 0;

    if (sortBy === 'high') return priceB - priceA;
    if (sortBy === 'low') return priceA - priceB;
    if (sortBy === 'discount') return discountB - discountA;
    return 0;
  });

  if (loading)
    return <div className="p-10 text-center">Loading products...</div>;

  if (error)
    return (
      <div className="p-10 text-center text-red-500">{error}</div>
    );

  return (
    <>
    {/* Show brand banner if available */}
    {brand && brand.banner_url && (
      <div className="w-full max-w-6xl mx-auto mt-4">
        <img
          src={brand.banner_url}
          alt={brand.name + ' banner'}
          className="w-full h-48 object-cover rounded shadow mb-6"
        />
      </div>
    )}
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Filter Sidebar - Uncomment if needed */}
        {/* <div className="md:w-1/4 w-full mb-6 md:mb-0">
          <BrandFilterAside
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
          />
        </div> */}

        {/* Right: Product Listing */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2 text-green-700 text-center md:text-left">
            All Products in {brand ? brand.name : 'Brand'}
          </h1>

          {/* Header: Total Products & Sort By */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 mb-6">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Total Products: {products.length}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="sortBy"
                className="text-sm font-medium text-gray-700"
              >
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">Default</option>
                <option value="high">Price: High to Low</option>
                <option value="low">Price: Low to High</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-gray-400 text-center md:text-left">
              No products found for this brand.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default BrandProducts;
