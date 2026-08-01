import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import orderService from '../services/orderService';
import messageService from '../services/messageService';
import productService from '../services/productService';

// Reusable profile components
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInformation from '../components/profile/ProfileInformation';
import SecuritySection from '../components/profile/SecuritySection';
import AddressSection from '../components/profile/AddressSection';

import { 
  User, MapPin, ShieldAlert, ShoppingBag, Heart, 
  MessageSquare, LayoutDashboard, Database, Users, 
  CheckSquare, BarChart, Settings, Loader2 
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  
  // Page states
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile-info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buyer statistics
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Seller statistics
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerProductsCount, setSellerProductsCount] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authUser) {
      navigate('/auth');
    }
  }, [authUser, navigate]);

  // Load profile details and statistics
  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const profileRes = await userService.getUserProfile();
      if (profileRes.success) {
        setUser(profileRes.user);
        
        // Load role-based metrics
        if (profileRes.user.role === 'customer') {
          // 1. Fetch buyer orders
          try {
            const ordersData = await orderService.getBuyerOrders();
            if (ordersData.success) setBuyerOrders(ordersData.orders || []);
          } catch (e) {
            console.error("Error loading buyer orders:", e);
          }

          // 2. Fetch Wishlist items count
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setWishlistCount(localWishlist.length);
        } 
        else if (profileRes.user.role === 'seller') {
          // 1. Fetch seller orders
          try {
            const sOrdersData = await orderService.getSellerOrders();
            if (sOrdersData.success) setSellerOrders(sOrdersData.orders || []);
          } catch (e) {
            console.error("Error loading seller orders:", e);
          }

          // 2. Fetch seller products
          try {
            const productsData = await productService.getProducts();
            if (productsData.success) {
              const myProducts = (productsData.products || []).filter(p => p.seller === profileRes.user._id || p.seller?._id === profileRes.user._id);
              setSellerProductsCount(myProducts.length);
            }
          } catch (e) {
            console.error("Error loading seller products:", e);
          }
        }

        // Fetch unread messages
        try {
          const chatsData = await messageService.getConversations();
          if (chatsData.success) {
            const count = chatsData.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
            setUnreadMessages(count);
          }
        } catch (e) {
          console.error("Error loading messages count:", e);
        }

      } else {
        setError('Failed to retrieve user profile.');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        // Token expired/invalid - logout and redirect
        logout();
        navigate('/auth');
      } else {
        setError('Connection issues loading your profile details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      loadProfileData();
    }
  }, [authUser]);

  // If loading, show professional skeleton state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 py-10 select-none font-sans">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            {/* Header skeleton */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 animate-pulse mb-6">
              <div className="w-20 h-20 bg-slate-200 rounded-full shrink-0" />
              <div className="flex-grow space-y-3 w-full">
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-3.5 bg-slate-200 rounded w-1/4" />
                <div className="flex gap-2">
                  <div className="h-5 bg-slate-200 rounded-full w-16" />
                  <div className="h-5 bg-slate-200 rounded-full w-20" />
                </div>
              </div>
            </div>

            {/* Sidebar + content skeleton */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 animate-pulse">
                <div className="h-4 bg-slate-150 rounded w-1/2 mb-4" />
                <div className="h-8 bg-slate-200 rounded-xl w-full" />
                <div className="h-8 bg-slate-200 rounded-xl w-full" />
                <div className="h-8 bg-slate-200 rounded-xl w-full" />
              </div>
              <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 pb-2 border-b" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-slate-200 rounded-lg w-full" />
                  <div className="h-10 bg-slate-200 rounded-lg w-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate order counters
  const getOrderCounts = (ordersList) => {
    return {
      total: ordersList.length,
      pending: ordersList.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Packed').length,
      delivered: ordersList.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: ordersList.filter(o => o.orderStatus === 'Cancelled' || o.orderStatus === 'Rejected').length
    };
  };

  const buyerOrderStats = getOrderCounts(buyerOrders);
  const sellerOrderStats = getOrderCounts(sellerOrders);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 py-10 select-none font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-4 rounded-xl shadow-xs">
              {error}
            </div>
          )}

          {/* Profile Header section */}
          <ProfileHeader user={user} />

          {/* Core Panel Grid: Left Navigation / Right Views */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* LEFT SIDEBAR: Navigations */}
            <aside className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1.5 sticky top-24">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-2">Account Dashboard</h3>
              
              {/* Profile Details Tab */}
              <button
                onClick={() => setActiveTab('profile-info')}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'profile-info' 
                    ? 'bg-slate-900 text-white shadow-3xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
                }`}
              >
                <User className="w-4 h-4" />
                Profile Info
              </button>

              {/* Addresses Tab - Buyer Only */}
              {user.role === 'customer' && (
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'addresses' 
                      ? 'bg-slate-900 text-white shadow-3xs' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Shipping Addresses
                </button>
              )}

              {/* Security/Password Tab */}
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'security' 
                    ? 'bg-slate-900 text-white shadow-3xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Security Settings
              </button>

              {/* Role-Based Dashboard Redirection links */}
              {user.role === 'seller' && (
                <Link
                  to="/dashboard"
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer block"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  Seller Dashboard
                </Link>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/dashboard"
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer block"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  Admin Console
                </Link>
              )}

            </aside>

            {/* RIGHT SIDE: Sub-Section Renderer */}
            <main className="flex-1 w-full space-y-6">
              
              {/* Tab Renderer */}
              {activeTab === 'profile-info' && (
                <ProfileInformation user={user} onProfileUpdate={setUser} />
              )}

              {activeTab === 'addresses' && user.role === 'customer' && (
                <AddressSection />
              )}

              {activeTab === 'security' && (
                <SecuritySection />
              )}

              {/* ROLE-BASED QUICK METRICS PANELS */}
              {activeTab === 'profile-info' && (
                <div className="space-y-6">
                  
                  {/* Category separator */}
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="font-black text-xs text-slate-400 uppercase tracking-wider">Metrics & Summary</h3>
                  </div>

                  {/* 1. Buyer Layout */}
                  {user.role === 'customer' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Orders Summary widget */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <ShoppingBag className="w-4 h-4 text-slate-600" />
                            My Orders
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                            <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-center">
                              <span className="block text-sm font-black text-slate-800">{buyerOrderStats.total}</span>
                              Total
                            </div>
                            <div className="bg-amber-50/50 border border-amber-100 p-2 rounded-lg text-center">
                              <span className="block text-sm font-black text-amber-800">{buyerOrderStats.pending}</span>
                              Pending
                            </div>
                            <div className="bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg text-center">
                              <span className="block text-sm font-black text-emerald-800">{buyerOrderStats.delivered}</span>
                              Delivered
                            </div>
                            <div className="bg-rose-50/50 border border-rose-100 p-2 rounded-lg text-center">
                              <span className="block text-sm font-black text-rose-800">{buyerOrderStats.cancelled}</span>
                              Cancelled
                            </div>
                          </div>
                        </div>

                        <Link 
                          to="/my-orders" 
                          className="w-full text-center text-[10px] font-black text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 py-1.5 rounded-lg transition-all uppercase tracking-wider block"
                        >
                          View All Orders
                        </Link>
                      </div>

                      {/* Wishlist Summary widget */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-slate-600" />
                            Wishlist
                          </h4>
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                            <span className="block text-2xl font-black text-slate-850">{wishlistCount}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">Saved Items</span>
                          </div>
                        </div>

                        <Link 
                          to="/shop" 
                          className="w-full text-center text-[10px] font-black text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 py-1.5 rounded-lg transition-all uppercase tracking-wider block"
                        >
                          View Wishlist
                        </Link>
                      </div>

                      {/* Messages Summary widget */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-slate-600" />
                            Messages
                          </h4>
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                            <span className="block text-2xl font-black text-slate-850">{unreadMessages}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">Unread Chats</span>
                          </div>
                        </div>

                        <Link 
                          to="/messages" 
                          className="w-full text-center text-[10px] font-black text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 py-1.5 rounded-lg transition-all uppercase tracking-wider block"
                        >
                          Open Messages
                        </Link>
                      </div>

                    </div>
                  )}

                  {/* 2. Seller Layout */}
                  {user.role === 'seller' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Catalog & Orders stats */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-slate-600" />
                          Seller Statistics
                        </h4>
                        
                        <div className="grid grid-cols-3 gap-3 text-[10px] font-bold text-slate-500">
                          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-center">
                            <span className="block text-base font-black text-slate-800">{sellerProductsCount}</span>
                            Active Products
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-center">
                            <span className="block text-base font-black text-slate-800">{sellerOrderStats.total}</span>
                            Total Orders
                          </div>
                          <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg text-center">
                            <span className="block text-base font-black text-amber-800">{sellerOrderStats.pending}</span>
                            Pending Orders
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link 
                            to="/dashboard/products" 
                            className="flex-1 text-center text-[9px] font-black text-slate-650 hover:text-slate-900 border border-slate-200 hover:border-slate-355 py-2 rounded-lg transition-all uppercase tracking-wider block"
                          >
                            My Products
                          </Link>
                          <Link 
                            to="/dashboard/orders" 
                            className="flex-1 text-center text-[9px] font-black text-slate-655 hover:text-slate-900 border border-slate-200 hover:border-slate-355 py-2 rounded-lg transition-all uppercase tracking-wider block"
                          >
                            Seller Orders
                          </Link>
                        </div>
                      </div>

                      {/* Revenue & Messages widget */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            <BarChart className="w-4 h-4 text-slate-600" />
                            Earnings & Inbox
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-500">
                            <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-lg text-center">
                              <span className="block text-lg font-black text-emerald-800">${user.revenue ? user.revenue.toLocaleString() : '0'}</span>
                              Total Revenue
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
                              <span className="block text-lg font-black text-slate-800">{unreadMessages}</span>
                              Unread Messages
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link 
                            to="/messages" 
                            className="flex-1 text-center text-[9px] font-black text-slate-655 hover:text-slate-900 border border-slate-200 hover:border-slate-355 py-2 rounded-lg transition-all uppercase tracking-wider block"
                          >
                            Messages
                          </Link>
                          <Link 
                            to="/dashboard" 
                            className="flex-1 text-center text-[9px] font-black text-white bg-slate-900 hover:bg-slate-800 py-2 rounded-lg transition-all uppercase tracking-wider block"
                          >
                            Dashboard
                          </Link>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 3. Admin Layout */}
                  {user.role === 'admin' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                      <div className="border-b border-slate-100 pb-2">
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-slate-600" />
                          Admin Command Shortcuts
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-bold text-slate-650">
                        <Link 
                          to="/dashboard" 
                          className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-3 rounded-xl text-center transition-all block cursor-pointer"
                        >
                          <LayoutDashboard className="w-5 h-5 mx-auto mb-1.5 text-slate-500" />
                          Dashboard Home
                        </Link>
                        <Link 
                          to="/dashboard/customers" 
                          className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-3 rounded-xl text-center transition-all block cursor-pointer"
                        >
                          <Users className="w-5 h-5 mx-auto mb-1.5 text-slate-500" />
                          User Database
                        </Link>
                        <Link 
                          to="/dashboard/reviews" 
                          className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-3 rounded-xl text-center transition-all block cursor-pointer"
                        >
                          <CheckSquare className="w-5 h-5 mx-auto mb-1.5 text-slate-500" />
                          Reviews Control
                        </Link>
                        <Link 
                          to="/dashboard/analytics" 
                          className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-3 rounded-xl text-center transition-all block cursor-pointer"
                        >
                          <BarChart className="w-5 h-5 mx-auto mb-1.5 text-slate-500" />
                          System Analytics
                        </Link>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </main>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
