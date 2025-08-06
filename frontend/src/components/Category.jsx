import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./LogoCircles.css";
import { createSlug } from "../utils/slugUtils";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback data
  const fallbackData = [
    { id: 1, title: "Diabetes", imageUrl: "/assets/diabetes.svg", slug: "diabetes" },
    { id: 2, title: "Skin Care", imageUrl: "/assets/skin.svg", slug: "skin-care" },
    { id: 3, title: "Hair Care", imageUrl: "/assets/hair.svg", slug: "hair-care" },
    { id: 4, title: "Muscle Care", imageUrl: "/assets/joint.svg", slug: "joint-care" },
    { id: 5, title: "Kidney Care", imageUrl: "/assets/Kidney.svg", slug: "kidney-care" },
    { id: 6, title: "Liver Care", imageUrl: "/assets/liver.svg", slug: "liver-care" },
    { id: 7, title: "Heart Care", imageUrl: "/assets/heart.svg", slug: "heart-care" },
    { id: 8, title: "Men Wellness", imageUrl: "/assets/men.svg", slug: "men-care" },
    { id: 9, title: "Women Wellness", imageUrl: "/assets/women.svg", slug: "women-care" },
    { id: 10, title: "Digestive Care", imageUrl: "/assets/digestive.svg", slug: "digestive-care" }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  // Removed auto-scroll logic entirely.

  // Touch support remains unchanged
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let startX = 0;
    let isDown = false;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      isDown = true;
    };

    const onTouchMove = (e) => {
      if (!isDown) return;
      const diff = startX - e.touches[0].clientX;
      el.scrollLeft += diff;
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = () => {
      isDown = false;
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/main_category");
      const data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        const categoriesWithLinks = data.map((category) => ({
          ...category,
          link: `/health-concern/${category.slug || createSlug(category.name)}`,
        }));
        setCategories(categoriesWithLinks);
      } else {
        setCategories(fallbackData.map((cat) => ({ ...cat, link: `/health-concern/${cat.slug}` })));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories(fallbackData.map((cat) => ({ ...cat, link: `/health-concern/${cat.slug}` })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-arial  mb-6 text-black">
        Shop by Health Concern
      </h1>

      {/* Mobile Grid - multiple rows, no scroll, no background */}
<div className="sm:hidden grid grid-cols-5 gap-2 px-2">
  {loading
    ? Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-gray-300 rounded-full mb-2" />
          <div className="h-4 w-20 bg-gray-300 rounded" />
        </div>
      ))
    : categories.map(({ id, title, name, imageUrl, image_url, link }) => (
        <Link
          to={link}
          key={id}
          className="flex flex-col items-center no-bg p-0"
          style={{ textDecoration: "none" }}
        >
          <img
            src={imageUrl || image_url || "/assets/default-category.svg"}
            alt={title || name}
            className="w-10 h-10 object-cover rounded-full"
            loading="lazy"
          />
          <p className="text-xs text-center text-gray-800">{title || name}</p>
        </Link>
      ))}
</div>


      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-gray-200 rounded-md shadow-md h-20 flex items-center px-4"
              >
                {/* <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" /> */}
                {/* <div className="h-4 w-20 bg-gray-300 rounded" /> */}
              </div>
            ))
          : categories.map(({ id, title, name, imageUrl, image_url, link }) => (
              <Link
  to={link}
  key={id}
  className="group flex items-center p-[2px] rounded-md "
>
  <div className="flex items-center bg-white rounded-md shadow-md p-2 w-full group-hover:shadow-lg transition duration-300">
    <img
      src={imageUrl || image_url || "/assets/default-category.svg"}
      alt={title || name}
      className="w-16 h-16 object-cover mr-4"
      loading="lazy"
    />
    <p className="text-md font-semibold text-gray-800">{title || name}</p>
  </div>
</Link>

            ))}
      </div>
    </div>
  );
}
