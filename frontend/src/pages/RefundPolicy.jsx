import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 lg:px-24">
      {/* Header */}
      <div className=" p-6 sm:p-10 rounded-md text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600">
          Return, Refund and Cancellation Policy
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <p>
          HerbalMG team facilitates processing correct medicines as per order
          and strives to service the medicines and products in right conditions/
          without any damage every time a consumer places an order. We also
          strongly recommend the items are checked at the time of delivery.
        </p>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            1. DEFINITION
          </h2>
          <span className="text-xl">
            {" "}
            'Return' means an action of giving back the product ordered at 1mg
            portal by the consumer. The following situations may arise which may
            cause the action of return of product:{" "}
          </span>
          <ol className="text-gray-500">
            <li>1. Product(s) delivered do not match your order;</li>
            <li>
              2. Product(s) delivered are past or near to its expiry date
              (medicines with an expiry date of less than 03 months shall be
              considered as near expiry);
            </li>{" "}
            <li>
              {" "}
              3. Product(s) delivered were damaged in transit (do not to accept
              any product which has a tampered seal):
            </li>{" "}
            &nbsp; &nbsp;<span className="text-l text-black">
              {" "}
              Note: If the product that you have received is damaged, then do
              not accept the delivery of that product. If after opening the
              package you discover that the product is damaged, the same may be
              returned for a refund. Please note that we cannot promise a
              replacement for all products as it will depend on the availability
              of the particular product, in such cases we will offer a refund.
            </span>
            <p className="mt-2">
              <span className="text-black text-xl"> The returns are subject to the below conditions:- </span>
            </p>
            <ol className="text-gray-500">
              <li>
                1. Any wrong ordering of product doesn’t qualify for Return;
              </li>
              <li>
                2. Batch number of the product being returned should match as
                mentioned on the invoice;
              </li>
              <li>
                3. Return requests arising due to change in prescription do not
                qualify for Return;
              </li>
              <li>
                {" "}
                4. Product being returned should only be in their original
                manufacturer's packaging i.e. with original price tags, labels,
                bar-code and invoice;
              </li>
              <li>
                {" "}
                5. Partially consumed strips or products do not qualify for
                Return, only fully unopened strips or products can be returned.
              </li>
            </ol>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            2. RETURN PROCESS:
          </h2>
          <p>
            <ol className="text-gray-500">
              <li>
                1. For Return intimation, please visit our contact Us page.
              </li>
              <li>
                {" "}
                2. HerbalMG team will verify the claim made by the
                customer within 3 business days from the time of
                receipt of complaint.
              </li>
              <li>
                {" "}
                3. Once the claim is verified as genuine and reasonable, 1mg will initiate the collection of product(s) to be returned.
              </li>
              <li>
                4. The customer will be required to pack the product(s) in original manufacturer’s packaging.
              </li>
              <li>
                5. Refund will be completed within 30 (thirty) days from date of
                reverse pick up (if required).
              </li>
            </ol>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            3. REFUND PROCESS:
          </h2>

          <p className="text-gray-500">
            1. In all the above cases, if the claim is found to be valid, Refund
            will be made as mentioned below: After receiving your request, we
            will review your claim and notify you within 5 business days about
            the approval or rejection of your refund.
          </p>
          <p className="text-gray-500">
            2. To request a refund, please contact our support team at{" "}
            <a
              href="mailto:support@herbalmg.com"
              className="text-blue-600 underline"
            >
              {/* info@herbalmg.com  */} email
            </a>{" "}
            with your order details and reason for the request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            4. NON-REFUNDABLE ITEMS
          </h2>
          <ol className="text-gray-500">
            <li> <span className="text-black font-bold">1.</span> Products that have been opened, used, or damaged by the customer are generally not eligible for refunds.</li>
            <li><span className="text-black font-bold"> 2. Baby Care:</span>  Bottle Nipples, Breast
            Nipple Care, Breast Pumps, Diapers, Ear Syringes, Nappy, Wet
            Reminder, Wipes and Wipe Warmers</li>
            <li> <span className="text-black font-bold">3. Food and Nutrition:</span> Health Drinks, Health Supplements  </li>
            <li> <span className="text-black font-bold"> 4. Healthcare Devices:</span>  Glucometer Lancet/Strip,
            Healthcare Devices and Kits, Surgical, Health Monitors</li>
            <li> <span className="text-black font-bold">5. Sexual Wellness:</span> Condoms, Fertility Kit/Supplement, Lubricants, Pregnancy Kits</li>
             <li> <span className="text-black font-bold"> 6. Temperature Controlled and Speciality Medicines:</span> Vials,
            Injections, Vaccines, Penfills and any other Product, requiring cold
            storage, or medicines that fall under the category of speciality
            medicines.</li>      
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            5. SHIPPING CHARGES
          </h2>
          <p className="text-gray-500">
            Shipping costs are non-refundable unless the return is due to our
            error or a defective product. Estimated shipping charges are
            calculated as per the value of the order and can be viewed in the
            cart section at the time of checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            6. CANCELLATION POLICY
          </h2>
          <p className="text-gray-500">
            <span className="text-black font-bold">Customer cancellation:</span> <br />
             The customer can cancel the order for the
            product till 1mg ship it. Orders once shipped cannot be cancelled.
            The customer can cancel the order for medical test till the
            collection of sample. </p>

            <p className="text-gray-500">
            <span className="text-black font-bold"> HerbalMG cancellation:</span> <br />
              There may be certain orders
            that HerbalMG are unable to accept and service and these may
            need to be cancelled. Some situations that may result in your order
            being cancelled include, non-availability of the product or
            quantities ordered by you or inaccuracies or errors in pricing
            information specified by our partners. </p>
            
        </section>

        <p className="text-xs text-gray-500">Last updated: July 2025</p>
      </div>
    </div>
  );
};

export default RefundPolicy;
