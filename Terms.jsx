import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-8 lg:px-24">
      {/* Top Banner */}
      <div className="bg-gray-100 p-6 sm:p-10 rounded-md shadow-md text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Terms & Conditions</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Please read the terms carefully before using our services.
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website, you agree to be bound by these Terms and Conditions.
            If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Modification of Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be posted on this page and are effective immediately upon posting.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Use of Website</h2>
          <p>
            You agree to use the website only for lawful purposes and not to infringe the rights of others or restrict their use of the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Privacy Policy</h2>
          <p>
            Please refer to our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a> for information on how we collect and use user data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Limitation of Liability</h2>
          <p>
            HerbalMG will not be liable for any damages arising from the use or inability to use the site or any products purchased through it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of your local jurisdiction, without regard to conflict of law principles.
          </p>
        </section>

        <p className="text-xs text-gray-500">
          Last updated: June 2025
        </p>
      </div>
    </div>
  );
};

export default Terms;
