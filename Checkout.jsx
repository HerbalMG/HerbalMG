import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// GST rates for different categories
const GST_RATES = {
  'Life Saving Drugs': 0.05, // 5%
  'General Medicine': 0.12,  // 12%
  'Medical Equipment': 0.18, // 18%
  'Ayurvedic': 0.12,        // 12% for Ayurvedic
  'Homeopathic': 0.12       // 12% for Homeopathic
};

const SHIPPING_COST = 49;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
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
    setForm(prev => ({ ...prev, zip: pincode }));

    if (pincode.length === 6) {
      try {
        const response = await fetch('/src/data.json');
        const data = await response.json();
        const pincodeInfo = data.Pincodes.find(p => p.Pincode === pincode);
        
        if (pincodeInfo) {
          setPincodeData(pincodeInfo);
          setForm(prev => ({
            ...prev,
            city: pincodeInfo.City,
            state: pincodeInfo.State,
            country: 'India'
          }));
        } else {
          setError('Invalid PIN code. Please enter a valid 6-digit PIN code.');
          setPincodeData(null);
        }
      } catch (error) {
        console.error('Error fetching PIN code data:', error);
        setError('Error fetching PIN code data. Please try again.');
      }
    } else if (pincode.length > 0) {
      setError('PIN code must be 6 digits');
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
      const gstRate = GST_RATES[item.category] || 0.12; // Default to 12% if category not found
      return total + (item.price * item.quantity * gstRate);
    }, 0);
  };

  const getDiscountedSubtotal = () => {
    const subtotal = getSubtotal();
    return subtotal - subtotal * appliedPromo.discount;
  };

  const getFinalTotal = () => {
    const subtotal = getDiscountedSubtotal();
    const gst = getGSTAmount();
    return subtotal + gst + SHIPPING_COST;
  };

  const isFormValid =
    form.name &&
    form.email &&
    form.phone &&
    form.address &&
    form.zip &&
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
      // Simulate payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentSuccess(true);
      clearCart();
      // Clear the applied promo from localStorage
      localStorage.removeItem('appliedPromo');
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg mb-4">Thank you for your order, {form.name}.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
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
          <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
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
          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleInput}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="zip"
                type="text"
                placeholder="PIN Code"
                value={form.zip}
                onChange={handlePincodeChange}
                className="w-full border p-2 rounded"
                required
                maxLength={6}
              />
              {pincodeData && (
                <p className="text-sm text-green-600 mt-1">
                  {pincodeData.City}, {pincodeData.State}
                </p>
              )}
            </div>
            <input
              name="city"
              type="text"
              placeholder="City"
              value={form.city}
              onChange={handleInput}
              className="w-full border p-2 rounded"
              required
              readOnly={!!pincodeData}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="state"
              type="text"
              placeholder="State/Province"
              value={form.state}
              onChange={handleInput}
              className="w-full border p-2 rounded"
              required
              readOnly={!!pincodeData}
            />
            <input
              name="country"
              type="text"
              placeholder="Country"
              value={form.country}
              onChange={handleInput}
              className="w-full border p-2 rounded"
              required
              readOnly={!!pincodeData}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="border rounded p-4">
            <ul className="divide-y">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between py-2">
                  <div>
                    <span>{item.name} × {item.quantity}</span>
                    <p className="text-sm text-gray-500">{item.category} (GST: {GST_RATES[item.category] * 100}%)</p>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            {appliedPromo.discount > 0 && (
              <div className="text-green-600 mt-2">
                <p>Promo <strong>{appliedPromo.code}</strong> applied ({appliedPromo.description})</p>
              </div>
            )}

            <div className="space-y-2 mt-4 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              
              {appliedPromo.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{(getSubtotal() * appliedPromo.discount).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>GST</span>
                <span>₹{getGSTAmount().toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{SHIPPING_COST.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
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
                  Note: For Jaipur location only COD available
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
