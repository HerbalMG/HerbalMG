import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black pt-10 pb-6 mt-10">
      {/* Top Section */}
      <div className="container mx-auto px-4 mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center text-center md:text-left gap-6">
          <h2 className="text-2xl font-bold md:w-1/3">HerbalMG</h2>
          <p className="mt-2 text-sm text-black md:w-2/3">
            At HerbalMG, we are committed to making healthcare simple,
            accessible, and affordable for everyone. As a leading online medical
            store, we offer a wide range of genuine medicines, health
            supplements, and wellness products—all available at your fingertips.
          </p>
        </div>                
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-black">
            <li>
              <Link to="/about-us" className="hover:text-black">
                About
              </Link>
            </li>
            <li>
              <Link to="/testimonial" className="hover:text-black">
                Words from Our Customers
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-black">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-black">
                Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Our Policies */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Policies</h3>
          <ul className="space-y-2 text-sm text-black">
            <li>
              <Link to="/terms-and-conditions" className="hover:text-black">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-black">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/return-and-refund-policy" className="hover:text-black">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-black">
                {" "}
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Social</h3>
          <ul className="space-y-2 text-sm text-black">
            <li>
              <a href="#" className="hover:text-black">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                YouTube
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Twitter
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-black mb-4">
            Subscribe now for free to receive exclusive health and fitness tips,
            and be the first to know about our latest offers and deals!
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded text-black focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom note */}
      <div className="text-center text-gray-400 text-xs mt-10">
        &copy; {new Date().getFullYear()} Herbal MG. All rights reserved. All medicines are dispensed in compliance with the Drugs and Cosmetics Act, 1940 and Drugs and Cosmetics Rules, 1945.
        <br />
        Crafted with 💙 by{" "}
        <a
          href="https://portfolio-shreyam91s-projects.vercel.app/"
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          @Shreyam
        </a>
      </div>
    </footer>
  );
};

export default Footer;
