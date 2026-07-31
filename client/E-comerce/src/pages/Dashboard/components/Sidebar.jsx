import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Star, 
  Ticket, 
  Boxes, 
  BarChart3, 
  CircleDollarSign, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, mobileOpen, closeMobileSidebar }) => {
  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/dashboard/products', icon: ShoppingBag },
    { name: 'Categories', path: '/dashboard/categories', icon: FolderTree },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/dashboard/customers', icon: Users },
    { name: 'Reviews', path: '/dashboard/reviews', icon: Star },
    { name: 'Coupons', path: '/dashboard/coupons', icon: Ticket },
    { name: 'Inventory', path: '/dashboard/inventory', icon: Boxes },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Earnings', path: '/dashboard/earnings', icon: CircleDollarSign },
    { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Logout', path: '/dashboard/logout', icon: LogOut, textRed: true },
  ];

  const sidebarClasses = `
    fixed md:sticky top-0 left-0 h-screen z-40
    bg-slate-900 text-slate-300 border-r border-slate-800
    transition-all duration-200 ease-in-out flex flex-col justify-between
    ${isOpen ? 'w-56' : 'w-16'}
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  return (
    <>
      {mobileOpen && (
        <div 
          onClick={closeMobileSidebar}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 h-14">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="bg-slate-800 p-1.5 rounded-md text-slate-200">
              <Store className="w-4 h-4" />
            </div>
            {isOpen && (
              <span className="font-bold text-xs tracking-wider text-white">
                CARTIFY HUB
              </span>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar} 
            className="hidden md:flex items-center justify-center p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={closeMobileSidebar}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all
                  ${isActive 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : item.textRed 
                      ? 'hover:bg-rose-500/10 text-rose-400' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {isOpen && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        {isOpen && (
          <div className="p-4 border-t border-slate-800 text-center text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
            Merchant Admin v1.0
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
