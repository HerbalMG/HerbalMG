import React from 'react';
import { Link } from 'react-router-dom';

const offers = [
  {
    id: 1,
    code: "SAVE10",
    discount: 0.1,
    description: "10% off on all products",
    validUntil: "2024-12-31",
    minPurchase: 500,
    category: "All Products"
  },
  {
    id: 2,
    code: "WELCOME5",
    discount: 0.05,
    description: "5% off on first purchase",
    validUntil: "2024-12-31",
    minPurchase: 1000,
    category: "First Time Users"
  },
  {
    id: 3,
    code: "AYUR20",
    discount: 0.2,
    description: "20% off on Ayurvedic products",
    validUntil: "2024-12-31",
    minPurchase: 1500,
    category: "Ayurvedic Products"
  },
  {
    id: 4,
    code: "MED15",
    discount: 0.15,
    description: "15% off on Medical Equipment",
    validUntil: "2024-12-31",
    minPurchase: 2000,
    category: "Medical Equipment"
  },
  {
    id: 5,
    code: "MED15",
    discount: 0.15,
    description: "15% off on Medical Equipment",
    validUntil: "2025-12-31",
    minPurchase: 2000,
    category: "Medical Equipment"
  }
];

export default function Offers() {
  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Filter out expired offers and sort by expiration date
  const validOffers = offers
    .filter(offer => new Date(offer.validUntil) >= today)
    .sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil));

  const isExpiringSoon = (validUntil) => {
    const expiryDate = new Date(validUntil);
    return expiryDate <= oneWeekFromNow;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
        Special Offers & Discounts
      </h1>

      {validOffers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No active offers available at the moment.</p>
          <p className="text-gray-500 mt-2">Please check back later for new offers!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {validOffers.map((offer) => (
            <div
              key={offer.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-green-700">
                    {offer.code}
                  </h2>
                  <p className="text-gray-600">{offer.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {offer.discount * 100}% OFF
                  </span>
                  {isExpiringSoon(offer.validUntil) && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      ⚠️ Expires Soon
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>Category: {offer.category}</p>
                <p>Minimum Purchase: ₹{offer.minPurchase}</p>
                <p>Valid Until: {new Date(offer.validUntil).toLocaleDateString()}</p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Link
                  to="/cart"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Apply in Cart →
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(offer.code);
                    alert(`Code ${offer.code} copied to clipboard!`);
                  }}
                  className="text-gray-600 hover:text-gray-700"
                  title="Copy code"
                >
                  📋
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to use these offers?</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Copy the offer code you want to use</li>
          <li>Go to your cart</li>
          <li>Paste the code in the promo code section</li>
          <li>Click Apply to see your discount</li>
        </ol>
      </div>
    </div>
  );
}
