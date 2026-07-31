import React, { useState } from 'react';

const SalesChart = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const weeklyData = [
    { label: 'Mon', sales: 1200, orders: 15 },
    { label: 'Tue', sales: 1900, orders: 22 },
    { label: 'Wed', sales: 1400, orders: 18 },
    { label: 'Thu', sales: 2500, orders: 30 },
    { label: 'Fri', sales: 2200, orders: 25 },
    { label: 'Sat', sales: 3400, orders: 42 },
    { label: 'Sun', sales: 2900, orders: 35 },
  ];

  const monthlyData = [
    { label: 'Jan', sales: 12000, orders: 150 },
    { label: 'Feb', sales: 15000, orders: 190 },
    { label: 'Mar', sales: 14000, orders: 180 },
    { label: 'Apr', sales: 22000, orders: 280 },
    { label: 'May', sales: 25000, orders: 310 },
    { label: 'Jun', sales: 34000, orders: 420 },
  ];

  const chartData = activeTab === 'weekly' ? weeklyData : monthlyData;

  const salesArray = chartData.map(d => d.sales);
  const maxSales = Math.max(...salesArray) * 1.1;
  const minSales = 0;

  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = chartData.map((d, index) => {
    const x = paddingLeft + (index / (chartData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.sales - minSales) / (maxSales - minSales)) * chartHeight;
    return { x, y, ...d };
  });

  let linePath = '';
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
  }

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs w-full flex flex-col justify-between h-[320px] select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue Reports</h4>
          <p className="text-[11px] text-slate-500 font-semibold">Store income curves</p>
        </div>
        
        {/* Toggle Selector */}
        <div className="bg-slate-100 p-0.5 rounded flex items-center border border-slate-200/50">
          <button 
            onClick={() => { setActiveTab('weekly'); setHoveredIdx(null); }}
            className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all ${
              activeTab === 'weekly' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => { setActiveTab('monthly'); setHoveredIdx(null); }}
            className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all ${
              activeTab === 'monthly' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* SVG graph */}
      <div className="relative w-full flex-1 mt-4 flex items-center justify-center">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full max-h-[190px]"
        >
          {/* Subtle gradient fill for visual depth without noise */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * chartHeight;
            return (
              <line 
                key={i} 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="#f1f5f9" 
                strokeWidth="1" 
              />
            );
          })}

          {/* X Labels */}
          {points.map((pt, i) => (
            <text 
              key={i} 
              x={pt.x} 
              y={height - 5} 
              textAnchor="middle" 
              className="text-[9px] font-bold fill-slate-400"
            >
              {pt.label}
            </text>
          ))}

          {/* Y Labels */}
          {[0, 0.5, 1].map((ratio, i) => {
            const val = maxSales - ratio * (maxSales - minSales);
            const y = paddingTop + ratio * chartHeight + 3;
            return (
              <text 
                key={i} 
                x={paddingLeft - 8} 
                y={y} 
                textAnchor="end" 
                className="text-[8px] font-bold fill-slate-400"
              >
                ${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
              </text>
            );
          })}

          {points.length > 0 && (
            <>
              {/* Shading */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Line path */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="#475569" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Interactivity indicators */}
          {points.map((pt, i) => (
            <g key={i}>
              <rect 
                x={pt.x - (chartWidth / chartData.length) / 2} 
                y={paddingTop} 
                width={chartWidth / chartData.length} 
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-crosshair"
              />

              {hoveredIdx === i && (
                <>
                  <line 
                    x1={pt.x} 
                    y1={paddingTop} 
                    x2={pt.x} 
                    y2={paddingTop + chartHeight} 
                    stroke="#e2e8f0" 
                    strokeWidth="1" 
                  />
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="3.5" 
                    fill="#1e293b" 
                    stroke="#ffffff" 
                    strokeWidth="1.5"
                  />
                </>
              )}
            </g>
          ))}
        </svg>

        {/* Dynamic Tooltip */}
        {hoveredIdx !== null && (
          <div 
            style={{ 
              position: 'absolute',
              left: `${((points[hoveredIdx].x - paddingLeft) / chartWidth) * 80 + 10}%`,
              top: '10px'
            }}
            className="bg-slate-900 text-white rounded-lg p-2 shadow-md border border-slate-800 text-[10px] space-y-0.5 pointer-events-none"
          >
            <div className="font-bold text-slate-400">{points[hoveredIdx].label}</div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-slate-400">Sales:</span>
              <span className="font-bold text-white">${points[hoveredIdx].sales}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SalesChart;
