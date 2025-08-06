import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen">
      {/* Top Banner */}
      <div className="rounded-md text-center mb-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-600">Terms & Conditions</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
         Welcome to HerbalMG, your trusted platform to buy Ayurvedic and herbal medicines online in India. By using our website and placing an order, you agree to the following terms and conditions. Please read them carefully before browsing or purchasing any products.
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">1. USE OF WEBSITE </h2>
          <li>
            This website is intended for personal and lawful use to browse and purchase Ayurvedic and herbal medicines from listed companies.
          </li>
          <li>You agree not to misuse the website or attempt any unauthorized access or fraudulent activity.</li>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">2. PRODUCT INFORMATION</h2>
          <li>
            All product details, prices, and images are provided as received from respective manufacturers.
            </li>
            <li>We do not manufacture any products ourselves; we only sell company-manufactured and approved items.</li>
            <li>Product effects may vary from person to person. Please consult a medical professional before use, especially in case of medical conditions or allergies.</li>
          
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">3. ORDER ACCEPTANCE & CANCELLATION</h2>
          <li>
            Once an order is placed, it cannot be cancelled by the customer unless the item is out of stock or undeliverable.
          </li>
          <li>HerbalMG reserves the right to cancel any order due to pricing errors, stock issues, or suspicious activity.</li>
          
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">4. SHIPPING & DELIVERY</h2>
          <li>
              We aim to ship and deliver products on time, but external factors (courier delays, natural causes, etc.) may affect delivery time.
          </li>
          <li>It is the customer’s responsibility to provide correct delivery address and contact details. We are not liable for failed deliveries due to incorrect information.</li>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">5. RETURN & REFUND CONDITIONS</h2>
          <p>Refunds will be provided only in the following cases:</p>
            <li>Product received is damaged at the time of delivery</li>
            <li>Wrong product delivered</li>
            <li>Product has a manufacturer defect (e.g. broken seal, leakage, packaging issues)</li>

            <p className='font-semibold'>Important Notes:</p>
            <li>Refund requests must be made within 24 hours of delivery with valid photo/video proof.</li>
            <li>Opened or used products will not be accepted for refund.</li>
            <li>No refunds will be given for incorrect orders placed by the customer or change of mind.</li>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">6. LIMITATIONS OF LIABILITY</h2>
          <li>
            HerbalMG is not liable for any adverse effects, allergic reactions, or misuse of products. Always read product labels and consult your doctor before use.
          </li>
          <li>We do not guarantee specific health results from any product.</li>
        </section>
        
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">7. PRIVACY POLICY</h2>
          <li>
            We value your privacy. All customer data is kept confidential and is not shared with third parties without consent.
          </li>
          <li>For more details, refer to our full Privacy Policy section.</li>
        </section>
        
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">8. MODIFICATIONS</h2>
          <li>
            HerbalMG reserves the right to update or change these Terms & Conditions at any time. Continued use of the website after changes implies acceptance of the updated terms.
          </li>
        </section>

        <p className="text-xs text-gray-500">
          Last updated: August 2025
        </p>
      </div>
    </div>
  );
};

export default Terms;
