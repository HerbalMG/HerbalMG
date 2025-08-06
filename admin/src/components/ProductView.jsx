import React, { useState, useEffect } from 'react';
import { getProduct, getProductBySlug, getProductPrices } from '../lib/productApi';
import toast from 'react-hot-toast';

const ProductView = ({ productId, productSlug, onClose, onEdit }) => {
  const [product, setProduct] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productId, productSlug]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      let productData;
      
      if (productSlug) {
        productData = await getProductBySlug(productSlug);
      } else if (productId) {
        productData = await getProduct(productId);
      } else {
        throw new Error('No product ID or slug provided');
      }

      setProduct(productData);

      // Fetch product prices
      try {
        const pricesData = await getProductPrices(productData.id);
        setPrices(pricesData);
      } catch (priceErr) {
        console.error('Error fetching prices:', priceErr);
        setPrices([]);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="text-lg text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md">
          <div className="text-lg text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <div className="flex space-x-2">
            {/* {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )} */}
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              {/* Images */}
          {product.images && product.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="text-sm text-gray-900">{product.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                    {product.slug}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <div className="text-sm text-gray-900">{product.category}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medicine Type</label>
                  <div className="text-sm text-gray-900">{product.medicine_type}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <div className="text-sm text-gray-900">{product.brand_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Main Category</label>
                  <div className="text-sm text-gray-900">{product.main_category_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                  <div className="text-sm text-gray-900">{product.sub_category_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Disease</label>
                  <div className="text-sm text-gray-900">{product.disease_name || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product Flags</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.prescription_required}
                    disabled
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Prescription Required</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.seasonal_medicine}
                    disabled
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Seasonal Medicine</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.frequently_bought}
                    disabled
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Frequently Bought</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.top_products}
                    disabled
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Top Products</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.people_preferred}
                    disabled
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">People Preferred</label>
                </div>
              </div>
            </div>
          </div>

          

          {/* Pricing Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pricing Information</h3>
            {prices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actual Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Selling Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prices.map((price, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {price.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {price.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{price.actual_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {price.discount_percent}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{price.selling_price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Actual Price</label>
                    <div className="text-sm text-gray-900">₹{product.actual_price}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount</label>
                    <div className="text-sm text-gray-900">{product.discount_percent}%</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                    <div className="text-sm text-gray-900">₹{product.selling_price}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <div className="text-sm text-gray-900">{product.total_quantity}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Tags */}
          {product.key && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.key.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reference Books */}
          {product.reference_books && product.reference_books.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Reference Books</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.reference_books.map((book, index) => (
                  <li key={index} className="text-sm text-gray-900">{book}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {product.description}
              </div>
            </div>
          )}

          {/* Key Ingredients */}
          {product.key_ingredients && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Ingredients</h3>
              <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {product.key_ingredients}
              </div>
            </div>
          )}

          {/* Dosage */}
          {product.dosage && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Dosage</h3>
              <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {product.dosage}
              </div>
            </div>
          )}

          {/* Dietary & Lifestyle Advice */}
          {product.dietary && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Dietary & Lifestyle Advice</h3>
              <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {product.dietary}
              </div>
            </div>
          )}

          {/* Strength */}
          {product.strength && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Strength</h3>
              <div className="text-sm text-gray-900">{product.strength}</div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700">Created At</label>
              <div className="text-sm text-gray-900">
                {new Date(product.created_at).toLocaleString()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Updated At</label>
              <div className="text-sm text-gray-900">
                {new Date(product.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;