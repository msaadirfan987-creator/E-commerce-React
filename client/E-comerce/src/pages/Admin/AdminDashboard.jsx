import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, ShieldAlert, ShoppingBag, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setStats(data.stats);
        } else {
          setError(data.message || 'Failed to load dashboard metrics.');
        }
      } catch (err) {
        setError('Connection issues contacting admin database.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Retrieving platform stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-4 rounded-lg">
        {error || 'Stats metrics could not be fetched.'}
      </div>
    );
  }

  const statCards = [
    { name: 'Estimated Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
    { name: 'Total Platform Users', value: stats.totalUsers, icon: Users, color: 'text-slate-700', bg: 'bg-slate-50' },
    { name: 'Customer Accounts', value: stats.totalBuyers, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50/40' },
    { name: 'Registered Merchants', value: stats.totalSellers, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50/40' },
    { name: 'Pending Approvals', value: stats.pendingSellers, icon: ShieldAlert, color: stats.pendingSellers > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-400', bg: 'bg-amber-50/50' },
    { name: 'Catalog Listings', value: stats.totalProducts, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50/40' },
    { name: 'Platform Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-teal-600', bg: 'bg-teal-50/40' },
    { name: 'Suspended Accounts', value: stats.blockedUsers, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50/40' },
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div>
        <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Dashboard Overview</h2>
        <p className="text-xs text-slate-400 font-bold">Monitor platform scale, moderate active accounts, and track transactions.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">{card.name}</span>
                <span className="text-xl font-black text-slate-950 block">{card.value}</span>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bg} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick shortcuts and notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Pending approvals checklist shortcut */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Action Items</h3>
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100/50">
              {stats.pendingSellers} Pending Sellers
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            There are currently {stats.pendingSellers} new merchant registration requests waiting for audit approval. Sellers cannot upload or manage product catalogs until approved.
          </p>

          <Link
            to="/admin/sellers"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:gap-1.5 transition-all"
          >
            Review approvals list <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Database setup metrics */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Platform Integrity</h3>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100/50">
              Active
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Role-Based Access Control and 6-digit email authentication are successfully deployed. Super Admin is seeded. Block checks are enforced inside backend protect middlewares.
          </p>

          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:gap-1.5 transition-all"
          >
            Audit user directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
