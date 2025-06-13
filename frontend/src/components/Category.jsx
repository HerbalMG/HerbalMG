import React, { useRef, useEffect, useState } from "react";
import "./LogoCircles.css"; // Reuse scrollbar hiding CSS

const data = [
  { id: 1, title: "Diabetes", imageUrl: "https://source.unsplash.com/300x300/?mountain" },
  { id: 2, title: "Stomach Care", imageUrl: "https://source.unsplash.com/300x300/?forest" },
  { id: 3, title: "Derma Care", imageUrl: "https://source.unsplash.com/300x300/?beach" },
  { id: 4, title: "Eye Care", imageUrl: "https://source.unsplash.com/300x300/?city" },
  { id: 5, title: "Joint, Bone & Muscle Care", imageUrl: "https://source.unsplash.com/300x300/?mountain" },
  { id: 6, title: "Kidney Care", imageUrl: "https://source.unsplash.com/300x300/?river" },
  { id: 7, title: "Liver Care", imageUrl: "https://source.unsplash.com/300x300/?lake" },
  { id: 8, title: "Heart Care", imageUrl: "https://source.unsplash.com/300x300/?valley" },
];

export default function Category() {
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const autoScrollInterval = useRef(null);

  const scrollAmount = 300;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft === 0);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto-scroll logic
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, 4000);

    return () => clearInterval(autoScrollInterval.current);
  }, []);

  // Track scroll position
  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Touch swipe support
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

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Shop by Health Concern
      </h1>

      {/* Left scroll button */}
      <div className="absolute left-0 top-0 h-full flex items-center z-20">
        <button
          onClick={() => scroll("left")}
          disabled={atStart}
          aria-label="Scroll Left"
          className={`bg-green-600 text-white rounded-full p-3 shadow hover:bg-green-700 transition-opacity ${
            atStart ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          &#8592;
        </button>
      </div>

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-10"
        style={{ scrollSnapType: "x mandatory" }}
        aria-label="Carousel of health categories"
      >
        {data.map(({ id, title, imageUrl }) => (
          <div
            key={id}
            className="flex-shrink-0 w-44 scroll-snap-align-center"
            title={title}
            role="img"
            aria-label={`Category: ${title}`}
          >
            <div className="w-44 h-44 bg-gray-200 overflow-hidden rounded-md shadow">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-center text-md font-medium">{title}</p>
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      <div className="absolute right-0 top-0 h-full flex items-center z-20">
        <button
          onClick={() => scroll("right")}
          disabled={atEnd}
          aria-label="Scroll Right"
          className={`bg-green-600 text-white rounded-full p-3 shadow hover:bg-green-700 transition-opacity ${
            atEnd ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
