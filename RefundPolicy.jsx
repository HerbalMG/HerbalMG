import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-8 lg:px-24">
      {/* Header */}
      <div className="bg-gray-100 p-6 sm:p-10 rounded-md shadow-md text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Refund Policy</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Please review our refund policy carefully before making a purchase.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Eligibility for Refunds</h2>
          <p>
            Refunds are available within 30 days of purchase for products that are defective, damaged, or not as described.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team at <a href="mailto:support@herbalmg.com" className="text-blue-600 underline">support@herbalmg.com</a> with your order details and reason for the request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Refund Process</h2>
          <p>
            After receiving your request, we will review your claim and notify you within 5 business days about the approval or rejection of your refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Non-Refundable Items</h2>
          <p>
            Products that have been opened, used, or damaged by the customer are generally not eligible for refunds.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Shipping Costs</h2>
          <p>
            Shipping costs are non-refundable unless the return is due to our error or a defective product.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Exchanges</h2>
          <p>
            We offer exchanges for defective or damaged products. Please contact our support team for assistance.
          </p>
        </section>

        <p className="text-xs text-gray-500">Last updated: June 2025</p>
      </div>
    </div>
  );
};

export default RefundPolicy;
