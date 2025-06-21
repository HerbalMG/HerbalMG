import React from 'react'
import AppRoutes from './route/AppRoute'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import Orders from './pages/Orders'
import Customer from './pages/Customer'
import Inventory from './pages/Inventory'
import DeliveryStatus from './pages/DeliveryStatus'

const App = () => {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="ml-60 overflow-x-hidden min-h-screen">
        <Navbar />
        <main className="p-3">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/blog" element={<Blog />} /> */}
            <Route path="/products" element={<Product />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/delivery-status" element={<DeliveryStatus />} />
            {/* Other routes */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App