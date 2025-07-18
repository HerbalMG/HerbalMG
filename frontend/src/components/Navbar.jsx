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
import { useState, useEffect, useRef } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { NavigationMenuDemo } from "./ui/NavigationMenuDemo";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaUserDoctor } from "react-icons/fa6";

export default function NavbarMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    isLoggedIn: true,
    name: "John Doe",
  });

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pincodeDropdownRef = useRef(null);
  const inputRef = useRef(null);

  const [locations, setLocations] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [isPincodeDropdownOpen, setIsPincodeDropdownOpen] = useState(false);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load cached or detected pincode
  useEffect(() => {
    const cachedPincode = localStorage.getItem("userPincode");

    if (cachedPincode) {
      setSelectedPincode(cachedPincode);
      setSearchQuery(cachedPincode);
      fetch(`http://localhost:3001/api/pincodes/${cachedPincode}`)
        .then((res) => res.json())
        .then((pincodes) => {
          if (Array.isArray(pincodes)) setLocations(pincodes);
        });
    } else {
      fetch("http://localhost:3001/api/detect-location")
        .then((res) => res.json())
        .then((data) => {
          if (data.pincode) {
            localStorage.setItem("userPincode", data.pincode);
            setSelectedPincode(data.pincode);
            setSearchQuery(data.pincode);
            fetch(`http://localhost:3001/api/pincodes/${data.pincode}`)
              .then((res) => res.json())
              .then((pincodes) => {
                if (Array.isArray(pincodes)) setLocations(pincodes);
              });
          }
        })
        .catch((err) => {
          console.warn("Location detection failed:", err.message);
          setSearchError("Failed to detect your location.");
        });
    }
  }, []);

  // Debounced pincode search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setLocations([]);
        setIsPincodeDropdownOpen(false);
        return;
      }

      fetch(
        `http://localhost:3001/api/pincodes/${encodeURIComponent(
          searchQuery.trim()
        )}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("No pincodes found");
          return res.json();
        })
        .then((pincodes) => {
          if (Array.isArray(pincodes) && pincodes.length > 0) {
            setLocations(pincodes);
            setIsPincodeDropdownOpen(true);
            setSearchError("");
          } else {
            setLocations([]);
            setIsPincodeDropdownOpen(false);
            setSearchError("No results found.");
          }
        })
        .catch((err) => {
          setLocations([]);
          setIsPincodeDropdownOpen(false);
          setSearchError("No results found.");
        });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedPincode("");
    setSearchError("");
  };

  const handleSelect = (loc) => {
    setSelectedPincode(loc.Pincode);
    setSearchQuery(loc.Pincode);
    setIsPincodeDropdownOpen(false);
    setSearchError("");
    localStorage.setItem("userPincode", loc.Pincode);
  };

  const handleInputFocus = () => {
    if (locations.length > 0) setIsPincodeDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsPincodeDropdownOpen(false), 100);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const uniqueLocations = locations.filter(
    (loc, idx, arr) =>
      arr.findIndex((l) => l.Pincode === loc.Pincode) === idx
  );

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody className="hidden md:flex flex-col items-stretch gap-2">
          <div className="flex w-full items-center justify-between">
            <NavbarLogo />
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-4 w-full max-w-2xl relative">
                <div
                  className="w-full relative"
                  style={{ maxWidth: 200 }}
                  ref={pincodeDropdownRef}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={(e) => {
                      handleInputFocus();
                      e.stopPropagation();
                    }}
                    onBlur={handleInputBlur}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search or select pincode..."
                    className="border rounded px-4 py-2 text-sm w-full dark:bg-neutral-800 dark:text-white"
                  />
                  {isPincodeDropdownOpen && uniqueLocations.length > 0 && (
                    <ul
                      className="absolute z-10 bg-white border rounded w-full max-h-60 overflow-y-auto shadow-lg mt-1"
                      style={{ maxWidth: 200 }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {uniqueLocations.map((loc, idx) => (
                        <li
                          key={idx}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm ${
                            selectedPincode === loc.Pincode
                              ? "bg-gray-200"
                              : ""
                          }`}
                          onMouseDown={() => handleSelect(loc)}
                        >
                          {loc.Pincode}
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchError && (
                    <div className="text-red-500 text-xs mt-1">
                      {searchError}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  placeholder="Search for medicine and health products..."
                  className="border rounded px-4 py-2 text-sm w-full dark:bg-neutral-800 dark:text-white"
                  style={{ maxWidth: 600 }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* <Link to="/doctors">
                <NavbarButton variant="secondary">
                  <div className="flex items-center gap-2 text-l">
                    Near By Doctor <FaUserDoctor />
                  </div>
                </NavbarButton>
              </Link> */}

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
                    onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-l hover:text-blue-600"
                  >
                    {user.name}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setUser({ isLoggedIn: false });
                          localStorage.removeItem("userPincode");
                          setIsProfileDropdownOpen(false);
                          navigate("/");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <NavbarButton variant="secondary" className="text-l">
                    Login
                  </NavbarButton>
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
              onClose={() => setIsMobileMenuOpen(false)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm text-neutral-700 dark:text-neutral-200 hover:underline"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="flex flex-col gap-4 px-4 py-4">
                <Link to="/cart">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
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
                        localStorage.removeItem("userPincode");
                        setIsMobileMenuOpen(false);
                        navigate("/");
                      }}
                      variant="primary"
                      className="w-full"
                    >
                      Logout
                    </NavbarButton>
                  </>
                ) : (
                  <Link to="/login">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
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
  );
}
