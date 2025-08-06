// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// // Dummy data for testing
// // const initialCartItems = [
// //   {
// //     id: 1,
// //     name: "Organic Ashwagandha Powder",
// //     price: 599,
// //     quantity: 2,
// //     imageUrl: "https://source.unsplash.com/100x100/?herbs",
// //     description: "Pure organic ashwagandha root powder for stress relief and immunity",
// //     category: "Ayurvedic"
// //   },
// //   {
// //     id: 2,
// //     name: "Herbal Toothpaste",
// //     price: 249,
// //     quantity: 1,
// //     imageUrl: "https://source.unsplash.com/100x100/?toothpaste",
// //     description: "Natural herbal toothpaste with neem and clove",
// //     category: "Ayurvedic"
// //   },
// //   {
// //     id: 3,
// //     name: "Tulsi Green Tea",
// //     price: 399,
// //     quantity: 3,
// //     imageUrl: "https://source.unsplash.com/100x100/?tea",
// //     description: "Organic tulsi green tea for immunity and wellness",
// //     category: "Ayurvedic"
// //   }
// // ];

// export const useCart = () => useContext(CartContext);

// // Sample offers data
// // const offers = [
// //   {
// //     id: 1,
// //     code: "SAVE10",
// //     discount: 0.1,
// //     description: "10% off on all products",
// //     validUntil: "2024-12-31",
// //     minPurchase: 500,
// //     category: "All Products"
// //   },
// //   {
// //     id: 2,
// //     code: "WELCOME5",
// //     discount: 0.05,
// //     description: "5% off on first purchase",
// //     validUntil: "2024-12-31",
// //     minPurchase: 1000,
// //     category: "First Time Users"
// //   },
// //   {
// //     id: 3,
// //     code: "AYUR20",
// //     discount: 0.2,
// //     description: "20% off on Ayurvedic products",
// //     validUntil: "2024-12-31",
// //     minPurchase: 1500,
// //     category: "Ayurvedic Products"
// //   },
// //   {
// //     id: 4,
// //     code: "MED15",
// //     discount: 0.15,
// //     description: "15% off on Medical Equipment",
// //     validUntil: "2024-12-31",
// //     minPurchase: 2000,
// //     category: "Medical Equipment"
// //   },
// //   {
// //     id: 5,
// //     code: "MED15",
// //     discount: 0.15,
// //     description: "15% off on Medical Equipment",
// //     validUntil: "2025-12-31",
// //     minPurchase: 2000,
// //     category: "Medical Equipment"
// //   }
// // ];

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem("cart");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [appliedPromo, setAppliedPromo] = useState(() => {
//     try {
//       const savedPromo = localStorage.getItem("appliedPromo");
//       if (savedPromo) {
//         const promo = JSON.parse(savedPromo);
//         // Check if the saved promo is still valid
//         const offer = offers.find(o => o.code === promo?.code);
//         if (offer && new Date(offer.validUntil) >= new Date()) {
//           return {
//             ...promo,
//             validUntil: offer.validUntil
//           };
//         }
//         // If promo is expired, remove it from localStorage
//         localStorage.removeItem("appliedPromo");
//       }
//     } catch (error) {
//       console.error("Error loading saved promo:", error);
//       localStorage.removeItem("appliedPromo");
//     }
//     return null;
//   });

//   const [promoError, setPromoError] = useState("");

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Save applied promo to localStorage whenever it changes
//   useEffect(() => {
//     if (appliedPromo) {
//       localStorage.setItem("appliedPromo", JSON.stringify(appliedPromo));
//     } else {
//       localStorage.removeItem("appliedPromo");
//     }
//   }, [appliedPromo]);

//   // Check promo code validity periodically
//   useEffect(() => {
//     const checkPromoValidity = () => {
//       if (appliedPromo?.code) {
//         const offer = offers.find(o => o.code === appliedPromo.code);
//         if (!offer || new Date(offer.validUntil) < new Date()) {
//           setAppliedPromo(null);
//           setPromoError("Your applied promo code has expired");
//         }
//       }
//     };

//     // Check immediately
//     checkPromoValidity();

//     // Then check every minute
//     const interval = setInterval(checkPromoValidity, 60000);
//     return () => clearInterval(interval);
//   }, [appliedPromo]);

//   const addToCart = (product) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find((item) => item.id === product.id);
//       if (existingItem) {
//         return prevItems.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prevItems, { ...product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCartItems((prevItems) =>
//       prevItems.filter((item) => item.id !== productId)
//     );
//   };

//   const updateQuantity = (productId, quantity) => {
//     if (quantity < 1) return;
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     setAppliedPromo(null);
//   };

//   const validatePromoCode = (code) => {
//     if (!code) {
//       setPromoError("Please enter a promo code");
//       return false;
//     }

//     const offer = offers.find((o) => o.code === code.toUpperCase());
//     if (!offer) {
//       setPromoError("Invalid promo code");
//       return false;
//     }

//     const now = new Date();
//     const validUntil = new Date(offer.validUntil);
//     if (now > validUntil) {
//       setPromoError("Promo code has expired");
//       return false;
//     }

//     const subtotal = cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//     if (subtotal < offer.minPurchase) {
//       setPromoError(`Minimum purchase amount of ₹${offer.minPurchase} required`);
//       return false;
//     }

//     if (offer.category !== "All Products") {
//       const hasCategoryItems = cartItems.some(
//         (item) => item.category === offer.category
//       );
//       if (!hasCategoryItems) {
//         setPromoError(`This code is only valid for ${offer.category}`);
//         return false;
//       }
//     }

//     // Check if the same code is already applied
//     if (appliedPromo?.code === offer.code) {
//       setPromoError("This promo code is already applied");
//       return false;
//     }

//     return true;
//   };

//   const applyPromoCode = (code) => {
//     setPromoError("");
//     if (validatePromoCode(code)) {
//       const offer = offers.find((o) => o.code === code.toUpperCase());
//       setAppliedPromo({
//         code: offer.code,
//         discount: offer.discount,
//         description: offer.description,
//         validUntil: offer.validUntil
//       });
//       return true;
//     }
//     return false;
//   };

//   const removePromoCode = () => {
//     setAppliedPromo(null);
//     setPromoError("");
//   };

//   const getSubtotal = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   const getDiscount = () => {
//     if (!appliedPromo) return 0;
//     return getSubtotal() * appliedPromo.discount;
//   };

//   const getTotal = () => {
//     return getSubtotal() - getDiscount();
//   };

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         appliedPromo,
//         applyPromoCode,
//         removePromoCode,
//         promoError,
//         getSubtotal,
//         getDiscount,
//         getTotal,
//         getTotalItems,
//         // offers,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };


import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.size === product.size
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };



  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotal = () => getSubtotal(); 

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
        getTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
