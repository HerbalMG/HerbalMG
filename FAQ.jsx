import React, { useState } from 'react';

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and other popular payment gateways.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Shipping typically takes 5-7 business days depending on your location.',
  },
  {
    question: 'Can I return a product if I am not satisfied?',
    answer:
      'Yes, you can request a refund or exchange within 30 days of purchase under our refund policy.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Currently, we only ship within the country, but we plan to offer international shipping soon.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-8 lg:px-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Frequently Asked Questions</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Find answers to the most common questions about our products and services.
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map(({ question, answer }, index) => (
          <div key={index} className="border rounded-md shadow-sm">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-gray-800">{question}</span>
              <span className="text-blue-600 font-bold text-xl select-none">
                {openIndex === index ? '-' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-6 pb-4 text-gray-700"
              >
                {answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
