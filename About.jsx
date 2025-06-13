import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section */}
      <div className="bg-blue-600 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold">Welcome to HerbalMG</h1>
        <p className="mt-2 text-lg">Your trusted source for natural wellness</p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-12 max-w-6xl mx-auto">
        {/* Left Column */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in the healing power of nature. At HerbalMG, our mission is to provide
            high-quality herbal solutions that support holistic health and well-being.
            We source ethically and craft with care to deliver the best for our customers.
          </p>
        </div>

        {/* Right Column */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-700 leading-relaxed">
            HerbalMG started as a family-owned business with a passion for herbal remedies and
            natural healing. Over the years, we've grown into a trusted brand, serving thousands
            of customers across the country. We stay rooted in tradition while embracing modern
            science to ensure safe, effective products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
