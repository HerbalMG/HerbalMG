import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast, { Toaster } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { images, name, actual_price, selling_price } = product;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const image =
    Array.isArray(images) && images.length > 0
      ? images[0]
      : 'https://via.placeholder.com/300x200?text=No+Image';

  const actualPriceNum = Number(actual_price ?? 0);
  const sellingPriceNum = Number(selling_price ?? 0);
  const hasDiscount = actualPriceNum > sellingPriceNum;
  const discountPercentage = hasDiscount
    ? Math.round(((actualPriceNum - sellingPriceNum) / actualPriceNum) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      ...product,
      price: sellingPriceNum,
      image: image,
      actual_price: actualPriceNum,
    });
    toast.success("Added to cart!");
  };

  return (
    <>
      <Toaster position="top-right" />
      
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[90vw] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[400px] group transition-transform duration-300 hover:scale-[1.02] mx-auto">

          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-orange-400 text-black text-xs font-semibold px-2 py-1 rounded z-10">
              -{discountPercentage}%
            </div>
          )}

          {/* Product Image */}
          <div className="flex justify-center items-center h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 overflow-hidden">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-auto object-contain transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 line-clamp-2">{name}</h3>

            {/* Price Info */}
            <div className="mt-2 mb-4 flex flex-col">
              {sellingPriceNum > 0 ? (
                <span className="text-md sm:text-lg font-bold text-green-700">
                  ₹{sellingPriceNum.toFixed(2)}
                </span>
              ) : (
                <span className="text-md sm:text-lg font-bold text-gray-500">N/A</span>
              )}
              {hasDiscount && actualPriceNum > 0 && (
                <span className="text-sm text-gray-400">
                  MRP: <span className="line-through">₹{actualPriceNum.toFixed(2)}</span>
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded transition duration-200"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;


export const ProductCardScrollable = ({ image, name, actualPrice, sellingPrice }) => {
  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-md flex-shrink-0 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img src={image} alt={name} className="h-40 w-full object-cover rounded-md mb-4" />
      <h2 className="text-lg font-semibold">{name}</h2>
      <div className="flex items-center gap-2 my-2">
        <span className="text-gray-500 line-through text-sm">₹{actualPrice}</span>
        <span className="text-red-600 font-bold">₹{sellingPrice}</span>
      </div>
      <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 w-full">
        Add to Cart
      </button>
    </div>
  );
};
