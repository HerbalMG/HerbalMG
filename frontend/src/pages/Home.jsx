import React, { useEffect, useRef, useState } from "react";

import Brands, { PopularBrand } from "../components/Brands";
import Category from "../components/Category";
import BannerTop, { Banners } from "../components/Banner";
import Type from "../components/Type";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";
import ProductCard, { ProductCardScrollable } from "../components/ProductCard";
import ProductSection from "../components/ProductSection";
import { StyleHome } from "../components/Style";
import SearchComponent from "../components/SearchComponent";


const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topBanners, setTopBanners] = useState([]);
  const [allBanners, setAllBanners] = useState([]);
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [peoplePreferredProducts, setPeoplePreferredProducts] = useState([]);
  const [maxDiscountProducts, setMaxDiscountProducts] = useState([]);

  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (!scrollContainer) return;
      scrollContainer.scrollBy({ left: 1, behavior: "smooth" });
      scrollAmount += 1;

      if (
        scrollAmount >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollAmount = 0;
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 20); // Adjust speed (lower = faster)

    return () => clearInterval(scrollInterval);
  }, []);

  useEffect(() => {
    // Fetch blogs
    setLoading(true);
    setError(null);
    fetch("http://localhost:3001/api/blog")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        setBlogs(data.slice(0, 3)); // Show only the latest 3 blogs
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch banners
    fetch("http://localhost:3001/api/banner")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch banners");
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter((b) => b.type === "top");
        setTopBanners(filtered);
        setAllBanners(data);
      })
      .catch(() => setTopBanners([]))
      .catch(() => setAllBanners([]));

    // Fetch seasonal products
    fetch("http://localhost:3001/api/product?seasonal_medicine=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSeasonalProducts(data);
        } else {
          setSeasonalProducts([]);
          console.error("API error (seasonal):", data.error || data);
        }
      })
      .catch((err) => {
        setSeasonalProducts([]);
        console.error("Network error (seasonal):", err);
      });

    // Fetch top products
    fetch("http://localhost:3001/api/product?top_products=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTopProducts(data);
        } else {
          setTopProducts([]);
          console.error("API error (top):", data.error || data);
        }
      })
      .catch((err) => {
        setTopProducts([]);
        console.error("Network error (top):", err);
      });

    // Fetch people preferred products
    fetch("http://localhost:3001/api/product?people_preferred=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPeoplePreferredProducts(data);
        } else {
          setPeoplePreferredProducts([]);
          console.error("API error (people preferred):", data.error || data);
        }
      })
      .catch((err) => {
        setPeoplePreferredProducts([]);
        console.error("Network error (people preferred):", err);
      });

    // Fetch maximum discount products
    fetch("http://localhost:3001/api/product?maximum_discount=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMaxDiscountProducts(data);
        } else {
          setMaxDiscountProducts([]);
          console.error("API error (max discount):", data.error || data);
        }
      })
      .catch((err) => {
        setMaxDiscountProducts([]);
        console.error("Network error (max discount):", err);
      });
  }, []);

  const getBannerByType = (type) => allBanners.find((b) => b.type === type);

  return (
    <>
      <div className="hidden sm:relative sm:bg-gradient-to-tr sm:from-orange-50 sm:via-green-100 sm:to-blue-50 sm:flex sm:flex-col sm:items-center sm:rounded-2xl">
        <SearchComponent />
      </div>
      <Type />
      {/* top banner for product display  */}
      <BannerTop banners={topBanners} />
      <Category />
      {/* banner for ad  */}
      {getBannerByType("ad") && <Banners banners={[getBannerByType("ad")]} />}
      {/* ----------  */}
      <ProductSection
        title="Seasonal Products"
        products={seasonalProducts}
        viewAllLink="/products?seasonal_medicine=true"
        emptyStateIcon="🌿"
        emptyStateTitle="No Seasonal Products Available"
        emptyStateMessage="We're currently updating our seasonal collection. Check back soon for new arrivals!"
      />

      {/* ---------------  */}
      <ProductSection
        title="Top Products"
        products={topProducts}
        viewAllLink="/products?top_products=true"
        emptyStateIcon="⭐"
        emptyStateTitle="No Top Products Available"
        emptyStateMessage="We're currently curating our best products. Stay tuned for amazing deals!"
      />
      {/* ---------------  */}
      <ProductSection
        title="People Preferred Products"
        products={peoplePreferredProducts}
        viewAllLink="/products?people_preferred=true"
        emptyStateIcon="👥"
        emptyStateTitle="No People Preferred Products Available"
        emptyStateMessage="We're gathering customer favorites. Check back soon for popular choices!"
      />
      {/* info banner  */}
      {getBannerByType("info") && (
        <Banners banners={[getBannerByType("info")]} />
      )}{" "}
      <Brands />
      {/* ----------  */}
      <ProductSection
        title="Maximum Discount Products"
        products={maxDiscountProducts}
        viewAllLink="/products?maximum_discount=true"
        emptyStateIcon="💰"
        emptyStateTitle="No Discount Products Available"
        emptyStateMessage="We're preparing amazing discounts for you. Check back soon for great deals!"
      />
      {/* ---------------  */}
      <PopularBrand />

      {/* --------------------------------  */}
      {/* Blog Section */}
     <div className="my-10">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black truncate">
      Discover Ayurveda
    </h2>
    <Link
      to="/blog"
      className="text-md font-semibold text-blue-600 cursor-pointer hover:underline"
    >
      Read all
    </Link>
  </div>

  {loading && <div className="text-gray-500">Loading blogs...</div>}
  {error && <div className="text-red-500">{error}</div>}

  {!loading && !error && blogs.length > 0 && (
    <div className="flex space-x-4 overflow-x-auto sm:grid sm:grid-cols-4 gap-4 scrollbar-hide py-2">
  {blogs.map((blog) => (
    <div
      className="w-[250px] flex-shrink-0 sm:w-full"
      key={blog.id}
    >
      <BlogCard
        image={blog.image_url}
        title={blog.title}
        description={blog.short_description}
        tags={blog.tags || []}
        link={`/blog/${blog.id}`}
      />
    </div>
  ))}
</div>

  )}

  {!loading && !error && blogs.length === 0 && (
    <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Blogs Available</h3>
        <p className="text-gray-500 text-sm max-w-md">We're working on creating informative content about Ayurveda and health. Stay tuned for insightful articles!</p>
      </div>
    </div>
  )}
</div>

        {/* ----------------------------  */}
      {/* Company banner  */}
      {getBannerByType("company") && (
        <Banners banners={[getBannerByType("company")]} />
      )}
      {/* whatsapp banner  */}
      {getBannerByType("whatsapp") && (
        <Banners banners={[getBannerByType("whatsapp")]} />
      )}
      <StyleHome />
    </>
  );
};

export default Home;
