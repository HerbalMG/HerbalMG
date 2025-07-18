import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 text-center animate-fadeIn">
      {/* Medical Icon */}
      <div className="mb-6 animate-float">
        <img src="../../public/assets/9619057.webp" alt="" />
      </div>

      {/* 404 Heading */}
      <h1 className="text-7xl font-extrabold text-green-600">404</h1>

      {/* Message */}
      <p className="text-xl md:text-2xl font-medium text-orange-600 mt-4">
        Sorry, we couldn’t find that page.
      </p>
      <p className="text-orange-600 mt-2 max-w-md">
        It might have been moved, or the link you clicked may be broken.
      </p>

      {/* Home Button */}
      <Link
        to="/"
        className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-orange-600 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
