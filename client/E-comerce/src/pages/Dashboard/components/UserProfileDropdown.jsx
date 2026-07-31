import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const UserProfileDropdown = ({ onClose }) => {
  const { user, logout } = useAuth();

  return (
    <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-50 p-2">
      {/* User Info info */}
      <div className="p-2 border-b border-slate-100 mb-2">
        <h4 className="text-xs font-bold text-slate-800 truncate">{user?.fullName || 'Seller'}</h4>
        <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
      </div>

      {/* Action links */}
      <div className="space-y-0.5">
        <a 
          href="/" 
          onClick={onClose}
          className="block px-2.5 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          View Storefront
        </a>

        <Link 
          to="/dashboard/settings" 
          onClick={onClose}
          className="block px-2.5 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Store Settings
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-150 mt-2 pt-1.5">
        <button 
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full text-left px-2.5 py-1.5 rounded text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          Logout Merchant
        </button>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
