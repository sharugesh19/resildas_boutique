import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home          from '../pages/Home'
import Products      from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Wishlist      from '../pages/Wishlist'
import Login         from '../pages/Login'
import Checkout      from '../pages/Checkout'
import NotFound      from '../pages/NotFound'
import ProtectedWishlist from '../components/common/ProtectedWishlist'
import AdminRoutes   from '../admin/AdminRoutes'

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"                   element={<Home />} />
      <Route path="/products"           element={<Products />} />
      <Route path="/products/:category" element={<Products />} />
      <Route path="/product/:id"        element={<ProductDetail />} />
      <Route path="/login"              element={<Login />} />
      <Route path="/checkout"           element={<Checkout />} />

      {/* Protected — login required */}
      <Route
        path="/wishlist"
        element={
          <ProtectedWishlist>
            <Wishlist />
          </ProtectedWishlist>
        }
      />

      {/* Admin Panel */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes