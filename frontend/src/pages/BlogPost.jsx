import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const blogData = [
  {
    id: 1,
    title: 'Benefits of Herbal Medicine',
    date: '2025-05-10',
    content: `Herbal medicine promotes wellness naturally. It includes a variety of plants and natural ingredients used in healing. Learn more at [WHO Guidelines](https://www.who.int).`,
    category: 'Health',
    image: 'https://source.unsplash.com/800x400/?herbs',
  },
  {
    id: 2,
    title: 'Using Herbal Supplements Safely',
    date: '2025-04-20',
    content: `Herbal supplements must be used carefully. Always consult a physician before using.
    In today’s fast-paced world, maintaining a strong immune system is more important than ever. Your immune system is your body’s defense against infections and illnesses. Luckily, boosting your immunity doesn’t have to be complicated.

Eat a Balanced Diet:
Incorporate plenty of fruits, vegetables, whole grains, and lean proteins into your meals. Foods rich in vitamins C and D, zinc, and antioxidants help support immune function.

Stay Hydrated:
Drinking enough water helps your body flush out toxins and keeps your cells functioning optimally.

Get Enough Sleep:
Quality sleep is crucial for immune health. Aim for 7-9 hours per night to allow your body to repair and regenerate.

Exercise Regularly:
Physical activity increases blood flow, helping immune cells circulate and do their job more effectively.

Manage Stress:
Chronic stress can weaken your immune system. Practice relaxation techniques like meditation, deep breathing, or yoga to keep stress levels in check.

By making these simple lifestyle changes, you can naturally strengthen your immune system and improve your overall health. Start small, stay consistent, and your body will thank you!`
    ,
    category: 'Health',
    image: 'https://source.unsplash.com/800x400/?supplements',
  },
  {
    id: 3,
    title: 'Top 5 Herbs for Immunity',
    date: '2025-05-05',
    content: `These herbs can improve your immunity: Turmeric, Ginger, Garlic, Echinacea, and Tulsi.`,
    category: 'Immunity',
    image: 'https://source.unsplash.com/800x400/?immunity',
  },
];

const BlogPost = () => {
  const { id } = useParams();
  const blog = blogData.find((b) => b.id === parseInt(id));
  const navigate = useNavigate();

  if (!blog) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold">Blog Not Found</h2>
        <button onClick={() => navigate('/blog')} className="mt-4 text-blue-500 underline">
          Go Back
        </button>
      </div>
    );
  }

  const related = blogData.filter(
    (b) => b.category === blog.category && b.id !== blog.id
  );

  const shareUrl = window.location.href;

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
        <div className="flex gap-4">
          <span>{new Date(blog.date).toDateString()}</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
            {blog.category}
          </span>
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
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div className="prose max-w-none text-gray-800">
            {/* Simple paragraph splitting */}
            {blog.content.split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {/* Right: Related Blogs */}
        <aside className="lg:w-1/3">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Blogs</h3>
          {related.length === 0 && <p className="text-sm text-gray-500">No related blogs.</p>}
          <div className="space-y-4">
            {related.map((item) => (
              <Link
                to={`/blog/${item.id}`}
                key={item.id}
                className="block border rounded-lg p-3 hover:shadow transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-28 w-full object-cover rounded mb-2"
                />
                <h4 className="text-sm font-semibold text-blue-700">{item.title}</h4>
                <p className="text-xs text-gray-500">{new Date(item.date).toDateString()}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPost;
