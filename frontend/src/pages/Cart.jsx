import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import DealsOfTheDay from "../components/DealsOfTheDay";
import { ProductCardScrollable } from "../components/ProductCard";

const productSimilar = [
  {
    id: 1,
    name: 'Stylish Shoes',
    image: 'https://via.placeholder.com/200',
    actualPrice: 99.99,
    sellingPrice: 59.99
  },
  {
    id: 2,
    name: 'Casual Jacket',
    image: 'https://via.placeholder.com/200',
    actualPrice: 120.00,
    sellingPrice: 85.00
  },
  {
    id: 3,
    name: 'Wrist Watch',
    image: 'https://via.placeholder.com/200',
    actualPrice: 250.00,
    sellingPrice: 180.00
  },
  {
    id: 4,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 5,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 6,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 7,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 8,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 9,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  }
];  


export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    promoError,
    getSubtotal,
    getDiscount,
    getTotal,
    getTotalItems,
  } = useCart();

  const scrollRef = useRef(null);
  
    // Auto-scroll logic
    useEffect(() => {
      const scrollContainer = scrollRef.current;
      let scrollAmount = 0;
  
      const scrollInterval = setInterval(() => {
        if (!scrollContainer) return;
        scrollContainer.scrollBy({ left: 1, behavior: 'smooth' });
        scrollAmount += 1;
  
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, 20); // Adjust speed (lower = faster)
  
      return () => clearInterval(scrollInterval);
    }, []);

  const [promoInput, setPromoInput] = useState("");

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput("");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty</p>
        <Link
          to="/products"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>

        {/* ----------  */}
            <div className="mt-2">
          <h1 className="text-2xl font-bold mb-4">Frequently Bought from Customers </h1>
          <div className="flex overflow-x-auto gap-4">
            {productSimilar.map((product) => (
              <ProductCardScrollable key={product.id} {...product} />
            ))}
          </div>
        </div>
        {/* ---------------  */}
      </div>
    );
  }

  return ( 


//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-green-700 mb-8">Your Cart</h1>

//       <div className="grid md:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="md:col-span-2 space-y-4">
//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               className="flex items-center gap-4 p-4 border rounded-lg"
//             >
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-24 h-24 object-cover rounded"
//               />
//               <div className="flex-grow">
//                 <h3 className="font-semibold">{item.name}</h3>
//                 <p className="text-gray-600">₹{item.price}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <button
//                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                     className="px-2 py-1 border rounded"
//                   >
//                     -
//                   </button>
//                   <span>{item.quantity}</span>
//                   <button
//                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                     className="px-2 py-1 border rounded"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//               <button
//                 onClick={() => removeFromCart(item.id)}
//                 className="text-red-600 hover:text-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Order Summary */}
//         <div className="md:col-span-1">
//           <div className="border rounded-lg p-6 space-y-4">
//             <h2 className="text-xl font-semibold">Order Summary</h2>
            
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal ({getTotalItems()} items)</span>
//                 <span>₹{getSubtotal()}</span>
//               </div>
              
//               {appliedPromo && (
//                 <div className="flex justify-between text-green-600">
//   <span>Discount ({appliedPromo.code})</span>
//   <span>-₹{Math.round(getDiscount())}</span>
// </div>

//               )}
              
//               <div className="border-t pt-2">
//                 <div className="flex justify-between font-semibold">
//                   <span>Total</span>
//                   <span>₹{getTotal()}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Promo Code Section */}
//             <div className="border-t pt-4">
//               <form onSubmit={handlePromoSubmit} className="space-y-2">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={promoInput}
//                     onChange={(e) => setPromoInput(e.target.value)}
//                     placeholder="Enter promo code"
//                     className="flex-grow px-3 py-2 border rounded"
//                   />
//                   <button
//                     type="submit"
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                   >
//                     Apply
//                   </button>
//                 </div>
//                 {promoError && (
//                   <p className="text-red-600 text-sm">{promoError}</p>
//                 )}
//                 {appliedPromo && (
//                   <div className="flex items-center justify-between text-sm text-green-600">
//                     <span>Applied: {appliedPromo.code}</span>
//                     <button
//                       onClick={removePromoCode}
//                       className="text-red-600 hover:text-red-700"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 )}
//               </form>
//             </div>

//             <Link
//               to="/checkout"
//               className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Proceed to Checkout
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>

<>

<div className="max-w-6xl mx-auto sm:p-6">
  <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6 sm:mb-8 text-center sm:text-left">
    Your Cart
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
    {/* Cart Items */}
    <div className="md:col-span-2 space-y-4">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-grow text-center sm:text-left">
            <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
            <div className="text-gray-600 text-sm flex items-center gap-2">
              <span className="font-bold text-gray-900">₹{Number(item.price).toFixed(2)}</span>
              {item.actual_price && Number(item.actual_price) > Number(item.price) && (
                <>
                  <span className="line-through text-gray-400 text-xs">₹{Number(item.actual_price).toFixed(2)}</span>
                  <span className="text-green-600 text-xs font-semibold ml-1">
                    -{Math.round(((Number(item.actual_price) - Number(item.price)) / Number(item.actual_price)) * 100)}%
                  </span>
                </>
              )}
            </div>
            <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    {/* Order Summary */}
    <div className="md:col-span-1">
      <div className="border rounded-lg p-4 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Order Summary</h2>

        <div className="space-y-2 text-sm sm:text-base">
          {/* Show total actual price (MRP) if any item has a discount */}
          {cartItems.some(item => item.actual_price && Number(item.actual_price) > Number(item.price)) && (
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span className="line-through text-gray-400">₹{cartItems.reduce((sum, item) => sum + (Number(item.actual_price) * item.quantity || 0), 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Subtotal ({getTotalItems()} items)</span>
            <span>₹{getSubtotal()}</span>
          </div>
          {/* Show total discount if any */}
          {cartItems.some(item => item.actual_price && Number(item.actual_price) > Number(item.price)) && (
            <div className="flex justify-between text-green-600">
              <span>Total Discount</span>
              <span>
                -₹{(
                  cartItems.reduce((sum, item) => sum + ((Number(item.actual_price) - Number(item.price)) * item.quantity || 0), 0)
                ).toFixed(2)}
                {(() => {
                  const totalActual = cartItems.reduce((sum, item) => sum + (Number(item.actual_price) * item.quantity || 0), 0);
                  const totalDiscount = cartItems.reduce((sum, item) => sum + ((Number(item.actual_price) - Number(item.price)) * item.quantity || 0), 0);
                  return totalActual > 0 && totalDiscount > 0
                    ? ` (-${Math.round((totalDiscount / totalActual) * 100)}%)`
                    : '';
                })()}
              </span>
            </div>
          )}

          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{getTotal()}</span>
            </div>
          </div>
        </div>

        {/* Promo Code Section */}
        {/* <div className="border-t pt-4">
          <form onSubmit={handlePromoSubmit} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code"
                className="flex-grow px-3 py-2 border rounded"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-red-600 text-sm">{promoError}</p>
            )}
            {appliedPromo && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Applied: {appliedPromo.code}</span>
                <button
                  onClick={removePromoCode}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </form>
        </div> */}

        <Link
          to="/checkout"
          className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  </div>
</div>

{/* <DealsOfTheDay/> */}

{/* ----------  */}
            <div className="mt-2">
          <h1 className="text-2xl font-bold mb-4">Frequently Bought from Customers </h1>
          <div className="flex overflow-x-auto gap-4">
            {productSimilar.map((product) => (
              <ProductCardScrollable key={product.id} {...product} />
            ))}
          </div>
        </div>
        {/* ---------------  */}

</>

  );
}
