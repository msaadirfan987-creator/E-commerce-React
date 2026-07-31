import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogoutComponent = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="max-w-md mx-auto select-none animate-fadeIn py-10">
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs space-y-4 text-center">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Confirm Logout</h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Are you sure you want to end your current merchant console session?
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3.5 py-1.5 border border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirmLogout}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Logout Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutComponent;
