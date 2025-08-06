import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast, { Toaster } from "react-hot-toast";
import { generateProductUrl } from '../utils/productUtils';

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
      <Link to={generateProductUrl(product)} className="block">
        <div className="relative overflow-hidden 
          w-[calc(33.333vw-16px)] sm:w-48 md:w-56 lg:w-[200px]
          h-[200px] sm:h-[300px] md:h-[320px]
          mx-auto flex flex-col cursor-pointer"
        >

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-orange-400 text-black text-xs font-semibold px-2 py-1 rounded z-10">
              -{discountPercentage}%
            </div>
          )}

          {/* Product Image */}
          <div className="flex justify-center items-center h-[120px] sm:h-[140px] md:h-[160px] overflow-hidden">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between flex-grow sm:p-3">
            <h3 className="text-xs sm:text-sm md:text-base text-gray-800 line-clamp-2">
              {name}
            </h3>

            <div className="mt-1 mb-2 flex flex-col">
  {sellingPriceNum > 0 ? (
    <span className="text-sm sm:text-base font-bold text-green-700">
      ₹{sellingPriceNum.toFixed(2)}
    </span>
  ) : (
    <span className="text-sm sm:text-base font-bold text-gray-500">N/A</span>
  )}
  {hasDiscount && actualPriceNum > 0 && (
    <span className="text-xs text-gray-400 line-through">
      ₹{actualPriceNum.toFixed(2)}
    </span>
  )}
</div>


            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded transition duration-200"
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

// Updated ProductCardScrollable
export const ProductCardScrollable = ({ id, image, name, actualPrice, sellingPrice }) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const isInCart = cartItems.some(item => item.id === id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price: sellingPrice,
      image,
      actual_price: actualPrice,
    });
    toast.success("Added to cart!");
  };

  const handleCardClick = () => {
    // For ProductCardScrollable, we only have id, so use the simple product route
    navigate(`/product/${id}`);
  };

  return (
    <div 
      className="w-[calc(33.333vw-16px)] sm:w-48 md:w-56 lg:w-50  flex-shrink-0 cursor-pointer flex flex-col h-[200px] sm:h-[300px] md:h-[300px]"
      onClick={handleCardClick}
    >
      <img src={image} alt={name} className="h-24 sm:h-32 md:h-40 w-auto object-cover rounded-md mb-3 sm:mb-4" />
      
      <h2 className="text-xs sm:text-sm md:text-base line-clamp-2">{name}</h2>
      
      <div className="flex items-center gap-1 sm:gap-2 my-2">
        <span className="text-green-600 font-bold text-sm sm:text-base">₹{sellingPrice}</span>
        <span className="text-gray-500 line-through text-xs sm:text-sm">₹{actualPrice}</span>
      </div>

      <div className="mt-auto">
        <button
          className="bg-[#ff8f00] text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-green-700 transition duration-200 w-full"
          onClick={handleAddToCart}
        >
          {'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

