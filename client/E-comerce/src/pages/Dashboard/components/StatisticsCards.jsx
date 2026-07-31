import React from 'react';

const StatisticsCards = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,890.00',
      change: '+14.2%',
      isPositive: true,
    },
    {
      title: 'Sales Volume',
      value: '384 Orders',
      change: '+8.4%',
      isPositive: true,
    },
    {
      title: 'Active Customers',
      value: '1,280 Users',
      change: '+18.7%',
      isPositive: true,
    },
    {
      title: 'Product Catalog',
      value: '48 Products',
      change: '-1.4%',
      isPositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, idx) => (
        <div 
          key={idx}
          className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {stat.title}
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {stat.value}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
            <span className={`text-[9px] font-bold ${
              stat.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {stat.change}
            </span>
            <span className="text-[9px] font-semibold text-slate-400">
              vs last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
