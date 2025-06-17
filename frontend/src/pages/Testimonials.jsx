import React, { useState, useEffect } from 'react';
import FeedbackForm from '../components/FeedbackForm';

// Testimonials Data
const testimonials = [
  {
    name: 'Aman Patel',
    feedback:
      'HerbalMG products have truly transformed my health. The natural ingredients are effective, and their customer support is outstanding.',
    location: 'Jaipur, India',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    feedback:
      'Top-quality products and super-fast delivery. HerbalMG is my go-to brand for natural wellness solutions.',
    location: 'Mumbai, India',
    rating: 4,
  },
  {
    name: 'Sofia Ansari',
    feedback:
      'I appreciate how gentle yet effective the remedies are. Plus, the customer service team is incredibly supportive.',
    location: 'Indore, India',
    rating: 5,
  },
  {
    name: 'Mohit',
    feedback:
      'After trying multiple herbal brands, HerbalMG stood out. Their commitment to quality and purity is unmatched.',
    location: 'Delhi, India',
    rating: 5,
  },
  {
    name: 'Ramesh',
    feedback:
      'I’ve been using HerbalMG for months now, and I feel more balanced and energized. Truly a brand I trust.',
    location: 'Bihar, India',
    rating: 4,
  },
  {
    name: 'Anubhav',
    feedback:
      'HerbalMG helped me reconnect with natural healing. I recommend it to anyone looking for holistic wellness.',
    location: 'Rajasthan, India',
    rating: 5,
  },
  {
    name: 'Nikita Sharma',
    feedback:
      'Excellent quality and the packaging was eco-friendly too. Will definitely buy again!',
    location: 'Chandigarh, India',
    rating: 4,
  },
  {
    name: 'Vikram Singh',
    feedback:
      'My whole family uses HerbalMG now. The results speak for themselves.',
    location: 'Lucknow, India',
    rating: 5,
  },
  {
    name: 'Priya Desai',
    feedback:
      'Natural, effective, and affordable. What more can you ask for?',
    location: 'Ahmedabad, India',
    rating: 4,
  },
];

// Star Rating Component
const StarRating = ({ rating }) => (
  <div className="flex mb-2">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.272 3.899a1 1 0 00.95.69h4.104c.969 0 1.371 1.24.588 1.81l-3.32 2.414a1 1 0 00-.364 1.118l1.272 3.899c.3.921-.755 1.688-1.54 1.118l-3.32-2.414a1 1 0 00-1.176 0l-3.32 2.414c-.785.57-1.84-.197-1.54-1.118l1.272-3.899a1 1 0 00-.364-1.118L2.137 9.326c-.783-.57-.38-1.81.588-1.81h4.104a1 1 0 00.95-.69l1.272-3.899z" />
      </svg>
    ))}
  </div>
);

// Modal wrapper component
const Modal = ({ children, onClose }) => {
  // Close modal on background click or ESC press
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false); // Add modal state
  const testimonialsPerPage = 6;

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const startIndex = (currentPage - 1) * testimonialsPerPage;
  const currentTestimonials = testimonials.slice(
    startIndex,
    startIndex + testimonialsPerPage
  );

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8 lg:px-24 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">
          Why Customers Choose HerbalMG
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Real Stories from Those We Serve
        </p>
      </div>

      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 transform transition-opacity duration-500 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {currentTestimonials.map(({ name, feedback, location, rating }, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
            <StarRating rating={rating} />
            <p className="text-gray-800 italic mb-4">“{feedback}”</p>
            <div>
              <h3 className="font-semibold text-blue-700">{name}</h3>
              <p className="text-gray-500 text-sm">{location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-full border ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 border-blue-600 hover:bg-blue-100'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>

      {/* Open modal button */}
      <div className="text-center mt-12">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
        >
          ✨ Share Your HerbalMG Story
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
  <Modal onClose={() => setModalOpen(false)}>
    <FeedbackForm onSuccess={() => {
      setModalOpen(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }} />
  </Modal>
)}

    </div>
  );
};


export default Testimonials;


