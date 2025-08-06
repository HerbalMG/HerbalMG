import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCardScrollable } from './ProductCard';

const ProductSection = ({ 
  title, 
  products, 
  viewAllLink, 
  emptyStateIcon = "📦", 
  emptyStateTitle = "No Products Available",
  emptyStateMessage = "We're currently updating our collection. Check back soon for new arrivals!"
}) => {
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black">
          {title}
        </h1>
        <Link
          to={viewAllLink}
          className="text-md font-semibold text-blue-600 cursor-pointer hover:underline"
        >
          View All
        </Link>
      </div>
      
      {products.length > 0 ? (
        <div 
          className="flex overflow-x-auto gap-3 sm:gap-4 scrollbar-hide px-1"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* Internet Explorer 10+ */
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>
          {products.map((product) => (
            <Link
              key={product.id}
              to={product.slug ? `/product/${product.slug}` : `/product/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <ProductCardScrollable
                id={product.id}
                image={
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : undefined
                }
                name={product.name}
                actualPrice={product.actual_price}
                sellingPrice={product.selling_price}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <div className="text-4xl mb-4">{emptyStateIcon}</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">{emptyStateTitle}</h3>
            <p className="text-gray-500 text-sm max-w-md">{emptyStateMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSection;