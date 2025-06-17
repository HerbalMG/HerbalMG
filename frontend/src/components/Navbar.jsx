"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { NavigationMenuDemo } from "./ui/NavigationMenuDemo";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { BiSolidOffer } from "react-icons/bi";
import { useRef } from "react";

export default function NavbarMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cartItems } = useCart();

  const [user, setUser] = useState({
  isLoggedIn: true, // toggle to false to simulate logout
  name: "John Doe",
});

const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


//   const [locations, setLocations] = useState<string>([]);
// const [selectedPincode, setSelectedPincode] = useState<string>("");

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

//   useEffect(() => {
//   // 1. Load all unique pincodes
//   fetch("http://localhost:3001/api/pincodes")
//     .then((res) => res.json())
//     .then((pincodes) => {
//       setLocations(pincodes); // Dropdown options
//     })
//     .catch((err) => console.error("Failed to load pincodes:", err));

//   // 2. Detect user's pincode from backend
//   fetch("http://localhost:3001/api/detect-location")
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.pincode) {
//         setSelectedPincode(data.pincode); // Auto-select this
//       }
//     })
//     .catch((err) => console.warn("Location detection failed:", err));
// }, []);




 const handleLocationChange = (e) => {
  setSelectedPincode(e.target.value);
  console.log("Selected pincode:", e.target.value);
};


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    console.log("Mobile menu toggled:", !isMobileMenuOpen);
  };

  return (
    <>
      <div className="relative w-full">
        <Navbar>
          <NavBody className="hidden md:flex flex-col items-stretch gap-2">
            <div className="flex w-full items-center justify-between">
              <NavbarLogo />
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-4 w-full max-w-2xl">

                 {/* <select value={selectedPincode} onChange={handleLocationChange}>
  <option value="">Select Pincode</option>
  {locations.map((pincode, idx) => (
    <option key={idx} value={pincode}>
      {pincode}
    </option>
  ))}
</select> */}



                  <input
                    type="text"
                    placeholder="Search for medicine and health products..."
                    className="flex-1 border rounded px-4 py-2 text-sm dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">

                <Link to= "/offers">
                <NavbarButton variant="secondary" >
                    <div className="flex items-center gap-2 text-xl">
                      <BiSolidOffer />
                    </div>
                </NavbarButton>
                </Link>

                <Link to="/cart">
                  <NavbarButton variant="secondary">
                    <div className="flex items-center gap-2 text-l">
                      <MdAddShoppingCart />
                      <span>{cartItemCount}</span>
                    </div>
                  </NavbarButton>
                </Link>
                {user.isLoggedIn ? (
  <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 text-l hover:text-blue-600"
            >
              {user.name}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setUser({ isLoggedIn: false });
                    setIsDropdownOpen(false);
                    Navigate("/"); 
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
) : (
  <Link to='/login'>
    <NavbarButton variant="secondary" className="text-l">Login</NavbarButton>
  </Link>
)}

              </div>
            </div>

            <div className="w-full flex justify-center">
              <NavigationMenuDemo />
            </div>
          </NavBody>

          <div className="block md:hidden">
            <MobileNav>
              <MobileNavHeader>
                <NavbarLogo />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={toggleMobileMenu}
                />
              </MobileNavHeader>

              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => {
                  setIsMobileMenuOpen(false);
                  console.log("Mobile menu closed");
                }}
              >
                <div className="flex flex-col gap-4 px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded px-4 py-2 text-sm dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-2 px-4 pt-4">
                  {navigationLinks.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        console.log("Navigated to:", item.name);
                      }}
                      className="text-sm text-neutral-700 dark:text-neutral-200 hover:underline"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                <div className="flex flex-col gap-4 px-4 py-4">
                  <Link to="/cart">
                    <NavbarButton
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        console.log("Cart clicked (mobile)");
                      }}
                      variant="primary"
                      className="w-full"
                    >
                      <div className="flex items-center gap-2">
                        <MdAddShoppingCart />
                        <span>{cartItemCount}</span>
                      </div>
                    </NavbarButton>
                  </Link>
                  {user.isLoggedIn ? (
  <>
    <Link to="/profile">
      <NavbarButton
        onClick={() => setIsMobileMenuOpen(false)}
        variant="primary"
        className="w-full"
      >
        Profile
      </NavbarButton>
    </Link>
    <NavbarButton
      onClick={() => {
        setUser({ isLoggedIn: false });
        setIsMobileMenuOpen(false);
      }}
      variant="primary"
      className="w-full"
    >
      Logout
    </NavbarButton>
  </>
) : (
  <Link to='/login'>
    <NavbarButton
      onClick={() => {
        setIsMobileMenuOpen(false);
        console.log("Login clicked (mobile)");
      }}
      variant="primary"
      className="w-full"
    >
      Login
    </NavbarButton>
  </Link>
)}

                </div>
              </MobileNavMenu>
            </MobileNav>
          </div>
        </Navbar>
      </div>
    </>
  );
}
