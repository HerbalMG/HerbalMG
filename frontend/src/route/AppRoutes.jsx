import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login/Login'
import OrderSuccess from '../pages/OrderSuccess'
import OrderHistory from '../pages/OrderHistory'
import About from '../pages/footerData/About';
import Terms from '../pages/footerData/Terms';
import PrivacyPolicy from '../pages/footerData/PrivacyPolicy';
import RefundPolicy from '../pages/footerData/RefundPolicy';
import FAQ from '../pages/footerData/FAQ';
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
import CategoryPage from '../pages/CategoryPage';
import CategoriesPage from '../pages/CategoriesPage';
import DiseasePage from '../pages/DiseasePage';
import BrandsPage from '../pages/BrandsPage';
import Products from '../pages/Products';
import { useState } from 'react';

const AppRoutes = () => {
  // const [screen, setScreen] = useState('login');
  // const [userId, setUserId] = useState(null);

  // const handleLogin = (next, id) => {
  //   setUserId(id);
  //   setScreen(next);
  // };
  return (
    <Routes>
      {/* -------------  */}
       {screen === 'login' && <Login onLogin={handleLogin} />}
      {screen === 'user-profile' && <UserProfile userId={userId} onComplete={() => setScreen('home')} />}
      {screen === 'home' && <h1 className="text-center mt-20 text-2xl">🏠 Welcome Home!</h1>}
      {/* -----------------------  */}
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/category/:categorySlug/product/:productSlug" element={<ProductDetail />} />
      <Route path="/brand/:brandSlug/product/:productSlug" element={<ProductDetail />} />
      <Route path="/health-concern/:diseaseSlug/product/:productSlug" element={<ProductDetail />} />
      {/* <Route path="/product/:id" element={<ProductDetailPage />} /> */}


      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
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
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/:categorySlug" element={<CategoryPage />} />
      <Route path="/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/disease/:diseaseSlug" element={<DiseasePage />} />
      <Route path="/health-concern/:diseaseSlug" element={<DiseasePage />} />
      <Route path="/brands" element={<BrandsPage />} />

      <Route path="/unani" element={<Unani/>} />
      <Route path='/ayurvedic' element={<Ayurvedic/>} />

      <Route path="/profile" element={<UserProfile/>} />
      <Route path="/doctors" element={<DoctorPage/>} />
      <Route path="/brand/:brandSlug" element={<BrandProducts />} />
      <Route path="/brands/:brandSlug" element={<BrandProducts />} />
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
