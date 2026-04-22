import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import AdminPage from './pages/AdminPage';
import RegisterAdminPage from './pages/RegisterAdminPage';
import EditProductPage from './pages/EditProductPage';
import AddProductPage from './pages/AddProductPage';
import ProductsPage from './pages/ProductsPage';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:orderId" element={<OrderDetailPage />} />
                <Route path="/orders" element={<CustomerOrdersPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/products" element={<ProductsPage />} />
                <Route path="/admin/registerAdmin" element={<RegisterAdminPage />} />
                <Route path="/admin/editProduct/:productId" element={<EditProductPage />} />
                <Route path="/admin/addProduct" element={<AddProductPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
