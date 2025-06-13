// Base discounts
const baseDiscounts = [
  { code: "SAVE10", discount: 0.1, description: "10% off" },
  // { code: "SAVE20", discount: 0.2, description: "20% off" },
  { code: "WELCOME5", discount: 0.05, description: "5% off" },
];


// Helper to determine if offer is still valid
function isOfferValid(offer) {
  const today = new Date();
  const expiry = new Date(offer.validTill);
  return expiry >= today;
}

// Merge base discounts with valid offers that match known discount codes
export const availableDiscounts = [
  ...baseDiscounts,
  ...offers
    .filter(isOfferValid)
    .filter((offer) =>
      baseDiscounts.some((d) => d.code.toUpperCase() === offer.code.toUpperCase())
    )
    .map((offer) => {
      const base = baseDiscounts.find(
        (d) => d.code.toUpperCase() === offer.code.toUpperCase()
      );
      return {
        code: offer.code,
        discount: base.discount,
        description: offer.description,
      };
    }),
];

// Helper to get discount by code
export function getDiscountForCode(code) {
  if (!code) return { discount: 0, description: "" };
  const upperCode = code.toUpperCase();
  const found = availableDiscounts.find((d) => d.code.toUpperCase() === upperCode);
  return found || { discount: 0, description: "" };
}
