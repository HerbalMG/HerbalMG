// src/components/BlogCard.jsx
import React from 'react';

const BlogCard = ({ image, title, description, tags, link }) => {
  return (
    <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-blue-50 text-orange-500 px-2 py-1 rounded-full"
            >
              #{tag}    
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        <a
          href={link}
          className="inline-block text-green-500 hover:text-orange-500 text-sm font-medium"
        >
          Read More →
        </a>
      </div>
    </div>
  );
};

export default BlogCard;
