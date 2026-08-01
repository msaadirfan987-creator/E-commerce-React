import React from 'react';

const ProductSkeleton = () => (
  <div className="animate-pulse bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
    <div className="h-64 bg-slate-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 rounded-full bg-slate-100" />
      <div className="h-3 w-1/2 rounded-full bg-slate-100" />
      <div className="h-12 rounded-3xl bg-slate-100" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-9 rounded-full bg-slate-100" />
        <div className="h-9 rounded-full bg-slate-100" />
      </div>
    </div>
  </div>
);

export default ProductSkeleton;
