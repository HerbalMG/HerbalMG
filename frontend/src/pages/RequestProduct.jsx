import { useLocation } from 'react-router-dom';

function RequestProduct() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productQuery = params.get('query') || 'this product';

//   const suggestions = ['Mango Juice', 'Fruit Basket', 'Organic Honey'];

  const whatsappMessage = `Hello, I'm interested in a product that isn't listed: "${productQuery}". Could you please add it or let me know when it's available?`;
  const whatsappLink = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`; // Replace with your number

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center font-sans">
      <h2 className="text-3xl font-semibold text-green-700 mb-4">Didn't Find What You’re Looking For?</h2>
      <p className="text-lg text-orange-600 mb-6">
        We’re always expanding our collection — and your feedback drives what comes next! If something’s missing, let us know and we’ll try to get it for you as soon as possible. You're just one WhatsApp message away from helping us improve your shopping experience.
         {/* <span className="font-bold text-black">"{productQuery}"</span>  */}
      </p>

      {/* <h3 className="text-xl font-medium text-gray-700 mb-4">You might be interested in:</h3>
      <ul className="space-y-3 mb-8">
        {suggestions.map((item, index) => (
          <li 
            key={index} 
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded shadow-sm hover:bg-gray-200 transition"
          >
            {item}
          </li>
        ))}
      </ul> */}

      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-3 rounded-md shadow-md transition"
      >
        📩 Request on WhatsApp
      </a>
    </div>
  );
}

export default RequestProduct;
