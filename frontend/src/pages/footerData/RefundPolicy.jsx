import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className=" rounded-md text-center mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">
          Return & Refund Policy
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <p>
         At HerbalMG, we take great care to ensure that all Ayurvedic and herbal products listed on our platform are delivered to you in perfect condition — sealed, safe, and directly from trusted companies.
        </p>
        <section>
          
          <span className="text-l">
            Since we deal in medicinal and health-related products, we follow a limited return and refund policy in accordance with industry norms and safety guidelines.
          </span>
          <p className="font-semibold text-gray-800 mt-2">
            Refunds are only applicable in two situations:
          </p>
          <ol className="text-gray-500">
            <li>1. If the product is damaged or broken at the time of delivery;</li>
            <li>
              2. If you have received a different product than what you ordered;
            </li>
            &nbsp; &nbsp;<span className="text-l text-black">
              {" "}
              In such cases, you may request a refund after sharing basic details of the issue. We will review the case and proceed with a refund accordingly.
            </span> <br />
            <span>
              Please note that all refund requests must be made within a short period after delivery. We encourage customers to check their orders as soon as they are received.
            </span>
            <p className="mt-2">
              <span className="text-black text-xl"> Important Notes: </span>
            </p>
            <ol className="text-gray-500">
              <li>
                1.Products once opened or used are not eligible for return or refund
              </li>
              <li>
                2. Refunds are not provided for reasons like personal preference, delay in delivery, or wrong selection while ordering
              </li>
              <li>
                3. We reserve the right to accept or reject any refund request based on the information provided
              </li>
            </ol>
          </ol>
        </section>

        <section>
          <p>
            At HerbalMG, our goal is not just to sell — but to serve with honesty and fairness. We believe in offering genuine products with transparent policies, and we thank you for trusting us with your wellness needs.
          </p>
        </section>

        <section>
          <h2 className="text-l font-semibold text-gray-800 mb-2">
            For any help or concerns, you can contact our support team at:
          </h2>

          <p className="text-gray-500">
            📧 [Your Email]
          </p>
              <p>customers support</p>
        </section>

        <p className="text-xs text-gray-500">Last updated: August 2025</p>
      </div>
    </div>
  );
};

export default RefundPolicy;
