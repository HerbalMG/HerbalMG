import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LogoCircles.css";

const data = [
  {
    id: 1,
    title: "Ayurvedic Medicine",
    shortTitle: "Ayurvedic",
    imageUrl: "/assets/med.svg",
    bgcolor: "bg-gradient-to-tr from-orange-100 via-green-50 to-blue-300",
    link: "/ayurvedic",
  },
  {
    id: 2,
    title: "Homeopathic Medicine",
    shortTitle: "Homeopathy",
    imageUrl: "/assets/medicine.svg",
    bgcolor: "bg-gradient-to-tr from-yellow-200 via-green-50 to-green-400",
    link: "/homeopathic",
  },
  {
    id: 3,
    title: "Unani Medicine",
    shortTitle: "Unani",
    imageUrl: "/assets/medi.svg",
    bgcolor: "bg-gradient-to-tr from-green-50 via-violet-100 to-orange-50",
    link: "/unani",
  },
  {
    id: 4,
    title: "Prescription",
    shortTitle: "Prescription",
    imageUrl: "/assets/prescription.svg",
    bgcolor: "bg-gradient-to-tr from-green-50 via-orange-100 to-blue-500",
    link: "https://wa.me/1234567898",
  },
  {
    id: 5,
    title: "Near by Doctor",
    shortTitle: "Doctors",
    imageUrl: "/assets/doctor.svg",
    bgcolor: "bg-gradient-to-tr from-red-50 via-green-100 to-orange-200",
    link: "/doctors",
  },
];

function CardItem({
  id,
  title,
  shortTitle,
  imageUrl,
  bgcolor,
  link,
  isMobile,
  className = "",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id === 4) {
      window.open(link, "_blank");
    } else {
      navigate(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition duration-300 ${
        isMobile
          ? `flex flex-col items-center text-center ${className}`
          : `flex items-center min-w-[180px] px-3 py-3 rounded-md shadow-md hover:shadow-lg ${bgcolor}`
      }`}
    >
      <img
        src={imageUrl}
        alt={title}
        className={`object-contain ${
          isMobile ? "w-8 h-8 mb-1" : "w-12 h-12 mr-4"
        }`}
        loading="lazy"
      />
      <p
        className={`font-medium text-gray-800 ${
          isMobile ? "text-[10px] leading-tight" : "text-sm sm:text-base"
        }`}
      >
        {isMobile ? shortTitle : title}
      </p>
    </div>
  );
}

export default function Type() {
  const scrollRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.innerWidth < 640) return;

    autoScrollInterval.current = setInterval(() => {
      if (isHovered) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 200, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(autoScrollInterval.current);
  }, [isHovered]);

  return (
    <div className="max-w-8xl mx-auto">
      {/* Mobile: 3 items per row, no box/background */}
      <div className="sm:hidden flex flex-wrap justify-start gap-y-4"> 
        {data.map((item) => (
          <CardItem key={item.id} {...item} isMobile className="w-1/5" />
        ))}
      </div>

      {/* Desktop: Grid layout with gradient bg and box */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-6"
      >
        {data.map((item) => (
          <CardItem key={item.id} {...item} isMobile={false} />
        ))}
      </div>
    </div>
  );
}
