import React from 'react';

const Spinner = ({ size = 24, className = '' }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <svg
      className="animate-spin text-slate-900"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.15" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default Spinner;
