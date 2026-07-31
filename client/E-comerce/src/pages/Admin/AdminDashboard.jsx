import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SalesChart from '../Dashboard/components/SalesChart';
import { ArrowRight, ShoppingBag, Users, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setData(resData);
        } else {
          setError(resData.message || 'Failed to load platform metrics.');
        }
      } catch (err) {
        setError('Connection issues contacting database.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Retrieving platform stats...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-4 rounded-lg">
        {error || 'Stats metrics could not be fetched.'}
      </div>
    );
  }

  const { stats, recentOrders, recentUsers, recentProducts, topProducts, topSellers, charts } = data;

  const revenueCards = [
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign },
    { name: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(2)}`, icon: DollarSign },
    { name: "This Month's Revenue", value: `$${stats.monthRevenue.toFixed(2)}`, icon: DollarSign },
  ];

  const orderCards = [
    { name: 'Total Orders', value: stats.totalOrders },
    { name: 'Pending Orders', value: stats.pendingOrders },
    { name: 'Delivered Orders', value: stats.deliveredOrders },
    { name: 'Cancelled Orders', value: stats.cancelledOrders },
  ];

  const userCards = [
    { name: 'Total Buyers', value: stats.totalBuyers },
    { name: 'Total Sellers', value: stats.totalSellers },
    { name: 'Pending Sellers', value: stats.pendingSellers, highlight: stats.pendingSellers > 0 },
    { name: 'Approved Sellers', value: stats.approvedSellers },
    { name: 'Blocked Users', value: stats.blockedUsers },
  ];

  const productCards = [
    { name: 'Total Products', value: stats.totalProducts },
    { name: 'Out Of Stock', value: stats.outOfStockProducts, highlight: stats.outOfStockProducts > 0 },
    { name: 'Low Stock Items', value: stats.lowStockProducts },
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn font-sans pb-12">
      
      {/* Title */}
      <div>
        <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Dashboard Overview</h2>
        <p className="text-xs text-slate-400 font-semibold">Monitor platform scale, moderate active accounts, and track transactions.</p>
      </div>

      {/* 1. Metric Sections */}
      <div className="space-y-4">
        
        {/* Section title */}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Financial Performance</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {revenueCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">{card.name}</span>
                  <span className="text-lg font-black text-slate-950 block">{card.value}</span>
                </div>
                <div className="p-2 bg-slate-50 text-slate-500 rounded border border-slate-100">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Catalog and Operations Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Orders */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Orders Audit</span>
            <div className="grid grid-cols-2 gap-3">
              {orderCards.map((card, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">{card.name}</span>
                  <span className="text-base font-black text-slate-950 block">{card.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accounts */}
          <div className="space-y-2 lg:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Users</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {userCards.map((card, idx) => (
                <div key={idx} className={`bg-white border border-slate-200 p-4 rounded-lg shadow-xs ${card.highlight ? 'border-amber-300 bg-amber-50/20' : ''}`}>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">{card.name}</span>
                  <span className={`text-base font-black text-slate-950 block ${card.highlight ? 'text-amber-700 font-black' : ''}`}>{card.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Product Stock */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inventory Health</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {productCards.map((card, idx) => (
              <div key={idx} className={`bg-white border border-slate-200 p-4 rounded-lg flex justify-between items-center shadow-xs ${card.highlight ? 'border-rose-350 bg-rose-50/10' : ''}`}>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">{card.name}</span>
                  <span className={`text-base font-black text-slate-950 block ${card.highlight ? 'text-rose-600' : ''}`}>{card.value}</span>
                </div>
                {card.highlight && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Graph & Status chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2">
          <SalesChart chartData={charts?.salesChart} />
        </div>
        
        {/* Order Status Chart / Breakdown */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Order Status Distribution</h3>
          </div>
          <div className="space-y-3.5 mt-2">
            {charts?.orderStatusChart && charts.orderStatusChart.length > 0 ? (
              charts.orderStatusChart.map((status, idx) => {
                const percentage = stats.totalOrders > 0 ? ((status.count / stats.totalOrders) * 100).toFixed(0) : 0;
                return (
                  <div key={idx} className="space-y-1 text-xs font-semibold">
                    <div className="flex justify-between text-slate-700">
                      <span>{status._id}</span>
                      <span className="text-slate-400">{status.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${percentage}%` }} className="bg-slate-700 h-full rounded-full" />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 font-semibold text-center text-xs py-8">No Orders Logged</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Feeds & Top logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Top selling products */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Selling Products</h3>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">By Units Sold</span>
          </div>
          <div className="divide-y divide-slate-100">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-800 truncate max-w-[200px]">{p.title}</span>
                  <span className="text-slate-500 font-bold">{p.quantitySold} Sold <span className="text-slate-300 font-normal">|</span> ${p.totalRevenue.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-semibold text-center text-xs py-8">No Products Sold</p>
            )}
          </div>
        </div>

        {/* Top sellers */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Performing Merchants</h3>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">By Total Revenue</span>
          </div>
          <div className="divide-y divide-slate-100">
            {topSellers && topSellers.length > 0 ? (
              topSellers.map((s, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <span className="text-slate-800 block">{s.fullName}</span>
                    <span className="text-[9px] text-slate-400 block">{s.email}</span>
                  </div>
                  <span className="text-slate-550 font-bold">${s.totalRevenue.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-semibold text-center text-xs py-8">No Revenue Yet</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. Recent Feeds Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
        
        {/* Recent Orders */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Orders</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((o, idx) => (
                <div key={idx} className="pt-2.5 flex justify-between items-start text-xs font-semibold">
                  <div>
                    <span className="font-mono font-bold text-slate-800 block">#{o.orderNumber}</span>
                    <span className="text-[9px] text-slate-450 block">{o.buyer?.fullName || 'Customer'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-900 font-bold block">${o.totalPrice.toFixed(2)}</span>
                    <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block">{o.orderStatus}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-semibold text-center text-xs py-8">No Orders Found</p>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Products</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {recentProducts && recentProducts.length > 0 ? (
              recentProducts.map((p, idx) => (
                <div key={idx} className="pt-2.5 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <span className="text-slate-800 block truncate max-w-[150px]">{p.title}</span>
                    <span className="text-[9px] text-slate-400 block">{p.seller?.fullName || 'Platform'}</span>
                  </div>
                  <span className="text-slate-900 font-bold">${p.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-semibold text-center text-xs py-8">No Products Found</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Registrations</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((u, idx) => (
                <div key={idx} className="pt-2.5 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <span className="text-slate-800 block">{u.fullName}</span>
                    <span className="text-[9px] text-slate-400 block">{u.email}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-450 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{u.role}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-semibold text-center text-xs py-8">No Buyers</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
