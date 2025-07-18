import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./route/AppRoutes";
import Footer from './components/Footer'
import GlobalLoader from './components/GlobalLoader';
import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';

import { FaWhatsapp } from "react-icons/fa";


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-16 w-16 mb-4 animate-bounce"
        />
        <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
          HerbalMG
        </h1>
      </div>
    );
  }

  return (
    <div>
    <Toaster position="top-right" reverseOrder={false} />
    <CartProvider>
        <div className="min-h-screen">
          <Navbar />
           <GlobalLoader />
          <main className="container mx-auto px-4 py-8">
            <AppRoutes/>
          </main>
          <Footer />
        </div>
    </CartProvider>

    <a
        href="https://wa.me/3434534343"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  );
}

export default App;
