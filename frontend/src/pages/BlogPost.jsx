import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3001/api/blog/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Blog not found');
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading blog...</div>;
  }

  if (error || !blog) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold">Blog Not Found</h2>
        <button onClick={() => navigate('/blog')} className="mt-4 text-blue-500 underline">
          Go Back
        </button>
      </div>
    );
  }

  const shareUrl = window.location.href;

  // Parse blog.content if it's a string
  let parsedContent = blog.content;
  if (typeof parsedContent === 'string') {
    try {
      parsedContent = JSON.parse(parsedContent);
    } catch (e) {
      // fallback: leave as string
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:px-12">
      {/* Back Link */}
      <div className="mb-4">
        <Link to="/blog" className="text-blue-600 hover:underline text-sm">
          ← Back to Blog
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{blog.title}</h1>

      {/* Meta Row */}
      <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 border-b pb-4 mb-6 gap-2">
        <div className="flex gap-4 items-center flex-wrap">
          {/* <span>{new Date(blog.created_at).toDateString()}</span> */}
          {blog.tags && blog.tags.length > 0 && (
            <span className="flex gap-2 flex-wrap">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="bg-blue-50 text-green-700 px-2 py-0.5 rounded-full text-s font-semibold">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
        {/* Share Buttons */}
        <div className="flex gap-3 text-sm">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="text-green-600 hover:underline"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 hover:underline"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
            target="_blank"
            rel="noreferrer"
            className="text-sky-500 hover:underline"
          >
            Twitter
          </a>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Blog content */}
        <div className="lg:w-2/3">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div className="prose max-w-none text-gray-800">
            {/* Render Editor.js block content */}
            {parsedContent && parsedContent.blocks && parsedContent.blocks.length > 0 ? (
              parsedContent.blocks.map((block, idx) => {
                switch (block.type) {
                  case 'header':
                    const Tag = `h${block.data.level || 3}`;
                    return <Tag key={idx} className="mt-6 mb-2 font-bold">{block.data.text}</Tag>;
                  case 'paragraph':
                    return <p key={idx} className="mb-4">{block.data.text}</p>;
                  case 'list':
                    return (
                      <ul key={idx} className="list-disc ml-6 mb-4">
                        {block.data.items.map((item, i) => (
                          <li key={i}>{item.content || item}</li>
                        ))}
                      </ul>
                    );
                  default:
                    return null;
                }
              })
            ) : (
              <p>{typeof blog.content === 'string' ? blog.content : JSON.stringify(blog.content)}</p>
            )}
          </div>
        </div>

        {/* Right: Related Blogs (optional, could fetch more blogs and filter by tag) */}
      </div>
    </div>
  );
};

export default BlogPost;
