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

export function NavbarMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  // These are the same items used in your NavigationMenuDemo
  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  // user location
  useEffect(() => {
    fetch("src/data.json")
      .then((res) => res.json())
      .then((data) => {
        // Remove duplicates based on City + State
        const unique = [];
        const map = new Map();
        data.Pincodes.forEach((item) => {
          const key = `${item.City}-${item.State}`;
          if (!map.has(key)) {
            map.set(key, true);
            unique.push({ city: item.City, state: item.State });
          }
        });
        setLocations(unique);
      })
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  return (
    <>
      <div className="relative w-full">
        <Navbar>
          {/* Desktop and Tablet View */}
          <NavBody className="hidden md:flex flex-col items-stretch gap-2">
            {/* Top Row */}
            <div className="flex w-full items-center justify-between">
              <NavbarLogo />

              {/* Center: Location Dropdown + Search */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-4 w-full max-w-2xl">
                  {/* Location Dropdown - hide on mobile */}
                 <select
      className="border rounded px-3 py-2 text-sm dark:bg-neutral-800 dark:text-white"
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
    >
      <option value="" disabled>
        Deliver to
      </option>
      {locations.map((loc, idx) => (
        <option key={idx} value={`${loc.city},${loc.state}`}>
         {loc.city}
        </option>
      ))}
    </select>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search for medicine and health products..."
                    className="flex-1 border rounded px-4 py-2 text-sm dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Right Side Buttons */}
              <div className="flex items-center gap-4">
                <NavbarButton variant="secondary">
                  <div className="flex items-center gap-2">
                    <MdAddShoppingCart />
                    <span>5</span>
                  </div>
                </NavbarButton>
                <NavbarButton variant="secondary">Login</NavbarButton>
              </div>
            </div>

            {/* Second Row: Navigation Menu (Desktop only) */}
            <div className="w-full flex justify-center">
              <NavigationMenuDemo />
            </div>
          </NavBody>

          {/* Mobile View */}
          <div className="block md:hidden">
            <MobileNav>
              <MobileNavHeader>
                <NavbarLogo />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </MobileNavHeader>

              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex flex-col gap-4 px-4 py-2">
                  {/* Search Bar Only (no location dropdown) */}
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded px-4 py-2 text-sm dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                {/* Navigation Items in Mobile Menu */}
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

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 px-4 py-4">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    <div className="flex items-center gap-2">
                      <MdAddShoppingCart />
                      <span>5</span>
                    </div>
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
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
