import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4 select-none">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-slate-900 animate-spin"></div>
        </div>
        <p className="text-slate-400 font-bold text-xs animate-pulse tracking-wider">SECURELY LOADING SESSION...</p>
      </div>
    );
  }

  // Check login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
