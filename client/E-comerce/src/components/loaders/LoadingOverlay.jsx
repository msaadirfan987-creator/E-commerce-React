import React from 'react';
import Spinner from './Spinner';

const LoadingOverlay = ({ message = 'Working on it...', visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[900] bg-slate-950/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="inline-flex items-center gap-3 rounded-3xl bg-white p-4 shadow-2xl border border-slate-200">
        <Spinner size={26} className="text-slate-900" />
        <span className="text-sm font-semibold text-slate-700">{message}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
