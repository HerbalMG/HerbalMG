import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ProductCardScrollable } from "../components/ProductCard";
import ProductSection from "../components/ProductSection";


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
  const [frequentlyBoughtProducts, setFrequentlyBoughtProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/product?frequently_bought=true')
      .then((res) => res.json())
      .then((data) => setFrequentlyBoughtProducts(data))
      .catch(() => setFrequentlyBoughtProducts([]));
  }, []);

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput("");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">You haven’t added anything to your cart yet.</p>
        <Link
          to="/"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>

        {/* ----------  */}
        <ProductSection
          title="Frequently Bought from Customers"
          products={frequentlyBoughtProducts}
          viewAllLink="/products?frequently_bought=true"
          emptyStateIcon="🛒"
          emptyStateTitle="No Frequently Bought Products"
          emptyStateMessage="We're analyzing customer preferences. Check back soon for popular recommendations!"
        />
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
    className="flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
  >
    <img
      src={item.image}
      alt={item.name}
      className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded"
    />
    <div className="flex-grow">
      <h3 className=" text-sm sm:text-base">{item.name}</h3>
      <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
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
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-2 py-1 border rounded text-sm"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-2 py-1 border rounded text-sm"
        >
          +
        </button>
      </div>
    </div>
    <button
  onClick={() => removeFromCart(item.id)}
  className="text-red-500 hover:text-red-700 text-sm"
>
  {/* Mobile: show "X" */}
  <span className="sm:hidden text-lg font-semibold">×</span>

  {/* Desktop: show "Remove" */}
  <span className="hidden font-semibold sm:inline">Remove</span>
</button>

  </div>
))}

    </div>

    {/* Order Summary */}
    <div className="md:col-span-1">
      <div className="border rounded-lg p-4 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">Order Summary</h2>

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
      cartItems.reduce((sum, item) => 
        sum + ((Number(item.actual_price) - Number(item.price)) * item.quantity || 0), 
      0)
    ).toFixed(2)}
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

{/* ----------  */}
        <div className="mt-8 px-4 sm:px-6">
          <ProductSection
            title="Frequently Bought from Customers"
            products={frequentlyBoughtProducts}
            viewAllLink="/products?frequently_bought=true"
            emptyStateIcon="🛒"
            emptyStateTitle="No Frequently Bought Products"
            emptyStateMessage="We're analyzing customer preferences. Check back soon for popular recommendations!"
          />
        </div>
        {/* ---------------  */}

</>

  );
}
