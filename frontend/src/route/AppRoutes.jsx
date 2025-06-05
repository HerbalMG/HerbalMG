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
