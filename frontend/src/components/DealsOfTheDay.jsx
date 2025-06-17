import { useEffect, useRef, useState } from "react";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    image: "https://via.placeholder.com/200x200?text=Headphones",
    originalPrice: 199,
    discountPercent: 40,
  },
  {
    id: 2,
    name: "Smartwatch",
    image: "https://via.placeholder.com/200x200?text=Smartwatch",
    originalPrice: 149,
    discountPercent: 30,
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    image: "https://via.placeholder.com/200x200?text=Speaker",
    originalPrice: 89,
    discountPercent: 20,
  },
  {
    id: 4,
    name: "Gaming Mouse",
    image: "https://via.placeholder.com/200x200?text=Mouse",
    originalPrice: 59,
    discountPercent: 50,
  },
  {
    id: 5,
    name: "Smart Glasses",
    image: "https://via.placeholder.com/200x200?text=Glasses",
    originalPrice: 129,
    discountPercent: 35,
  },
  {
    id: 6,
    name: "Mini Drone",
    image: "https://via.placeholder.com/200x200?text=Drone",
    originalPrice: 299,
    discountPercent: 45,
  },
];

const DealsOfTheDay = () => {
  const [cart, setCart] = useState([]);
  const [countdown, setCountdown] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setCountdown(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product.id]);
    alert(`Added "${product.name}" to cart!`);
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">🔥 Deals of the Day</h2>
        <p className="text-gray-600 mt-1">
          ⏳ Time left today: <span className="font-mono text-red-600">{countdown}</span>
        </p>
      </div>

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-gray-200"
        >
          ◀
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-gray-200"
        >
          ▶
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 no-scrollbar scroll-smooth"
        >
          {products.map((product) => {
            const discountedPrice = (
              product.originalPrice *
              (1 - product.discountPercent / 100)
            ).toFixed(2);

            const isInCart = cart.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col min-w-[250px] max-w-[250px] flex-shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500 line-through">${product.originalPrice}</p>
                <p className="text-red-600 font-medium">{product.discountPercent}% OFF</p>
                <p className="text-xl font-bold text-green-600 mb-3">
                  Now: ${discountedPrice}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isInCart}
                  className={`mt-auto py-2 px-4 rounded ${
                    isInCart
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white transition`}
                >
                  {isInCart ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DealsOfTheDay;
