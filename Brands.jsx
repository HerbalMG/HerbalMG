// src/components/LogoCircles.jsx
import React, { useRef, useState, useEffect } from 'react'
import './LogoCircles.css' // 👈 Import custom styles for scrollbar

const brands = [
  { name: 'Dhootapapeshwar', url: 'https://sdlindia.com/wp-content/uploads/2022/06/Artboard-1-1.png' },
  { name: 'Dabur', url: 'https://www.dabur.com/static/images/android-icon-72x72.png' },
  { name: 'Baidyanath', url: 'https://www.baidyanath.co.in/images/logo.webp' },
  { name: 'Himalaya', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Himalaya_Logo.svg/800px-Himalaya_Logo.svg.png' },
  { name: 'Zandu', url: 'https://zanducare.com/cdn/shop/files/zandu_logo_23a4d348-436c-4efa-8b53-9607e4aaf9ad_85x@2x.png?v=1668585144' },
  { name: 'Sharmayu', url: 'https://sharmayu.com/cdn/shop/files/Sharmayu_Logo_2024_transparent_fdfbe20e-5840-41b2-8070-3183b71afc26.png?v=1730703693&width=600' },
  { name: 'Sri Sri', url: 'https://www.srisritattva.com/cdn/shop/files/4927564f1d554246a2d3cc1c7a0343d2_1.png?v=1692352382&width=324' },
  { name: 'Patanjali', url: 'https://patanjaliwellness.com/assets/images/Patanjali-Wellness-logo.png' },
  { name: 'Shri Mohta', url: 'https://www.shrimohta.com/cdn/shop/files/mohta_logo-01-01.png?v=1743326790&width=200' },
  { name: 'Sandu', url: 'https://sandu.in/wp-content/uploads/2024/09/sandu-logo1.png' },
  { name: 'Vitro', url: 'https://vitronaturals.com/cdn/shop/files/Vitro_logo_cd857469-5926-401a-8108-4e47b4fec2a2_180x.png?v=1716897713' },
  { name: 'Kapiva', url: 'https://cdn11.bigcommerce.com/s-5h8rqg02f8/images/stencil/250x100/subtract_1617795361__77099.original.png' },
  { name: 'Krishan Gopal Kaleda', url: 'https://kaleraayurveda.com/wp-content/uploads/al_opt_content/IMAGE/kaleraayurveda.com/wp-content/uploads/2024/07/WhatsApp_Image_2024-03-11_at_4.06.25_PM-removebg-preview-1-200x55.png.bv_resized_desktop.png.bv.webp' },
  { name: 'Aimil', url: 'https://www.aimilpharma.life/cdn/shop/t/131/assets/logo.gif?v=25854662810657892401629092980' },
  { name: 'Vasu', url: 'https://vasustore.com/cdn/shop/files/logo-removebg-preview_27bac36d-7c55-47f5-bd08-f0379b0ff364_360x.png?v=1650719386' },
  { name: 'Charak', url: 'https://www.charak.com/wp-content/uploads/2021/03/charak-logo.svg' },
  { name: 'Vyas', url: 'https://www.vyaspharma.com/wp-content/uploads/2023/03/vyas-pharma-logo-2.png' },
  { name: 'Vaidratnam', url: 'https://vaidyaratnamstore.com/assets/images/icons/Logo.svg' },
  { name: 'Kottakal', url: 'https://www.aryavaidyasala.com/wp-content/uploads/2023/09/kottakkal.png' },
  { name: 'AVP', url: 'https://www.avpayurveda.com/wp-content/uploads/2024/05/Logo-New.png' },
  { name: 'Nagarjuna Kerala', url: 'https://ayurvedichealingvillage.com/ppc/web/kairali-colorful-logo.png' },
  { name: 'Multani', url: 'https://www.multani.org/cdn/shop/files/logo-min.png?v=1726386561&width=300' }
]

const LogoCircles = () => {
  const scrollRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const scrollAmount = 250
  let autoScrollInterval = useRef(null)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return

    setAtStart(el.scrollLeft === 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5)
  }

  const scroll = (direction) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  // Auto-scroll setup
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollInterval.current = setInterval(() => {
        if (!scrollRef.current) return
        const el = scrollRef.current
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' }) // loop back
        } else {
          scroll('right')
        }
      }, 4000) // auto-scroll interval in ms
    }

    startAutoScroll()

    return () => clearInterval(autoScrollInterval.current)
  }, [])

  // Track scroll position
  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  // Touch swipe support
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let startX = 0
    let isDown = false

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX
      isDown = true
    }

    const onTouchMove = (e) => {
      if (!isDown) return
      const diff = startX - e.touches[0].clientX
      el.scrollLeft += diff
      startX = e.touches[0].clientX
    }

    const onTouchEnd = () => {
      isDown = false
    }

    el.addEventListener('touchstart', onTouchStart)
    el.addEventListener('touchmove', onTouchMove)
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <div className="p-10 max-w-6xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Ayurvedic Brands</h1>

      {/* Left Button */}
      <div className="absolute left-0 top-0 h-full flex items-center z-20">
        <button
          onClick={() => scroll('left')}
          disabled={atStart}
          className={`bg-green-600 text-white rounded-full p-3 shadow hover:bg-green-700 transition-opacity ${
            atStart ? 'opacity-30 cursor-not-allowed' : ''
          }`}
          aria-label="Scroll Left"
        >
          &#8592;
        </button>
      </div>

      {/* Logos */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-10 no-scrollbar scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
        aria-label="Carousel of Ayurvedic Brand Logos"
      >
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex-shrink-0 w-28 h-28 rounded-full bg-white border shadow flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            style={{ scrollSnapAlign: 'center' }}
            role="img"
            aria-label={`Brand logo of ${brand.name}`}
            title={brand.name}
          >
            <img
              src={brand.url}
              alt={brand.name}
              className="w-16 h-16 object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Right Button */}
      <div className="absolute right-0 top-0 h-full flex items-center z-20">
        <button
          onClick={() => scroll('right')}
          disabled={atEnd}
          className={`bg-green-600 text-white rounded-full p-3 shadow hover:bg-green-700 transition-opacity ${
            atEnd ? 'opacity-30 cursor-not-allowed' : ''
          }`}
          aria-label="Scroll Right"
        >
          &#8594;
        </button>
      </div>
    </div>
  )
}

export default LogoCircles