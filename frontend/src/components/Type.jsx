import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LogoCircles.css";

const data = [
  {
    id: 1,
    title: "Ayurvedic Medicine",
    imageUrl: "/med.svg",
    bgcolor: "bg-red-100",
    link: "/ayurvedic",
  },
  {
    id: 2,
    title: "Homeopathic Medicine",
    imageUrl: "/medicine.svg",
    bgcolor: "bg-yellow-100",
    link: "/homeopathic",
  },
  {
    id: 3,
    title: "Unani Medicine",
    imageUrl: "/medi.svg",
    bgcolor: "bg-green-100",
    link: "/unani",
  },
  {
    id: 4,
    title: "Prescription",
    imageUrl: "/prescription.svg",
    bgcolor: "bg-blue-100",
    link: "/categories/joint-care",
  },
  {
    id: 5,
    title: "Near by Doctor",
    imageUrl: "/doctor.svg",
    bgcolor: "bg-purple-100",
    link: "/doctors",
  },
];

export default function Type() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-4 max-w-7xl mx-auto">
      {/* Mobile: Horizontal Scroll */}
      <div className="sm:hidden overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 snap-x snap-mandatory scroll-pl-4">
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-gray-200 rounded-md shadow-md min-w-[180px] h-20 flex items-center px-4 snap-start"
                >
                  <div className="w-14 h-14 bg-gray-300 rounded-full mr-4" />
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </div>
              ))
            : data.map(({ id, title, imageUrl, link, bgcolor }) => (
                <div
                  key={id}
                  onClick={() => navigate(link)}
                  className={`cursor-pointer flex items-center ${bgcolor} rounded-md shadow-md min-w-[180px] px-4 py-3 snap-start hover:shadow-lg transition duration-300`}
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-12 h-12 object-contain mr-4"
                    loading="lazy"
                  />
                  <p className="text-sm font-medium text-gray-800">{title}</p>
                </div>
              ))}
        </div>
      </div>

      {/* Tablet/Desktop: Grid Layout */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-6 sm:mt-0">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-md shadow-md h-20 flex items-center px-4"
              >
                <div className="w-14 h-14 bg-gray-300 rounded-full mr-4" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>
            ))
          : data.map(({ id, title, imageUrl, link, bgcolor }) => (
              <div
                key={id}
                onClick={() => navigate(link)}
                className={`cursor-pointer flex items-center ${bgcolor} rounded-md shadow-md px-4 py-4 hover:shadow-lg transition duration-300`}
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-12 h-12 object-contain mr-4"
                  loading="lazy"
                />
                <p className="text-base font-semibold text-gray-800">{title}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
