import React, { useEffect, useState } from "react";

const data = [
  { id: 1, title: "Diabetes", imageUrl: "/diabetes.svg", link: "/categories/diabetes" },
  { id: 2, title: "Skin Care", imageUrl: "/skin.svg", link: "/categories/derma-care" },
  { id: 3, title: "Hair Care", imageUrl: "/hair.svg", link: "/categories/eye-care" },
  { id: 4, title: "Joint, Bone & Muscle Care", imageUrl: "/joint.svg", link: "/categories/joint-care" },
  { id: 5, title: "Kidney Care", imageUrl: "/Kidney.svg", link: "/categories/kidney-care" },
  { id: 6, title: "Liver Care", imageUrl: "/liver.svg", link: "/categories/liver-care" },
  { id: 7, title: "Heart Care", imageUrl: "/heart.svg", link: "/categories/heart-care" },
  { id: 8, title: "Men Wellness", imageUrl: "/men.svg", link: "/categories/heart-care" },
  { id: 9, title: "Women Wellness", imageUrl: "/women.svg", link: "/categories/heart-care" },
  { id: 10, title: "Digestive Care", imageUrl: "/digestive.svg", link: "/categories/heart-care" },
];

export default function Category() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-700">
        Shop by Health Concern
      </h1>

      {/* Mobile Horizontal Scroll View */}
      <div className="block sm:hidden overflow-x-auto">
        <div className="flex space-x-4 snap-x snap-mandatory scroll-pl-4">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-gray-200 rounded-md shadow-md min-w-[200px] h-20 flex items-center px-4 snap-start"
                >
                  <div className="w-16 h-16 bg-gray-300 rounded-full mr-4" />
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </div>
              ))
            : data.map(({ id, title, imageUrl, link }) => (
                <a
                  href={link}
                  key={id}
                  className="flex items-center min-w-[200px] bg-white rounded-md shadow-md p-4 hover:shadow-lg transition duration-300 hover:bg-gray-50 snap-start"
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-16 h-16 object-cover mr-4"
                    loading="lazy"
                  />
                  <p className="text-md font-medium text-gray-800">{title}</p>
                </a>
              ))}
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-gray-200 rounded-md shadow-md h-20 flex items-center px-4"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>
            ))
          : data.map(({ id, title, imageUrl, link }) => (
              <a
                href={link}
                key={id}
                className="flex items-center bg-white rounded-md shadow-md p-4 hover:shadow-lg transition duration-300 hover:bg-gray-50"
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-16 h-16 object-cover mr-4"
                  loading="lazy"
                />
                <p className="text-md font-semibold text-gray-800">{title}</p>
              </a>
            ))}
      </div>
    </div>
  );
}
