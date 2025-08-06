import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { createOrGetCustomer } from '../services/customerService';

// GST rates for different categories
const GST_RATES = {
  'Life Saving Drugs': 0.05, // 5%
  'General Medicine': 0.12,  // 12%
  'Medical Equipment': 0.18, // 18%
  'Ayurvedic': 0.12,        // 12% for Ayurvedic
  'Homeopathic': 0.12       // 12% for Homeopathic
};

function getShippingCost(total) {
  if (total < 499) {
    return 79;
  } else if (total >= 499 && total <= 999) {
    return 49;
  } else {
    return 0;
  }
}




export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate submission (in real case: send to API)
    console.log({ 
      orderId: orderDetails?.formatted_order_id || orderDetails?.id, 
      rating, 
      comment 
    });
    
    setSubmitted(true);
  };
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    house_number: '',
    area:'',
    landmark:'',
    pincode: '',
    city: '',
    state: '',
    country: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState({ code: "", discount: 0, description: "" });
  const [pincodeData, setPincodeData] = useState(null);

  useEffect(() => {
    // Get applied promo from localStorage
    const savedPromo = localStorage.getItem('appliedPromo');
    if (savedPromo) {
      setAppliedPromo(JSON.parse(savedPromo));
    }
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setForm(prev => ({ ...prev, pincode }));

    if (pincode.length === 6) {
      try {
        // Use backend API to fetch pincode data
        const response = await fetch(`http://localhost:3001/api/pincodes/${pincode}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const pincodeInfo = data[0]; // Take first result
            setPincodeData(pincodeInfo);
            setForm(prev => ({
              ...prev,
              city: pincodeInfo.District || pincodeInfo.Name,
              state: pincodeInfo.State,
              country: 'India'
            }));
            setError(''); // Clear any previous errors
          } else {
            setError('Invalid PIN code. Please enter a valid 6-digit PIN code.');
            setPincodeData(null);
          }
        } else {
          setError('Invalid PIN code. Please enter a valid 6-digit PIN code.');
          setPincodeData(null);
        }
      } catch (error) {
        console.error('Error fetching PIN code data:', error);
        setError('Error fetching PIN code data. Please try again.');
        setPincodeData(null);
      }
    } else if (pincode.length > 0 && pincode.length < 6) {
      setError('PIN code must be 6 digits');
      setPincodeData(null);
    } else {
      setError('');
      setPincodeData(null);
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const getGSTAmount = () => {
    return cartItems.reduce((total, item) => {
      const gstRate = GST_RATES[item.category] || 0.12; 
      return total + (item.price * item.quantity * gstRate);
    }, 0);
  };

  const getDiscountedSubtotal = () => {
    const subtotal = getSubtotal();
    return subtotal - subtotal * appliedPromo.discount;
  };

  const subtotal = getDiscountedSubtotal();
const shippingCost = getShippingCost(subtotal);
const getFinalTotal = () => {
  return subtotal + shippingCost;
};

  // return subtotal + shippingCost; // + gst if needed


  const isFormValid =
    form.name &&
    form.email &&
    form.phone &&
    form.house_number &&
    form.area &&
    form.landmark &&
    form.pincode &&
    form.city &&
    form.state &&
    form.country &&
    cartItems.length;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create or get customer
      const customerData = {
        name: form.name,
        email: form.email,
        mobile: form.phone,
        address: `${form.house_number}, ${form.area}, ${form.landmark}, ${form.city}, ${form.state}, ${form.country} - ${form.pincode}`,
      };

      const customer = await createOrGetCustomer(customerData);

      // Prepare order data
      const orderData = {
        customer_id: customer.id,
        total_amount: getFinalTotal(),
        address: customerData.address,
        notes: `Phone: ${form.phone}`,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Create order
      const order = await createOrder(orderData);
      
      // Store customer ID and order ID for future reference
      localStorage.setItem('customerId', customer.id);
      localStorage.setItem('lastOrderId', order.id);
      
      // Store order details for display
      setOrderDetails(order);
      
      setPaymentSuccess(true);
      clearCart();
      // Clear the applied promo from localStorage
      localStorage.removeItem('appliedPromo');
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-4">
          🎉 Your Order is Confirmed !
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-4">Thank you <span className='text-black font-bold'>{form.name}</span> for shopping with Herbalmg. Your order has been placed succesfully!</p>
        <p className="text-gray-600 mb-6">
          You will receive a confirmation email or SMS shortly with your order details.
        </p>
        <div className="bg-white px-6 py-3 rounded-md shadow-md border text-gray-800 font-mono mb-6">
        Order ID: <span className="font-semibold text-green-700">
          {orderDetails?.formatted_order_id || orderDetails?.id || 'Loading...'}
        </span>
      </div>

       <div className="w-full max-w-md mx-auto">
  {!submitted ? (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-6 rounded-lg shadow-md text-left"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Rate your experience
      </h2>

      {/* Star Rating */}
      <div className="flex items-center space-x-2 mb-4 justify-center gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:scale-110 transition-transform`}
          >
            ★
          </button>
        ))}
      </div>

      <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
        Submit
      </button>
    </form>
  ) : (
    <div className="mt-6 text-green-700 text-lg font-semibold text-center">
      🎉 Thank you for your feedback!
    </div>
  )}
</div>


        <div className="w-full max-w-md mx-auto mt-6 space-y-3 flex gap-9">
  <button
    onClick={() => navigate('/order-history')}
    className=" w-50 h-10 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
  >
    View Order History
  </button>
  <button
    onClick={() => navigate('/')}
    className=" w-50 h-10 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition"
  >
    Continue Shopping
  </button>
</div>


      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto
    ">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
        Checkout
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handlePayment}
        className="grid md:grid-cols-2 gap-6 bg-white p-6 shadow rounded"
      >
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Shipping Information</h2>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleInput}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleInput}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleInput}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="house_number"
            placeholder="House no."
            value={form.house_number}
            onChange={handleInput}
            className="w-full border p-2 rounded"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="area"
                type="text"
                placeholder="Area"
                value={form.area}
                onChange={handleInput}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <input
              name="landmark"
              type="text"
              placeholder="Landmark"
              value={form.landmark}
              onChange={handleInput}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="pincode"
                type="text"
                placeholder="PIN Code"
                value={form.pincode}
                onChange={handlePincodeChange}
                className="w-full border p-2 rounded"
                required
                // maxLength={6}
              />
              {/* {pincodeData && (
                <p className="text-sm text-green-600 mt-1">
                  {pincodeData.District || pincodeData.Name}, {pincodeData.State}
                </p>
              )} */}
            </div>
            <input
              name="city"
              type="text"
              placeholder="City"
              value={form.city}
              onChange={handleInput}
              className="w-full border p-2 rounded"
              required
              // readOnly={!!pincodeData}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="state"
              type="text"
              placeholder="State"
              value={form.state}
              onChange={handleInput}
              className="w-full border p-2 rounded"
              required
              // readOnly={!!pincodeData}
            />
            <input
              name="country"
              type="text"
              placeholder="Country"
              value={form.country}
              onChange={handleInput}
              className="w-full border p-2 rounded"
              required
              // readOnly={!!pincodeData}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Order Summary</h2>
          <div className="border rounded p-4">
            <ul className="divide-y">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between py-2">
                  <div>
                    <span>{item.name} × {item.quantity}</span>
                    {/* <p className="text-sm text-gray-500">{item.category} (GST: {GST_RATES[item.category] * 100}%)</p> */}
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            {/* {appliedPromo.discount > 0 && (
              <div className="text-green-600 mt-2">
                <p>Promo <strong>{appliedPromo.code}</strong> applied ({appliedPromo.description})</p>
              </div>
            )} */}

            <div className="space-y-2 mt-4 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              
              {/* {appliedPromo.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{(getSubtotal() * appliedPromo.discount).toFixed(2)}</span>
                </div>
              )} */}

              {/* <div className="flex justify-between text-gray-600">
                <span>GST</span>
                <span>₹{getGSTAmount().toFixed(2)}</span>
              </div> */}

              <div className="flex justify-between text-gray-600">
  <span>Shipping Cost:</span>
  <span>₹{shippingCost.toFixed(2)}</span>
</div>


              <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{getFinalTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isProcessing}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>

          {/* COD Availability Note */}
          {form.city && (
            <div className="mt-4 text-sm">
              {form.city.toLowerCase() === 'jaipur' ? (
                <p className="text-green-600">
                  Note: For Jaipur location COD available
                </p>
              ) : (
                <p className="text-red-600">
                  Note: COD is not available for {form.city}. Please use online payment methods.
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
