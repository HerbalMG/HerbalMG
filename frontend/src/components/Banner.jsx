import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { generateProductUrl } from '../utils/productUtils';

// export default function Banner() {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [current, setCurrent] = useState(0);
//   const intervalRef = useRef(null);
//   const bannerRef = useRef(null);

//   const bannerWidth = 150;
//   const visibleCount = 3;

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     fetch("http://localhost:3001/api/banner")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch banners");
//         return res.json();
//       })
//       .then((data) => {
//         setBanners(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   const nextSlide = () => {
//     setCurrent((prev) => (prev + 1) % (banners.length - visibleCount + 1));
//   };

//   const prevSlide = () => {
//     setCurrent((prev) => (prev - 1 + (banners.length - visibleCount + 1)) % (banners.length - visibleCount + 1));
//   };

//   useEffect(() => {
//     if (banners.length > visibleCount) startAutoSlide();
//     return () => stopAutoSlide();
//   }, [banners.length]);

//   const startAutoSlide = () => {
//     intervalRef.current = setInterval(nextSlide, 5000);
//   };

//   const stopAutoSlide = () => {
//     clearInterval(intervalRef.current);
//   };

//   // Swipe gesture support
//   useEffect(() => {
//     const el = bannerRef.current;
//     if (!el) return;

//     let startX = 0;

//     const handleTouchStart = (e) => {
//       startX = e.touches[0].clientX;
//     };

//     const handleTouchEnd = (e) => {
//       const endX = e.changedTouches[0].clientX;
//       const diff = startX - endX;
//       if (diff > 50) nextSlide();
//       if (diff < -50) prevSlide();
//     };

//     el.addEventListener("touchstart", handleTouchStart);
//     el.addEventListener("touchend", handleTouchEnd);

//     return () => {
//       el.removeEventListener("touchstart", handleTouchStart);
//       el.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [banners.length]);

//   if (loading)
//     return (
//       <div className="h-[150px] flex items-center justify-center bg-gray-100">
//         Loading banners...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="h-[150px] flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );

//   if (!banners.length)
//     return (
//       <div className="h-[150px] flex items-center justify-center text-gray-400">
//         No banners available
//       </div>
//     );

//   return (
//     <div
//       className="relative mx-auto overflow-hidden"
//       style={{ width: `${bannerWidth * visibleCount}px`, height: "150px" }}
//       ref={bannerRef}
//     >
//       {/* Slides container */}
//       <div
//         className="flex transition-transform duration-700 ease-in-out"
//         style={{
//           transform: `translateX(-${current * bannerWidth}px)`,
//         }}
//       >
//         {banners.map((banner) => (
//           <img
//             key={banner.id}
//             src={banner.image_url}
//             alt={banner.alt || "Banner"}
//             className="flex-shrink-0 object-cover"
//             style={{ width: `${bannerWidth}px`, height: "150px" }}
//           />
//         ))}
//       </div>

//       {/* Navigation buttons */}
//       {banners.length > visibleCount && (
//         <>
//           <button
//             onClick={prevSlide}
//             aria-label="Previous Slide"
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
//           >
//             &#8592;
//           </button>
//           <button
//             onClick={nextSlide}
//             aria-label="Next Slide"
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
//           >
//             &#8594;
//           </button>
//         </>
//       )}

//       {/* Dots */}
//       {banners.length > visibleCount && (
//         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
//           {[...Array(banners.length - visibleCount + 1)].map((_, index) => (
//             <button
//               key={index}
//               className={`w-2 h-2 rounded-full ${
//                 current === index ? "bg-white" : "bg-gray-400"
//               }`}
//               onClick={() => setCurrent(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


export function Banners({ banners }) {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Move here to fix hook order

  useEffect(() => {
    if (banners && banners.length > 0) {
      setBannerData(banners[0]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch('http://localhost:3001/api/banner')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch banners');
        return res.json();
      })
      .then(data => {
        // Default: show the first ad banner
        const ad = data.find(b => b.type === 'ad');
        setBannerData(ad || null);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [banners]);

  if (loading) {
    return <div className="h-[150px] flex items-center justify-center bg-gray-100">Loading banner...</div>;
  }
  if (error) {
    return <div className="h-[150px] flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!bannerData) {
    return <div className="h-[150px] flex items-center justify-center text-gray-400">No banner available</div>;
  }

  // Debug: log the image URL
  // console.log('Banner image URL:', bannerData.image_url);

  // If product_id exists, link to product page; else, use link or just show image
  const handleClick = () => {
    if (bannerData.product_id) {
      // Use product slug if available, otherwise fallback to ID
      const productUrl = bannerData.product_slug ? `/product/${bannerData.product_slug}` : `/product/${bannerData.product_id}`;
      navigate(productUrl);
    } else if (bannerData.link) {
      window.open(bannerData.link, '_blank', 'noopener');
    }
  };

  return (
    <div
      className="relative w-full h-[20vh] md:h-[30vh] mt-2 rounded-2xl overflow-hidden cursor-pointer"
      role="banner"
      onClick={handleClick}
    >
      <img
        src={bannerData.image_url}
        alt={bannerData.title || 'Banner'}
        className="w-full h-full object-cover"
        style={{ minHeight: '100%', minWidth: '100%' }}
      />
    </div>
  );
}

// export function BannerEndThree() {
//   const backgroundImageUrl = 'https://source.unsplash.com/1600x900/?nature,water';

//   return (
//     <Link
//       to="/explore"
//       target="_blank"
//       rel="noopener noreferrer"
//       aria-label="Explore the beauty of nature with us"
//     >
//       <div
//         className="relative w-full h-[20vh] md:h-[30vh] bg-cover bg-center mt-4 rounded-2xl overflow-hidden"
//         style={{ backgroundImage: `url(${backgroundImageUrl})` }}
//         role="banner"
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
//             Contact with us using Whatsapp
//           </h1>
//           <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
//             Explore the beauty of nature with us
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }


// export function BannerEndOne() {
//   const backgroundImageUrl = 'https://source.unsplash.com/1600x900/?nature,water';

//   return (
//     <Link
//       to="/explore"
//       target="_blank"
//       rel="noopener noreferrer"
//       aria-label="Explore the beauty of nature with us"
//     >
//       <div
//         className="relative w-full h-[20vh] md:h-[30vh] bg-cover bg-center mt-2 rounded-2xl overflow-hidden"
//         style={{ backgroundImage: `url(${backgroundImageUrl})` }}
//         role="banner"
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
//             Here we show some pharmacy details
//           </h1>
//           <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
//             Explore the beauty of nature with us
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }



// export function BannerEndTwo() {
//   const backgroundImageUrl = 'https://source.unsplash.com/1600x900/?nature,water';

//   return (
//     <Link
//       to="/explore"
//       target="_blank"
//       rel="noopener noreferrer"
//       aria-label="Explore the beauty of nature with us"
//     >
//       <div
//         className="relative w-full h-[20vh] md:h-[30vh] bg-cover bg-center mt-2 rounded-2xl overflow-hidden"
//         style={{ backgroundImage: `url(${backgroundImageUrl})` }}
//         role="banner"
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
//             Contact with us using Whatsapp
//           </h1>
//           <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
//             Explore the beauty of nature with us
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }



// const images = [
//   '/images/img1.jpg',
//   '/images/img2.jpg',
//   '/images/img3.jpg',
//   '/images/img4.jpg',
//   '/images/img5.jpg',
//   '/images/img6.jpg',
// ];

export default function BannerTop ({ banners }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const mouseStartX = useRef(null);
  const isDragging = useRef(false);

  // Only use dummy images if banners prop is not provided at all
  let bannersToShow;
  if (banners === undefined) {
    bannersToShow = images.map(src => ({ image_url: src }));
  } else if (Array.isArray(banners) && banners.length > 0) {
    bannersToShow = banners;
  } else {
    bannersToShow = [];
  }

  const totalPages = bannersToShow.length > 0 ? Math.ceil(bannersToShow.length / itemsPerPage) : 1;

  function getItemsPerPage() {
    return window.innerWidth < 640 ? 1 : 3;
  }

  const next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Responsive Resize
  useEffect(() => {
    const handleResize = () => {
      const newCount = getItemsPerPage();
      setItemsPerPage(newCount);
      setCurrentPage(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, [currentPage, itemsPerPage]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const delta = touchStartX.current - touchEndX.current;

    if (delta > 50) next();
    else if (delta < -50) prev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    const delta = mouseStartX.current - e.clientX;

    if (delta > 50) next();
    else if (delta < -50) prev();

    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleBanners = bannersToShow.slice(startIndex, startIndex + itemsPerPage);

  if (Array.isArray(banners) && banners.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto py-6 text-center text-gray-400">
        No top banners available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      <div
        className={`grid gap-4 ${
          itemsPerPage === 1 ? 'grid-cols-1' : 'grid-cols-3'
        } transition-transform duration-300 ease-in-out select-none`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {visibleBanners.map((banner, idx) => {
          // console.log('Banner:', banner); // Debug: log each banner
          const handleClick = () => {
            // console.log('Clicked banner:', banner); // Debug: log click event
            if (banner.product_id) {
              // Use product slug if available, otherwise fallback to ID
              const productUrl = banner.product_slug ? `/product/${banner.product_slug}` : `/product/${banner.product_id}`;
              navigate(productUrl);
            } else if (banner.link) {
              window.open(banner.link, '_blank', 'noopener');
            }
          };
          return (
            <img
              key={banner.id || idx}
              src={banner.image_url}
              alt={banner.title || `Slide ${startIndex + idx + 1}`}
              className="w-full h-44 sm:h-60 md:h-50 object-cover rounded shadow cursor-pointer"
              draggable={false}
              onClick={handleClick}
            />
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === currentPage ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentPage(idx)}
          />
        ))}
      </div>
    </div>
  );
};
