import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 lg:px-24">
      {/* Top Banner */}
      <div className=" p-6 sm:p-10 rounded-md text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Terms & Conditions</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Please read the terms carefully before using our services.
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. ACCEPTANCE OF TERMS</h2>
          <p>
            By accessing, browsing, or using this website (the “Service”), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions (“Terms”). These Terms govern your access to and use of all content, features, services, and functionality made available through the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. MODIFICATIONS OF TERMS</h2>
          <p>
            We reserve the right to modify, update, or revise these Terms and Conditions at any time, at our sole discretion. Any changes will be posted on this page, and the "Last Updated" date at the below of the document will reflect the effective date of those changes.
            <br />

Unless otherwise stated, modifications will become effective immediately upon posting. Your continued use of the website or services following the posting of revised Terms signifies your acceptance of those changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. USE OF WEBSITE</h2>
          <p>
            By accessing or using this website, you agree to use it solely for lawful purposes and in a manner that does not infringe upon the rights of others, restrict, or inhibit anyone else's use and enjoyment of the site.
          </p>
          <p className='text-black font-medium'>You agree not to:</p>
          <ol className='text-gray-500'>
            <li><span className='text-black font-medium'>A. </span> Use the website in any way that violates applicable local, national, or international laws or regulations.</li>
            <li><span className='text-black font-medium'>B. </span> Engage in any activity that could disable, overburden, damage, or impair the website or interfere with any other party’s use of the site.</li>
            <li><span className='text-black font-medium'>C. </span>Attempt to gain unauthorized access to any portion of the website, other accounts, or any connected systems or networks.</li>
            <li><span className='text-black font-medium'>D. </span>Use any robot, spider, or other automatic device, process, or means to access the site for any purpose, including monitoring or copying content.</li>
            <li><span className='text-black font-medium'>E. </span>Transmit or upload any material that contains viruses, malicious code, or other harmful components.</li>
            <li><span className='text-black font-medium'>F. </span>Post or transmit any content that is unlawful, defamatory, abusive, obscene, discriminatory, or otherwise objectionable.</li>
          </ol>

          <p>We reserve the right to terminate or restrict your access to the website at our sole discretion, without notice, if we believe you have violated these Terms or engaged in prohibited conduct.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. PRIVACY POLICY</h2>
          <p>
            Your privacy is important to us. Please refer to our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a> for detailed information on how we collect, use, store, and protect your personal data when you use our website or services. By using this site, you consent to the collection and use of your information in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. LIMITATIONS OF LIABIALITY</h2>
          <p>
            To the fullest extent permitted by applicable law, HerbalMG shall not be liable for any direct, indirect, incidental, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:

            <ol className='text-gray-500'>
              <li><span className='text-black'>A. </span>Your access to or use of, or inability to access or use, the website;</li>
              <li><span className='text-black'>B. </span>Any conduct or content of any third party on the website;</li>
              <li><span className='text-black'>C. </span>Any content obtained from the website;</li><li><span className='text-black'>D. </span>Unauthorized access, use, or alteration of your transmissions or content.</li>
            </ol>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. GOVERNING LAW</h2>
          <p>
            These Terms and any disputes or claims arising out of or in connection with them shall be governed by and construed in accordance with the laws of your local jurisdiction, without regard to its conflict of law principles. By using the website, you agree to submit to the exclusive jurisdiction of the courts located in your jurisdiction for the resolution of any disputes arising under these Terms.
          </p>
        </section>

        <p className="text-xs text-gray-500">
          Last updated: July 2025
        </p>
      </div>
    </div>
  );
};

export default Terms;
