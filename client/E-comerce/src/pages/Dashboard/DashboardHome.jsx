import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SalesChart from './components/SalesChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard/seller`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setData(resData);
        } else {
          setError(resData.message || 'Failed to load merchant metrics.');
        }
      } catch (err) {
        setError('Connection issues contacting database.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSellerData();
    }
  }, [token]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Retrieving merchant stats...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-4 rounded-lg">
        {error || 'Dashboard metrics could not be loaded.'}
      </div>
    );
  }

  const { stats, recentOrders, charts } = data;

  const cardList = [
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}` },
    { name: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(2)}` },
    { name: 'Monthly Revenue', value: `$${stats.monthRevenue.toFixed(2)}` },
    { name: 'Total Products', value: stats.totalProducts },
    { name: 'Active Products', value: stats.activeProducts },
    { name: 'Draft Products', value: stats.draftProducts },
    { name: 'Low Stock Items', value: stats.lowStock, valueColor: stats.lowStock > 0 ? 'text-amber-600' : '' },
    { name: 'Out Of Stock', value: stats.outOfStock, valueColor: stats.outOfStock > 0 ? 'text-rose-600 font-bold' : '' },
    { name: 'Orders Received', value: stats.ordersReceived },
    { name: 'Pending Orders', value: stats.pendingOrders },
    { name: 'Delivered Orders', value: stats.deliveredOrders },
    { name: 'Cancelled Orders', value: stats.cancelledOrders },
    { name: 'Average Rating', value: stats.averageRating.toFixed(1) },
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">
            Merchant Overview
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Real-time shop parameters for {user?.fullName || 'Seller'}. System active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {currentDate}
          </span>
          <Link 
            to="/dashboard/products/add" 
            className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Minimalist SaaS Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {cardList.map((card, idx) => (
          <div 
            key={idx}
            className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between shadow-xs"
          >
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              {card.name}
            </span>
            <span className={`text-base font-black text-slate-950 block ${card.valueColor || ''}`}>
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Graph & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <SalesChart chartData={charts?.salesChart} />
        </div>
        <div className="lg:col-span-1">
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
