import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 0,
    feedback: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRatingClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.rating || !formData.feedback) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    // TODO: Replace with actual backend call (e.g., Firebase, Supabase, etc.)
    console.log('Submitted Feedback:', formData);

    setSubmitted(true);
    setFormData({
      name: '',
      location: '',
      rating: 0,
      feedback: '',
    });
  };

  return (
    <div className="mt-16 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">✨ Share Your HerbalMG Story</h2>

      {submitted ? (
        <div className="text-green-600 font-medium text-center">Thank you for your feedback!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="location"
            placeholder="Your Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="feedback"
            placeholder="Your Feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          {/* Star Rating */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-700 mr-2">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                onClick={() => handleRatingClick(star)}
                className={`w-6 h-6 cursor-pointer transition ${
                  star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.272 3.899a1 1 0 00.95.69h4.104c.969 0 1.371 1.24.588 1.81l-3.32 2.414a1 1 0 00-.364 1.118l1.272 3.899c.3.921-.755 1.688-1.54 1.118l-3.32-2.414a1 1 0 00-1.176 0l-3.32 2.414c-.785.57-1.84-.197-1.54-1.118l1.272-3.899a1 1 0 00-.364-1.118L2.137 9.326c-.783-.57-.38-1.81.588-1.81h4.104a1 1 0 00.95-.69l1.272-3.899z" />
              </svg>
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
