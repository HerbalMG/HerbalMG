import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import Product from '../pages/Product';
import Orders from '../pages/Orders';
import Customer from '../pages/Customer';
import Inventory from '../pages/Inventory';
import DeliveryStatus from '../pages/DeliveryStatus';
import PaymentPage from '../pages/PaymentPage';
import Blog from '../pages/Blog';
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Product /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="/customers" element={<PrivateRoute><Customer /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
      <Route path="/delivery-status" element={<PrivateRoute><DeliveryStatus /></PrivateRoute>} />
      <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
      <Route path="/blogs" element={<PrivateRoute><Blog /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
