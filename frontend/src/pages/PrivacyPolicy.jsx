import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-8 lg:px-24">
      {/* Header */}
      <div className="bg-gray-100 p-6 sm:p-10 rounded-md shadow-md text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Privacy Policy</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Your privacy is important to us. This policy explains how we handle your data.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and payment information when you make a purchase or sign up on our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Information</h2>
          <p>
            Your information is used to process transactions, send emails, improve our website, and provide customer service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Cookies & Tracking</h2>
          <p>
            We use cookies to enhance your browsing experience and gather usage data for analytics. You can disable cookies via your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to others. We may share data with trusted third parties who help us operate our site, so long as they agree to keep this information confidential.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information, though no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Your Rights</h2>
          <p>
            You may request access to, or deletion of, your personal data at any time by contacting us via our support page.
          </p>
        </section>

        <p className="text-xs text-gray-500">Last updated: June 2025</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
