import toast from "react-hot-toast";

const offers = [
  {
    id: 1,
    code: "SAVE10",
    discount: 0.1,
    description: `Enjoy 10% off on all products when you spend ₹500 or more!
this offer applies to every category—no restrictions.
Don't miss out—shop now and save big!`,
    validUntil: "2025-12-31",
    minPurchase: 500,
  },
  {
    id: 2,
    code: "WEL5",
    discount: 0.05,
    description: `Enjoy 5% off on all products when you spend ₹500 or more!
 this offer applies to every category—no restrictions.
Don't miss out—shop now and save big!`,
    validUntil: "2025-12-31",
    minPurchase: 1000,
  },
  {
    id: 3,
    code: "AYUR20",
    discount: 0.2,
    description: `Enjoy 20% off on all products when you spend ₹2000 or more!this offer applies to every category—no restrictions.
Don't miss out—shop now and save big!`,
    validUntil: "2025-12-31",
    minPurchase: 1500,
  },
  {
    id: 4,
    code: "MED15",
    discount: 0.15,
    description: `Enjoy 15% off on all products when you spend ₹1500 or more! this offer applies to every category—no restrictions.
Don't miss out—shop now and save big!`,
    validUntil: "2025-06-20",
    minPurchase: 2000,
  },
];

export default function Offers() {
  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  //  Filter out expired offers and sort by expiration date
  const validOffers = offers
    .filter((offer) => new Date(offer.validUntil) >= today)
    .sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil));

  const isExpiringSoon = (validUntil) => {
    const expiryDate = new Date(validUntil);
    return expiryDate <= oneWeekFromNow;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-black mb-8 text-center">
        HerbalMG Discount and Offers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-md flex flex-col justify-between"
          >
            {/* Code + Copy Button */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-green-700">{offer.code}</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(offer.code);
                  toast.success(`Code ${offer.code} copied to clipboard!`);
                }}
                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 active:scale-95 transition-all duration-150"
              >
                Copy Code
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-2">
              {offer.description} *T&C
            </p>

            {/* Expiring soon warning */}
            {isExpiringSoon(offer.validUntil) && (
              <p className="text-yellow-700 text-sm font-medium mb-2">
                ⚠️ Expires Soon
              </p>
            )}

            <hr className="my-3" />
            {/* Minimum Purchase  */}
            <div className="flex justify-between text-sm text-gray-700 font-medium mt-2">
              <p>
                Min Purchase:{" "}
                <span className="text-gray-800">₹{offer.minPurchase}</span>
              </p>

              {/* Validity Date */}
              <p className="text-green-700">
                Valid Till{" "}
                {new Date(offer.validUntil).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

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
