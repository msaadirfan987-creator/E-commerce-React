import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If auth state is still loading from local storage, display an elegant modern loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <div className="relative w-12 h-12">
          {/* Pulsing layers for rich aesthetic feel */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="text-slate-500 font-bold text-xs animate-pulse tracking-wider">SECURELY LOADING SESSION...</p>
      </div>
    );
  }

  // If no user is logged in, redirect to authentication page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in but is NOT a seller, block access and redirect to Home
  if (user.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  // If user is an authenticated seller, render the dashboard content
  return children;
};

export default ProtectedRoute;
