import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/home';
import Shop from './pages/shop'; 
import SingleProduct from './pages/SingleProduct';
import AuthPage from './pages/AuthPage'; 

// Dashboard imports
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import ProductManagement from './pages/Dashboard/ProductManagement';
import AddProductForm from './pages/Dashboard/AddProductForm';
import EditProductPage from './pages/Dashboard/EditProductPage';
import CategoriesManagement from './pages/Dashboard/CategoriesManagement';
import OrdersManagement from './pages/Dashboard/OrdersManagement';
import CustomersList from './pages/Dashboard/CustomersList';
import ReviewsManagement from './pages/Dashboard/ReviewsManagement';
import CouponsManagement from './pages/Dashboard/CouponsManagement';
import InventoryManagement from './pages/Dashboard/InventoryManagement';
import AnalyticsPage from './pages/Dashboard/AnalyticsPage';
import EarningsPage from './pages/Dashboard/EarningsPage';
import MessagesPage from './pages/Dashboard/MessagesPage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import LogoutComponent from './pages/Dashboard/LogoutComponent';

// Simple temporary placeholders for remaining pages so they don't break
const About = () => <div className="p-12 text-center text-xl font-bold text-[#03045e]">About Us Page Coming Soon!</div>;
const Contact = () => <div className="p-12 text-center text-xl font-bold text-[#03045e]">Contact Page Coming Soon!</div>;

// Layout for the main storefront pages sharing the storefront Navbar
const ShopLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <Routes>
      {/* 1. Storefront Routes Group (wrapped in ShopLayout with global Navbar) */}
      <Route element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* 2. Seller/Admin Dashboard Protected Routes Group */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/add" element={<AddProductForm />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="customers" element={<CustomersList />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="coupons" element={<CouponsManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="logout" element={<LogoutComponent />} />
      </Route>
    </Routes>
  );
}

export default App;