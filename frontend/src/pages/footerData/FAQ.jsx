import { useState } from "react";

const faqs = [
  {
    question: "What is HerbalMG?",
    answer:
      "HerbalMG is an online platform that sells Ayurvedic and herbal products from trusted companies. We aim to make quality herbal medicines easily accessible to everyone.",
  },
  {
    question: "Do you manufacture the products?",
    answer:
      "No. We only list and sell products manufactured by certified and reputed Ayurvedic and herbal brands.",
  },
  {
    question: "Are the products original and sealed?",
    answer:
      "Yes, all products sold on HerbalMG are original, directly sourced from brands, and company-sealed.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Simply browse the product, add it to your cart, and proceed to checkout. Fill in your shipping details and complete the payment.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI, credit/debit cards, net banking, and wallets.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Currently, we do not offer COD across India. However, Cash on Delivery is available for selected areas within Jaipur city. We are working to expand COD service to more locations in the future.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 3-7 working days depending on your location and courier availability.",
  },
  {
    question: "How will I know if my order is confirmed?",
    answer:
      "You will receive an order confirmation via email or SMS after successful payment.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. Once your order is shipped, you will receive a tracking link via SMS or email.",
  },
  {
    question: "What should I do if I receive a damaged product?",
    answer:
      "Please contact us within 24 hours of delivery with photos/videos. If verified, we will process a refund or replacement.",
  },
  {
    question: "What if I receive the wrong product?",
    answer:
      "If you receive a product different from what you ordered, contact us within 24 hours and we’ll assist you with a refund or exchange.",
  },
  {
    question: "Do you accept returns?",
    answer:
      "We do not accept returns unless the product is damaged, defective, or wrong. We follow a strict return policy due to product sensitivity.",
  },
  {
    question: "Is refund possible?",
    answer: `Refund is applicable only if the product is:
	•	Damaged on arrival
	•	Wrong product received
	•	Has a clear manufacturing defect`,
  },
  {
    question: "How do I request a refund?",
    answer:
      "Email or WhatsApp us with your order ID and photos. If approved, refund will be processed within 7 working days.",
  },
  {
    question: "What if the product has a manufacturer defect?",
    answer:
      "In case of a manufacturing defect (e.g. leakage, broken seal), report to us within 24 hours of delivery. We will verify and process a refund.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "Yes, you can cancel your order within a limited time after placing it, as long as it has not been processed or shipped. Once the order is dispatched, cancellation may not be possible.",
  },
  {
    question: "Is doctor’s prescription required?",
    answer:
      "Most herbal products do not need a prescription. For classical or strong formulations, consult an Ayurvedic expert.",
  },
  {
    question: "Are your products safe to use?",
    answer:
      "We sell only approved and licensed products. However, we recommend checking the label and consulting a healthcare provider if unsure.",
  },
  {
    question: "How do I contact HerbalMG customer care?",
    answer: `You can reach us at: 
📧 [Your Email]
📞 [Your WhatsApp or Phone Number]`,
  },
  {
    question: "Is my personal data safe on your website?",
    answer:
      "Yes. We follow strict data protection policies. Your personal details are never shared with third parties without your consent.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Find answers to the most common questions about our products and
          services.
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map(({ question, answer }, index) => (
          <div key={index} className="border rounded-md shadow-sm">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-gray-50"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-gray-800">{question}</span>
              <span className="text-orange-400 font-bold text-xl select-none">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-6 pb-4 text-gray-700 whitespace-pre-line"
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
