import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AnalyticsPage = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const isUserAdmin = user && user.role === 'admin';
        const endpoint = isUserAdmin ? '/api/dashboard/admin' : '/api/dashboard/seller';
        
        const response = await fetch(`${API_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setData(resData);
        } else {
          setError(resData.message || 'Failed to load system analytics.');
        }
      } catch (err) {
        setError('Error connecting to backend services.');
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchAnalytics();
    }
  }, [token, user]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Calculating database metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-4 rounded-lg">
        {error || 'Analytics reports could not be loaded.'}
      </div>
    );
  }

  const { stats } = data;

  // Calculate Average Order Value (AOV)
  const totalOrders = stats.totalOrders !== undefined ? stats.totalOrders : stats.ordersReceived || 0;
  const deliveredCount = stats.deliveredOrders || 0;
  const revenueVal = stats.totalRevenue || 0;
  const aov = deliveredCount > 0 ? (revenueVal / deliveredCount) : 0;

  // Render variables depending on role
  const isPlatformAdmin = user && user.role === 'admin';

  return (
    <div className="space-y-6 select-none animate-fadeIn font-sans pb-12">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">System Analytics</h2>
        <p className="text-xs text-slate-400 font-semibold">Monitor platform transaction ratios, order splits, and catalog distributions.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Average Order Value</span>
          <h3 className="text-base font-black text-slate-950 mt-1">${aov.toFixed(2)}</h3>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Delivered Rate</span>
          <h3 className="text-base font-black text-slate-950 mt-1">
            {totalOrders > 0 ? ((deliveredCount / totalOrders) * 100).toFixed(0) : 0}%
          </h3>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending Volume</span>
          <h3 className="text-base font-black text-slate-950 mt-1">{stats.pendingOrders || 0} Orders</h3>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cancelled Ratio</span>
          <h3 className="text-base font-black text-rose-600 mt-1">
            {totalOrders > 0 ? (((stats.cancelledOrders || 0) / totalOrders) * 100).toFixed(0) : 0}%
          </h3>
        </div>

      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status progress distribution */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-805 uppercase tracking-wider">Order Status Distribution</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ratio of orders across fulfillment states</p>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Delivered Orders', count: stats.deliveredOrders || 0, color: 'bg-emerald-600' },
              { label: 'Pending Queue', count: stats.pendingOrders || 0, color: 'bg-slate-400' },
              { label: 'Cancelled / Rejected', count: stats.cancelledOrders || 0, color: 'bg-rose-500' }
            ].map((item, idx) => {
              const countVal = item.count;
              const ratio = totalOrders > 0 ? ((countVal / totalOrders) * 100).toFixed(0) : 0;
              return (
                <div key={idx} className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-700">
                    <span>{item.label}</span>
                    <span className="text-slate-400">{countVal} units ({ratio}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${ratio}%` }} className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Catalog distribution ratios */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-805 uppercase tracking-wider">Inventory Metrics</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Distribution of products by listing and stock statuses</p>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Total Catalog Size', count: stats.totalProducts || 0, color: 'bg-slate-700' },
              { label: 'Low Stock Warnings', count: stats.lowStockProducts !== undefined ? stats.lowStockProducts : stats.lowStock || 0, color: 'bg-amber-500' },
              { label: 'Out of Stock Listings', count: stats.outOfStockProducts !== undefined ? stats.outOfStockProducts : stats.outOfStock || 0, color: 'bg-rose-500' }
            ].map((item, idx) => {
              const maxVal = stats.totalProducts || 10;
              const percentage = Math.min(100, Math.round((item.count / maxVal) * 100));
              return (
                <div key={idx} className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-700">
                    <span>{item.label}</span>
                    <span className="text-slate-400">{item.count} items</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${percentage}%` }} className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;
