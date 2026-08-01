import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, Mail, Globe } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';
import Notifications from './Notifications';
import SearchBar from '../../../components/SearchBar';

const TopNavbar = ({ toggleMobileSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 right-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-xs select-none">
      
      {/* Left Menu Trigger & Store Link */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileSidebar}
          className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 md:hidden cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <a 
          href="/" 
          target="_blank"
          rel="noopener noreferrer" 
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[10px] transition-colors"
        >
          <Globe className="w-3 h-3" />
          Storefront
        </a>
      </div>

      {/* Center Search */}
      <SearchBar placeholder="Search console..." containerClassName="hidden md:flex flex-1 max-w-xs mx-4" />

      {/* Right User Widgets */}
      <div className="flex items-center gap-3">
        
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 block w-1.5 h-1.5 rounded-full bg-slate-900" />
          </button>

          {showNotifications && (
            <Notifications onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Messaging link */}
        <a 
          href="/dashboard/messages" 
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 relative hidden sm:inline-block cursor-pointer"
        >
          <Mail className="w-4 h-4" />
        </a>

        <span className="w-px h-4 bg-slate-200" />

        {/* Profile menu trigger */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'S'}
            </div>
            <span className="hidden md:inline-block text-xs font-bold text-slate-700 truncate max-w-[80px]">
              {user?.fullName || 'Seller'}
            </span>
          </button>

          {showProfile && (
            <UserProfileDropdown onClose={() => setShowProfile(false)} />
          )}
        </div>

      </div>
    </header>
  );
};

export default TopNavbar;
