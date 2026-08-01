import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AppLoader from './components/loaders/AppLoader';
import PageLoader from './components/loaders/PageLoader';

const Home = lazy(() => import('./pages/home'));
const Shop = lazy(() => import('./pages/shop'));
const SingleProduct = lazy(() => import('./pages/SingleProduct'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));

// Admin imports
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const SellerApprovals = lazy(() => import('./pages/Admin/SellerApprovals'));
const ProductModeration = lazy(() => import('./pages/Admin/ProductModeration'));
const OrderModeration = lazy(() => import('./pages/Admin/OrderModeration'));
const ContactMessages = lazy(() => import('./pages/Admin/ContactMessages'));

// Dashboard imports
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const DashboardLayout = lazy(() => import('./pages/Dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/Dashboard/DashboardHome'));
const ProductManagement = lazy(() => import('./pages/Dashboard/ProductManagement'));
const AddProductForm = lazy(() => import('./pages/Dashboard/AddProductForm'));
const EditProductPage = lazy(() => import('./pages/Dashboard/EditProductPage'));
const CategoriesManagement = lazy(() => import('./pages/Dashboard/CategoriesManagement'));
const OrdersManagement = lazy(() => import('./pages/Dashboard/OrdersManagement'));
const CustomersList = lazy(() => import('./pages/Dashboard/CustomersList'));
const ReviewsManagement = lazy(() => import('./pages/Dashboard/ReviewsManagement'));
const CouponsManagement = lazy(() => import('./pages/Dashboard/CouponsManagement'));
const InventoryManagement = lazy(() => import('./pages/Dashboard/InventoryManagement'));
const AnalyticsPage = lazy(() => import('./pages/Dashboard/AnalyticsPage'));
const EarningsPage = lazy(() => import('./pages/Dashboard/EarningsPage'));
const MessagesPage = lazy(() => import('./pages/Dashboard/MessagesPage'));
const SettingsPage = lazy(() => import('./pages/Dashboard/SettingsPage'));
const LogoutComponent = lazy(() => import('./pages/Dashboard/LogoutComponent'));

// Layout for the main storefront pages sharing the storefront Navbar
const ShopLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppLoading(false), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (appLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [appLoading]);

  return (
    <>
      <AnimatePresence>
        {appLoading && <AppLoader />}
      </AnimatePresence>
      <Suspense fallback={<PageLoader message="Loading page content..." />}>
        <Routes>
          {/* 1. Storefront Routes Group (wrapped in ShopLayout with global Navbar) */}
          <Route element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-orders/:id" element={<OrderDetailsPage />} />
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

      {/* 3. Administrative Panel Protected Routes Group */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="sellers" element={<SellerApprovals />} />
        <Route path="products" element={<ProductModeration />} />
        <Route path="orders" element={<OrderModeration />} />
        <Route path="contacts" element={<ContactMessages />} />
      </Route>
    </Routes>
      </Suspense>
    </>
  );
}

export default App;