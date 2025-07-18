import React, { useEffect, useRef, useState } from 'react';

import Breadcrumb from '../components/Breadcrumb'
import Brands, { PopularBrand } from '../components/Brands'
import Category from '../components/Category'
import BannerTop, {  Banners } from '../components/Banner'
import DealsOfTheDay from '../components/DealsOfTheDay'
import Trending from '../components/Trending'
import Type from '../components/Type'
import BlogCard from '../components/BlogCard'
import { Link } from 'react-router-dom';
import ProductCard, { ProductCardScrollable } from '../components/ProductCard';
import { StyleHome } from '../components/Style';


const products = [
  {
    id: 1,
    name: 'Stylish Shoes',
    image: 'https://via.placeholder.com/200',
    actualPrice: 99.99,
    sellingPrice: 59.99
  },
  {
    id: 2,
    name: 'Casual Jacket',
    image: 'https://via.placeholder.com/200',
    actualPrice: 120.00,
    sellingPrice: 85.00
  },
  {
    id: 3,
    name: 'Wrist Watch',
    image: 'https://via.placeholder.com/200',
    actualPrice: 250.00,
    sellingPrice: 180.00
  },
  {
    id: 4,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 5,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 6,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 7,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 8,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  },
  {
    id: 9,
    name: 'Sunglasses',
    image: 'https://via.placeholder.com/200',
    actualPrice: 70.00,
    sellingPrice: 45.00
  }
];  

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topBanners, setTopBanners] = useState([]);

  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (!scrollContainer) return;
      scrollContainer.scrollBy({ left: 1, behavior: 'smooth' });
      scrollAmount += 1;

      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0;
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 20); // Adjust speed (lower = faster)

    return () => clearInterval(scrollInterval);
  }, []);



  useEffect(() => {
    // Fetch blogs
    setLoading(true);
    setError(null);
    fetch('http://localhost:3001/api/blog')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then(data => {
        setBlogs(data.slice(0, 3)); // Show only the latest 3 blogs
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch banners
    fetch('http://localhost:3001/api/banner')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch banners');
        return res.json();
      })
      .then(data => {
        const filtered = data.filter(b => b.type === 'top');
        setTopBanners(filtered);
        console.log('Top banners:', filtered);
      })
      .catch(() => setTopBanners([]));
  }, []);

  const dummyProduct = {
    id: 1,
    name: 'Ashwagandha Tablets',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
    ],
    actual_price: 499,
    selling_price: 349,

    
  };

  return (
    <>
      <Type/>
      <BannerTop banners={topBanners}/>
      {/* <Breadcrumb/> */}
      <Category/>
      <Banners/>
      {/* <div className="min-h-screen flex items-center justify-center">
      </div> */}
      {/* <Trending/> */}

        {/* ----------  */}
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seasonal Products</h1>
      <div className="flex overflow-x-auto gap-4">
        {products.map((product) => (
          <ProductCardScrollable key={product.id} {...product} />
        ))}
      </div>
    </div>
    {/* ---------------  */}

      {/* <DealsOfTheDay /> */}
{/* ----------  */}
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Products</h1>
      <div className="flex overflow-x-auto gap-4">
        {products.map((product) => (
          <ProductCardScrollable key={product.id} {...product} />
        ))}
      </div>
    </div>
    {/* ---------------  */}

      <Banners/>
            <Brands />

                  {/* <DealsOfTheDay />
  <ProductCard product={dummyProduct} /> */}

  {/* ----------  */}
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Maximum Discount Products</h1>
      <div className="flex overflow-x-auto gap-4">
        {products.map((product) => (
          <ProductCardScrollable key={product.id} {...product} />
        ))}
      </div>
    </div>
    {/* ---------------  */}

    <PopularBrand/>

      {/* Blog Section */}
      <div className="my-10">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-green-700">Discover Ayurveda</h2>
    <Link to="/blog" className='text-md font-semibold text-blue-600 cursor-pointer hover:underline'> See all</Link>
    {/* <h2 className="text-md font-semibold text-blue-600 cursor-pointer hover:underline">See all</h2> */}
  </div>

  {loading && <div className="text-gray-500">Loading blogs...</div>}
  {error && <div className="text-red-500">{error}</div>}

  {!loading && !error && blogs.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {blogs.map(blog => (
        <BlogCard
          key={blog.id}
          image={blog.image_url}
          title={blog.title}
          description={blog.short_description}
          tags={blog.tags || []}
          link={`/blog/${blog.id}`}
        />
      ))}
    </div>
  )}

  {!loading && !error && blogs.length === 0 && (
    <div className="text-gray-400">No blogs available.</div>
  )}
</div>

<Banners/>
<Banners/>

<StyleHome/>

    </>
  );
}
export default Home
