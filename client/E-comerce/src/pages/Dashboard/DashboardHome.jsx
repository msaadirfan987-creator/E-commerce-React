import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatisticsCards from './components/StatisticsCards';
import SalesChart from './components/SalesChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 font-bold">
            Console parameters for {user?.fullName || 'Merchant'}. System active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {currentDate}
          </span>
          <Link 
            to="/dashboard/products/add" 
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <StatisticsCards />

      {/* Analytics Graph & Order logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <RecentOrdersTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
