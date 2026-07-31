import React, { useState } from 'react';

const SalesChart = ({ chartData }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const formattedData = chartData && chartData.length > 0
    ? chartData.map(d => ({
        label: d._id && d._id.month ? d._id.month.slice(0, 3) : 'M',
        sales: d.revenue || 0,
        orders: d.ordersCount || 0
      }))
    : [
        { label: 'No Data', sales: 0, orders: 0 }
      ];

  const salesArray = formattedData.map(d => d.sales);
  const maxSales = Math.max(...salesArray) * 1.1 || 100;
  const minSales = 0;

  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = formattedData.map((d, index) => {
    const x = paddingLeft + (index / (formattedData.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.sales - minSales) / (maxSales - minSales || 1)) * chartHeight;
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
                x={pt.x - (chartWidth / (formattedData.length || 1)) / 2} 
                y={paddingTop} 
                width={chartWidth / (formattedData.length || 1)} 
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
