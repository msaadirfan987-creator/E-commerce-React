import React from 'react';

const TableSkeleton = ({ rows = 4, cols = 5 }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-5 gap-3 items-center">
        {[...Array(cols)].map((__, cellIndex) => (
          <div key={cellIndex} className="h-8 rounded-full bg-slate-100" />
        ))}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
