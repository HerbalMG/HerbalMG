import React from 'react'
import AppRoutes from './route/AppRoute'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import Orders from './pages/Orders'
import Customer from './pages/Customer'

const App = () => {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="ml-64 overflow-x-hidden min-h-screen">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/blog" element={<Blog />} /> */}
            <Route path="/products" element={<Product />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customer />} />
            {/* Other routes */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App