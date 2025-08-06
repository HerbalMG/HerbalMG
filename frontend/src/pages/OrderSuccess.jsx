import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const orderId = 'ORD-20250723-XYZ123';

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
    const handleRedirect = () => {
    navigate('/order-history'); // ✅ Call it like this
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();

    // Simulate submission (in real case: send to API)
    console.log({ orderId, rating, comment });

    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center py-10">
      {/* <div className="text-green-600 text-6xl animate-bounce mb-4">✅</div> */}

      <h1 className="text-4xl font-bold text-green-700 mb-2">Your Order is Confirmed !</h1>
      <p className="text-lg text-gray-700 mb-4 max-w-md">
        Thank you for shopping with Herbalmg Your order has been placed succesfully!
      </p>
      {/* <p>Your order has been placed succesfully</p> */}

      <div className="bg-white px-6 py-3 rounded-md shadow-md border text-gray-800 font-mono mb-6">
        Order ID: <span className="font-semibold text-green-700">{orderId}</span>
      </div>

      {/* Feedback Form */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-left"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Rate your experience</h2>

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

          {/* Comment */}
          {/* <textarea
            rows={4}
            placeholder="Leave a comment..."
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-300 mb-4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          /> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Submit 
          </button>
        </form>
      ) : (
        <div className="mt-6 text-green-700 text-lg font-semibold">
          🎉 Thank you for your feedback!
        </div>
      )}

      <button
  onClick={handleRedirect}
  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
>
  Go to Order History
</button>

    </div>
  );
};

export default OrderSuccess;
