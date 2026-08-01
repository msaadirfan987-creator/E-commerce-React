import React from 'react';
import Spinner from './Spinner';

const LoadingMore = ({ message = 'Loading more products...' }) => (
  <div className="flex items-center justify-center gap-3 py-4 text-sm font-semibold text-slate-500">
    <Spinner size={20} className="text-slate-500" />
    <span>{message}</span>
  </div>
);

export default LoadingMore;
