import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, ShieldAlert, ShoppingBag, ShoppingCart, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Directory', path: '/admin/users', icon: Users },
    { name: 'Seller approvals', path: '/admin/sellers', icon: UserCheck },
    { name: 'Product catalog', path: '/admin/products', icon: ShoppingBag },
    { name: 'Platform orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/auth');
  };

  const getPageTitle = () => {
    const active = menuItems.find(item => item.path === location.pathname);
    return active ? active.name : 'Administration Panel';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased select-none">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 shrink-0">
        
        {/* Brand Logo header */}
        <div className="h-14 px-5 border-b border-slate-200 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-[11px] font-black">C</div>
          <span className="text-xs font-black text-slate-950 uppercase tracking-wider">Cartify Admin</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                  isActive 
                    ? 'bg-slate-100 text-slate-950 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50/50"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            View Storefront
          </Link>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50/40 rounded-lg transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 md:hidden animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-56 h-full bg-white flex flex-col border-r border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-black text-slate-950 uppercase tracking-wider">Cartify Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                      isActive 
                        ? 'bg-slate-100 text-slate-950 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-slate-100 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Storefront
              </Link>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 rounded-lg text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER NAVBAR */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 md:hidden text-slate-500 hover:text-slate-900"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-xs font-black text-slate-900 uppercase tracking-wider">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 leading-none">{user?.fullName || 'Administrator'}</span>
              <span className="text-[9px] text-slate-400 font-bold mt-0.5">{user?.email}</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              A
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
