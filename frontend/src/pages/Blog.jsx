import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const postsPerPage = 3;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('dateDesc');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:3001/api/blog')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Unique category list
  const categories = ['All', ...new Set(blogs.map((b) => b.category || b.tags?.[0] || 'Other'))];

  // Filter by category
  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter((b) => (b.category || b.tags?.[0] || 'Other') === selectedCategory);

  // Sort filtered blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'titleAsc') return a.title.localeCompare(b.title);
    if (sortBy === 'titleDesc') return b.title.localeCompare(a.title);
    if (sortBy === 'dateAsc') return new Date(a.created_at) - new Date(b.created_at);
    return new Date(b.created_at) - new Date(a.created_at); // dateDesc default
  });

  // Pagination
  const totalPages = Math.ceil(sortedBlogs.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentBlogs = sortedBlogs.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen px-4 sm:px-8 max-w-6xl mx-auto ">
      <h1 className="text-3xl font-bold text-green-600 mb-8">Our Blog Posts</h1>

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
                  ? 'bg-orange-400 text-white'
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
      {loading && <div className="text-center text-gray-500">Loading blogs...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && currentBlogs.length > 0 && (
        <div className="space-y-8">
          {currentBlogs.map(({ id, title, created_at, short_description, image_url, tags }) => (
            <div
              key={id}
              className="flex flex-col md:flex-row items-start gap-6 border-b pb-6"
            >
              <img
                src={image_url}
                alt={title}
                className="w-full md:w-1/3 h-48 object-cover rounded"
              />
              <div className="flex-1">
                <Link to={`/blog/${id}`}>
                  <h2 className="text-2xl font-semibold text-orange-600 hover:underline">
                    {title}
                  </h2>
                </Link>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                  {/* <span>{new Date(created_at).toDateString()}</span> */}
                  <span className="flex gap-2 flex-wrap">
                    {tags && tags.length > 0
                      ? tags.map((tag, idx) => (
                          <span key={idx} className="bg-blue-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {tag}
                          </span>
                        ))
                      : <span className="italic">Other</span>}
                  </span>
                </div>
                <p className="mt-3 text-gray-700">{short_description}</p>
                <Link
                  to={`/blog/${id}`}
                  className="text-green-600 hover:underline mt-3 block"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && currentBlogs.length === 0 && (
        <div className="flex items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {selectedCategory === 'All' ? 'No Blogs Available' : `No Blogs Found in "${selectedCategory}"`}
            </h3>
            <p className="text-gray-500 text-sm max-w-md mb-4">
              {selectedCategory === 'All' 
                ? 'We\'re working on creating informative content about Ayurveda and health. Check back soon for insightful articles!'
                : 'Try selecting a different category or check back later for new content in this category.'
              }
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                View All Blogs
              </button>
            )}
          </div>
        </div>
      )}

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
