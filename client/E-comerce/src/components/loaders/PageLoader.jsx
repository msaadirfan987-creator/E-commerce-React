import React from 'react';
import Spinner from './Spinner';

const PageLoader = ({ message = 'Loading page content...' }) => (
  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-20 select-none">
    <div className="inline-flex items-center gap-3 rounded-3xl bg-white/95 border border-slate-200 px-5 py-4 shadow-lg">
      <Spinner size={28} className="text-slate-900" />
      <span className="text-sm font-semibold text-slate-700">{message}</span>
    </div>
  </div>
);

export default PageLoader;
