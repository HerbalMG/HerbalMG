import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const blogData = [
  {
    id: 1,
    title: 'Benefits of Herbal Medicine',
    date: '2025-05-10',
    category: 'Health',
    summary: 'Discover natural healing benefits of herbal medicine.',
    image: 'https://source.unsplash.com/600x400/?herbs',
  },
  {
    id: 2,
    title: 'Using Herbal Supplements Safely',
    date: '2025-04-20',
    category: 'Health',
    summary: 'Tips for safe and effective use of herbal supplements.',
    image: 'https://source.unsplash.com/600x400/?supplements',
  },
  {
    id: 3,
    title: 'Top 5 Herbs for Immunity',
    date: '2025-05-05',
    category: 'Immunity',
    summary: 'Boost your immunity with these powerful herbs.',
    image: 'https://source.unsplash.com/600x400/?immunity',
  },
  {
    id: 4,
    title: 'Stress Relief With Herbal Remedies',
    date: '2025-03-25',
    category: 'Stress',
    summary: 'Relax naturally with stress-relieving herbs.',
    image: 'https://source.unsplash.com/600x400/?lavender',
  },
  {
    id: 5,
    title: 'Integrating Herbs into Daily Life',
    date: '2025-02-15',
    category: 'Lifestyle',
    summary: 'Simple ways to use herbs every day.',
    image: 'https://source.unsplash.com/600x400/?tea',
  },
];

const postsPerPage = 3;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('dateDesc');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Unique category list
  const categories = ['All', ...new Set(blogData.map((b) => b.category))];

  // Filter by category
  const filteredBlogs = selectedCategory === 'All'
    ? blogData
    : blogData.filter((b) => b.category === selectedCategory);

  // Sort filtered blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'titleAsc') return a.title.localeCompare(b.title);
    if (sortBy === 'titleDesc') return b.title.localeCompare(a.title);
    if (sortBy === 'dateAsc') return new Date(a.date) - new Date(b.date);
    return new Date(b.date) - new Date(a.date); // dateDesc default
  });

  // Pagination
  const totalPages = Math.ceil(sortedBlogs.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentBlogs = sortedBlogs.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 lg:px-24 max-w-6xl mx-auto bg-white">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Our Blog Posts</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-1 rounded-full border text-sm ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="dateDesc">Date (Newest First)</option>
            <option value="dateAsc">Date (Oldest First)</option>
            <option value="titleAsc">Title (A-Z)</option>
            <option value="titleDesc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Blog Cards */}
      <div className="space-y-8">
        {currentBlogs.map(({ id, title, date, summary, image, category }) => (
          <div
            key={id}
            className="flex flex-col md:flex-row items-start gap-6 border-b pb-6"
          >
            <img
              src={image}
              alt={title}
              className="w-full md:w-1/3 h-48 object-cover rounded"
            />
            <div className="flex-1">
              <Link to={`/blog/${id}`}>
                <h2 className="text-2xl font-semibold text-blue-700 hover:underline">
                  {title}
                </h2>
              </Link>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                <span>{new Date(date).toDateString()}</span>
                <span className="italic">{category}</span>
              </div>
              <p className="mt-3 text-gray-700">{summary}</p>
              <Link
                to={`/blog/${id}`}
                className="text-blue-600 hover:underline mt-3 block"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === idx + 1 ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Blog;
