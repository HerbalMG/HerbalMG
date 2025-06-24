import React, { useState, useEffect } from 'react';
import BlogEditor from '../components/BlogEditor';
import BlogReader from '../components/BlogReader'; // <-- Make sure this file exists

const BLOGS_KEY = 'admin_blogs';

const getBlogs = () => {
  const blogs = localStorage.getItem(BLOGS_KEY);
  return blogs ? JSON.parse(blogs) : [];
};

const saveBlogs = (blogs) => {
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    setBlogs(getBlogs());
  }, []);

  const handleSave = (blog) => {
    let updatedBlogs;
    if (editingBlog) {
      updatedBlogs = blogs.map((b) => (b.id === blog.id ? blog : b));
    } else {
      blog.id = Date.now();
      blog.date = new Date().toLocaleDateString();
      updatedBlogs = [blog, ...blogs];
    }
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
    setShowEditor(false);
    setEditingBlog(null);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowEditor(true);
  };

  const handleDelete = (id) => {
    const updatedBlogs = blogs.filter((b) => b.id !== id);
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
  };

  const handleNew = () => {
    setEditingBlog(null);
    setShowEditor(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blogs</h2>
        {!selectedBlog && !showEditor && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleNew}
          >
            New Blog
          </button>
        )}
      </div>

      {selectedBlog ? (
        <BlogReader blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
      ) : showEditor ? (
        <BlogEditor
          blog={editingBlog || {}}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingBlog(null);
          }}
        />
      ) : (
        <div className="space-y-4">
          {blogs.length === 0 && <div>No blogs yet.</div>}
          {blogs.map((blog) => (
            <div key={blog.id} className="p-4 bg-white shadow rounded space-y-2">
              {blog.banner && (
                <img
                  src={blog.banner}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded"
                />
              )}

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{blog.title}</div>
                  <div className="text-gray-500 text-sm">{blog.des}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Published on: {blog.date || 'N/A'}
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    className="text-green-600 underline"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    Read
                  </button>
                  <button
                    className="text-blue-500 underline"
                    onClick={() => handleEdit(blog)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 underline"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
