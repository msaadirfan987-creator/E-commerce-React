import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/logo.png';
import CartComponent from './CartComponent';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import messageService from '../services/messageService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const location = useLocation();
  const { user, logout } = useAuth();

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      setUnreadMessagesCount(0);
      return;
    }
    const fetchUnread = async () => {
      try {
        const data = await messageService.getConversations();
        if (data.success) {
          const count = data.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
          setUnreadMessagesCount(count);
        }
      } catch (err) {
        console.error('Failed to load unread messages:', err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-slate-100 select-none">
      
      {/* 2. Main Navigation Layer */}
      <div className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <img 
            src={logo} 
            alt="Cartify Logo" 
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          {[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/shop' },
            { name: 'Our Story', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`text-xs font-semibold tracking-wide py-1 transition-colors duration-150 relative ${
                isActive(link.path) ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-900" />
              )}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow max-w-sm relative mx-2">
          <div className="w-full flex items-center rounded-lg border border-slate-200 focus-within:border-slate-400 bg-slate-50/50 px-3 py-1.5 transition-all">
            <span className="text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Wishlist */}
          <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>

          {/* Cart */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
          
          {isCartOpen && (
            <CartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/50 flex items-center justify-center text-xs font-bold transition-all focus:outline-none"
            >
              {user ? (
                user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50 text-left"
                >
                  {user ? (
                    <>
                      <div className="pb-2.5 mb-2.5 border-b border-slate-100 px-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{user.fullName}</h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block text-[8px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                          {user.role === 'seller' ? 'Seller Hub' : 'Customer'}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          My Profile
                        </Link>
                        
                        <Link 
                          to="/my-orders" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
                        >
                          My Orders
                        </Link>

                        <Link 
                          to="/messages" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          Messages
                          {unreadMessagesCount > 0 && (
                            <span className="ml-auto bg-slate-900 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white">
                              {unreadMessagesCount}
                            </span>
                          )}
                        </Link>

                        {user.role === 'seller' && (
                          <Link 
                            to="/dashboard" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            Seller Dashboard
                          </Link>
                        )}

                        {user.role === 'admin' && (
                          <Link 
                            to="/admin/dashboard" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            Admin Dashboard
                          </Link>
                        )}

                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed px-1 mb-3">
                        Please login to view profiles, track shipments, and checkout items.
                      </p>
                      
                      <Link
                        to="/auth"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full text-white bg-slate-900 hover:bg-slate-800 text-xs font-bold py-2 rounded-lg text-center transition-all block"
                      >
                        Login / Register
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger menu */}
          <button 
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full bg-white shadow-lg border-t border-slate-100 p-4 flex flex-col gap-4 lg:hidden z-50"
          >
            <div className="flex flex-col gap-0.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/shop' },
                { name: 'Our Story', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-sm font-semibold py-2.5 px-2 rounded-lg hover:bg-slate-50 flex items-center justify-between ${
                    isActive(link.path) ? 'text-slate-950 bg-slate-50' : 'text-slate-600'
                  }`} 
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Navbar;