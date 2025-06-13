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
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { BiSolidOffer } from "react-icons/bi";

export default function NavbarMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const { cartItems } = useCart();

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  useEffect(() => {
    console.log("Fetching locations from data.json...");
    fetch("src/data.json")
      .then((res) => res.json())
      .then((data) => {
        const unique = [];
        const map = new Map();
        data.Pincodes.forEach((item) => {
          const key = `${item.City}-${item.State}`;
          if (!map.has(key)) {
            map.set(key, true);
            unique.push({ city: item.City, state: item.State });
          }
        });
        console.log("Unique locations loaded:", unique);
        setLocations(unique);
      })
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    console.log("Selected location:", e.target.value);
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

                  <select
                    className="border rounded px-3 py-2 text-sm dark:bg-neutral-800 dark:text-white"
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  >
                    <option value="" disabled>
                      Deliver to
                    </option>
                    {locations.map((loc, idx) => (
                      <option key={idx} value={`${loc.city},${loc.state},${loc.pincode}`}>
                        {loc.city}
                      </option>
                    ))}
                  </select>

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
                <NavbarButton variant="secondary" className="text-l">Login / Register</NavbarButton>
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
                </div>
              </MobileNavMenu>
            </MobileNav>
          </div>
        </Navbar>
      </div>
    </>
  );
}
