import React from 'react';

const testimonials = [
  {
    name: 'Alice Johnson',
    feedback:
      'HerbalMG products transformed my health! The natural ingredients and customer support are top-notch.',
    location: 'New York, USA',
  },
  {
    name: 'Rahul Mehta',
    feedback:
      'Excellent quality and quick delivery. I highly recommend HerbalMG to anyone looking for natural wellness solutions.',
    location: 'Mumbai, India',
  },
  {
    name: 'Sofia Lopez',
    feedback:
      'I love how effective and gentle their herbal remedies are. Customer service is friendly and helpful too.',
    location: 'Madrid, Spain',
  },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8 lg:px-24 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">What Our Customers Say</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Real feedback from our valued customers.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map(({ name, feedback, location }, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
            <p className="text-gray-800 italic mb-4">“{feedback}”</p>
            <div>
              <h3 className="font-semibold text-blue-700">{name}</h3>
              <p className="text-gray-500 text-sm">{location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
