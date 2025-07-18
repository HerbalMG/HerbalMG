import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import OrderSuccess from '../pages/OrderSuccess'
import OrderHistory from '../pages/OrderHistory'
import About from '../pages/About';
import Terms from '../pages/Terms';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import RefundPolicy from '../pages/RefundPolicy';
import FAQ from '../pages/FAQ';
import Testimonials from '../pages/Testimonials';
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';
import Offers from '../pages/Offers';
import Contact from '../pages/Contact';
import UserProfile from '../pages/UserProfile';
import DoctorPage from '../pages/DoctorPage';
import BrandProducts from '../pages/BrandProducts';
import NotFound from '../pages/NotFound';
import HomeoPathic from '../pages/HomeoPathic';
import Unani from '../pages/Unani';
import Ayurvedic from '../pages/Ayurvedic';
import Search from '../pages/Search';
import RequestProduct from '../pages/RequestProduct';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/terms-and-conditions" element={<Terms />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
      <Route path="/return-and-refund-policy" element={<RefundPolicy/>} />
      <Route path="/faq" element={<FAQ/>} />
      <Route path="/testimonial" element={<Testimonials/>} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/homeopathic" element={<HomeoPathic/>} />

      <Route path="/unani" element={<Unani/>} />
      <Route path='/ayurvedic' element={<Ayurvedic/>} />

      <Route path="/profile" element={<UserProfile/>} />
      <Route path="/doctors" element={<DoctorPage/>} />
      <Route path="/brand/:brandId" element={<BrandProducts />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/search" element={<Search />} />
      <Route path="/request-product" element={<RequestProduct />} />


      {/* Protected Routes (require login) */}
      {/* <Route path="/profile" element={
        <PrivateRoute>
          <UserProfile />
        </PrivateRoute>
      } />

      <Route path="/orders" element={
        <PrivateRoute>
          <OrderHistory />
        </PrivateRoute>
      } /> */}

      {/* Redirect unmatched routes to Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
