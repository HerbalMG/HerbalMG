import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 lg:px-24">
      {/* Header */}
      <div className=" p-6 sm:p-10 rounded-md text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Privacy Policy</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Your privacy is important to us. This policy explains how we handle your data.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. WHAT DATA DO WE COLLECT ABOUT YOU</h2>

            We collects Data for various purposes set out in this Privacy Notice.
          <ol className='text-gray-500'>

            <li><span className='text-black font-bold'>A. Contact information:</span> First and last name, email address, postal address, country, employer, phone number and other similar contact data.</li>

    <li><span className='text-black font-bold'>B. Financial information:</span> Payment instrument information, transactions, transaction history, preferences, method, mode and manner of payment, spending pattern or trends, and other similar data. </li>
 
 <li><span className='text-black font-bold'>C. Transaction information:</span> The date of the transaction, total amount, transaction history and preferences and related details.</li>
 <li><span className='text-black font-bold'>D. Product and service information:</span> Your account membership number, registration and payment information, and program-specific information, when you request products and/or services directly from us, or participate in marketing programs.</li>
 <li><span className='text-black font-bold'>E. Personal information: </span>Age, sex, date of birth, marital status, nationality, details of government identification documents provided, occupation, ethnicity, religion, travel history or any other personal information provided in responses to surveys or questionnaires.</li>

          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. HOW WE USE INFORMATION</h2>
          <ol className='text-gray-500'>
            <li><span className='text-black font-bold'>A. To Send Emails and Communications:</span> We may use your email address or other contact information to send you important updates related to your account or transaction, such as payment receipts, shipping notifications, or customer support responses. With your consent, we may also send promotional emails about new products, special offers, newsletters, or company news. You can opt out of these marketing communications at any time. </li>

            <li><span className='text-black font-bold'>B. To Improve Our Website and Services:</span> We analyze usage data and customer feedback to better understand how users interact with our website. This helps us identify areas for improvement and optimize the overall user experience. We may use cookies and other tracking technologies to collect information about your browsing behavior, such as pages visited, time spent on the site, and device information.</li>

            <li><span className='text-black font-bold'>C. To Provide Customer Service and Support: </span>
            Your information helps us respond more effectively to your customer service requests and support needs. This includes troubleshooting problems, addressing complaints, answering inquiries, and providing product or service-related assistance. Having your contact and order history readily available allows us to serve you more efficiently.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. COOKIES & TRACKING</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user behavior. Cookies are small data files that are stored on your device when you visit our website. They help us remember your preferences, enable certain site features, and collect anonymous usage data for analytics purposes.
          </p>
          <p className='text-black text-xl underline'>Why We Use Cookies:</p>
          <ol className='text-gray-500'>
            <li><span className='text-black font-bold'>A. To Improve Website Functionality: </span>Cookies help ensure that key features such as navigation, login, and shopping carts work properly.</li>
            <li><span className='text-black font-bold'>B. To Personalize Your Experience:</span>We may use cookies to remember your preferences, language settings, or previously viewed content.</li>
            <li><span className='text-black font-bold'>C. To Analyze Website Performance:</span>We use tools like Google Analytics to understand how visitors interact with our site, which helps us make data-driven improvements.</li>
            <li><span className='text-black font-bold'>D. To Support Marketing Efforts:</span>With your consent, we may use cookies to deliver relevant advertisements and measure the effectiveness of our marketing campaigns.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. DATA SHARING</h2>
          <p>
            We do not sell, trade, or rent your personal information to others. We may share data with trusted third parties who help us operate our site, so long as they agree to keep this information confidential.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. SECURITY</h2>
          <p>
            We take the security of your personal information seriously and implement a range of technical, administrative, and physical safeguards to protect it from unauthorized access, disclosure, alteration, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. YOUR RIGHTS</h2>
          <p>
            We are committed to protecting your privacy and ensuring transparency about how your personal information is handled. As a user, you have certain rights regarding your personal data, which may vary depending on your location and applicable privacy laws (such as the GDPR or CCPA). These rights include, but may not be limited to:
          </p>
          <ol className='text-gray-500'>
          <li><span className='text-black font-bold'>A. Right to Deletion: </span> You may request that we delete your personal data from our records, subject to certain legal or contractual obligations that may require us to retain some information.</li>
          </ol>
        </section>

        <p className="text-xs text-gray-500">Last updated: July 2025</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
