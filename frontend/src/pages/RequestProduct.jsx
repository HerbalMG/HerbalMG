// import React, { useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';

// const RequestProduct = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const initialQuery = searchParams.get('query') || '';
  
//   const [formData, setFormData] = useState({
//     productName: initialQuery,
//     brandName: '',
//     category: '',
//     description: '',
//     customerName: '',
//     email: '',
//     phone: '',
//     urgency: 'normal'
//   });
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.productName.trim()) {
//       toast.error('Product name is required');
//       return;
//     }
    
//     if (!formData.customerName.trim() || !formData.email.trim() || !formData.phone.trim()) {
//       toast.error('Please fill in your contact information');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // You can create an API endpoint for product requests
//       const response = await fetch('http://localhost:3001/api/product-request', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           requestDate: new Date().toISOString(),
//           status: 'pending'
//         }),
//       });

//       if (response.ok) {
//         toast.success('Product request submitted successfully! We will contact you soon.');
//         setTimeout(() => {
//           navigate('/');
//         }, 2000);
//       } else {
//         throw new Error('Failed to submit request');
//       }
//     } catch (error) {
//       console.error('Error submitting request:', error);
//       toast.error('Failed to submit request. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <Toaster position="top-right" />
      
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">
//             Request a Product
//           </h1>
//           <p className="text-gray-600">
//             Can't find what you're looking for? Let us know and we'll try to get it for you!
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Product Information */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
//               Product Information
//             </h2>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 name="productName"
//                 value={formData.productName}
//                 onChange={handleInputChange}
//                 placeholder="Enter the product name you're looking for"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Brand Name (if known)
//                 </label>
//                 <input
//                   type="text"
//                   name="brandName"
//                   value={formData.brandName}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Himalaya, Patanjali"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select category</option>
//                   <option value="Ayurvedic">Ayurvedic</option>
//                   <option value="Homeopathic">Homeopathic</option>
//                   <option value="Unani">Unani</option>
//                   <option value="Allopathic">Allopathic</option>
//                   <option value="Supplements">Supplements</option>
//                   <option value="Personal Care">Personal Care</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Please provide any additional details about the product (strength, pack size, specific requirements, etc.)"
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
//               Contact Information
//             </h2>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Your Name *
//               </label>
//               <input
//                 type="text"
//                 name="customerName"
//                 value={formData.customerName}
//                 onChange={handleInputChange}
//                 placeholder="Enter your full name"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="your.email@example.com"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="10-digit mobile number"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Urgency */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               How urgent is this request?
//             </label>
//             <select
//               name="urgency"
//               value={formData.urgency}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="normal">Normal - Within a week</option>
//               <option value="urgent">Urgent - Within 2-3 days</option>
//               <option value="emergency">Emergency - ASAP</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <div className="flex gap-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
//                 loading
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//             >
//               {loading ? 'Submitting...' : 'Submit Request'}
//             </button>
            
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Go Back
//             </button>
//           </div>
//         </form>

//         {/* Additional Info */}
//         <div className="mt-8 p-4 bg-blue-50 rounded-md">
//           <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
//           <ul className="text-sm text-blue-700 space-y-1">
//             <li>• We'll review your request within 24 hours</li>
//             <li>• Our team will contact you with availability and pricing</li>
//             <li>• If available, we'll add the product to our inventory</li>
//             <li>• You'll be notified once the product is ready to order</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RequestProduct;


import { Link, useLocation } from 'react-router-dom';

function RequestProduct() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productQuery = params.get('query') || 'this product';

//   const suggestions = ['Mango Juice', 'Fruit Basket', 'Organic Honey'];

  const whatsappMessage = `Hello, I'm interested in a product that isn't listed:"${productQuery}" Could you please add it or let me know when it's available?`;
  const whatsappLink = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`; // Replace with your number

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center font-sans">
      <h2 className="text-3xl font-semibold text-green-700 mb-4">Didn't Find What You’re Looking For?</h2>
      <p className="text-lg text-black mb-6">
        We’re always adding new products — and your feedback helps guide what comes next! Let us know what you’re missing, and we’ll do our best to get it for you.
You're just one WhatsApp message away from shaping your shopping experience.
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
       Reach Out on WhatsApp
      </a>
    </div>
  );
}

export default RequestProduct;
