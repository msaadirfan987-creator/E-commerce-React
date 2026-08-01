import React from 'react';

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="h-28 rounded-3xl bg-slate-100 border border-slate-200" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="h-72 rounded-3xl bg-slate-100 border border-slate-200" />
      <div className="space-y-4 lg:col-span-2">
        <div className="h-40 rounded-3xl bg-slate-100 border border-slate-200" />
        <div className="h-32 rounded-3xl bg-slate-100 border border-slate-200" />
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
