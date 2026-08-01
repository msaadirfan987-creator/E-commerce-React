import React from 'react';

const CardSkeleton = () => (
  <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 space-y-4">
    <div className="h-40 rounded-3xl bg-slate-100" />
    <div className="h-4 w-2/3 rounded-full bg-slate-100" />
    <div className="h-4 w-1/2 rounded-full bg-slate-100" />
    <div className="grid grid-cols-2 gap-3">
      <div className="h-9 rounded-full bg-slate-100" />
      <div className="h-9 rounded-full bg-slate-100" />
    </div>
  </div>
);

export default CardSkeleton;
