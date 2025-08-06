import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ image, title, description, tags = [], link }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-[250px] sm:w-full h-[320px]">
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-2xl" />
      <div className="p-4 flex flex-col justify-between h-[calc(100%-160px)]">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-1 sm:line-clamp-1">
            {title}
          </h2>

          {/* Tags: visible on sm+, hidden on mobile */}
          {/* <div className="hidden sm:flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm bg-blue-50 text-orange-500 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div> */}

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 sm:line-clamp-3">
            {description}
          </p>
        </div>

        <Link
          to={link}
          className="inline-block text-green-500 hover:text-orange-500 text-sm font-medium mt-auto"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
