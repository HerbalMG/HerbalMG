import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// const faqs = [
//   {
//     question: 'What payment methods do you accept?',
//     answer:
//       'We accept all major credit cards, UPI, and other popular payment gateways. Cash on Delivery (COD) is currently available only for customers in Jaipur.',
//   },
//   {
//     question: 'How long does shipping take?',
//     answer:
//       'Shipping typically takes 5–7 business days, depending on your location. You will receive tracking information once your order is dispatched.',
//   },
//   {
//     question: 'Can I return a product if I am not satisfied?',
//     answer:
//       'Yes, you can request a refund or exchange within 30 days of purchase. Please visit our Return Policy page for detailed information and instructions.',
//   },
//   {
//     question: 'Do you offer international shipping?',
//     answer:
//       'Currently, we ship only within the country. We are working on expanding our shipping options to include international deliveries in the near future.',
//   },
//   {
//     question: 'Are the medicines sold on your website genuine and safe?',
//     answer:
//       'Absolutely. We source all our medicines directly from licensed manufacturers and authorized distributors to ensure quality, safety, and authenticity.',
//   },
//   {
//     question: 'Do I need a prescription to order medicines?',
//     answer:
//       'For prescription medicines, a valid prescription from a registered medical practitioner is required at the time of order. Over-the-counter products can be purchased without a prescription.',
//   },
//   {
//     question: 'How is my personal and medical information protected?',
//     answer:
//       'We take your privacy seriously and use advanced encryption and security measures to protect your personal and medical information. For more details, please refer to our Privacy Policy.',
//   },
//   {
//     question: 'Can I consult a pharmacist or medical expert through your site?',
//     answer:
//       'Currently, we do not provide direct medical consultations. We recommend consulting your healthcare provider for personalized medical advice.',
//   },
// ];


const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [key, setKey] = useState(0); // Add key for forcing re-render
  const { t, i18n } = useTranslation('faqs');

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const changeLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      setKey(prev => prev + 1); // Force re-render
      console.log('Language changed to:', lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Force re-render when language changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [i18n.language]);

  // Get FAQ data from translations
  const faqs = t('items', { returnObjects: true });

  return (
    <div key={key} className="min-h-screen px-4 py-10 sm:px-8 lg:px-24 max-w-4xl mx-auto">
      {/* Language Switcher */}
      <div className="flex justify-end mb-6 space-x-2">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('hi')}
          className={`px-3 py-1 rounded ${i18n.language === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          हिंदी
        </button>
        <button
          onClick={() => changeLanguage('ta')}
          className={`px-3 py-1 rounded ${i18n.language === 'ta' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          தமிழ்
        </button>
        <button
          onClick={() => changeLanguage('te')}
          className={`px-3 py-1 rounded ${i18n.language === 'te' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          తెలుగు
        </button>
        <button
          onClick={() => changeLanguage('ma')}
          className={`px-3 py-1 rounded ${i18n.language === 'ma' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          मराठी
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">{t('name')}</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          {t('description', 'Find answers to the most common questions about our products and services.')}
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {Array.isArray(faqs) && faqs.map(({ question, answer }, index) => (
          <div key={`${index}-${i18n.language}`} className="border rounded-md shadow-sm">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-gray-50"
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
