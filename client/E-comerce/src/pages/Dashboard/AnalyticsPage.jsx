import React, { useState } from 'react';

const AnalyticsPage = () => {
  const [deviceFilter, setDeviceFilter] = useState('All');

  const trafficSources = [
    { source: 'Direct Search', users: '12,490', percentage: '45%' },
    { source: 'Social Campaigns', users: '6,280', percentage: '22%' },
    { source: 'Referrals Network', users: '3,840', percentage: '14%' },
    { source: 'Search Engine Index', users: '5,280', percentage: '19%' }
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Analytics</h2>
          <p className="text-xs text-slate-400 font-bold">Monitor incoming buyer traffic channels and interface performance metrics.</p>
        </div>

        <select
          value={deviceFilter}
          onChange={(e) => setDeviceFilter(e.target.value)}
          className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-slate-400 cursor-pointer self-start sm:self-auto"
        >
          <option value="All">All Platforms</option>
          <option value="Mobile">Mobile Traffic</option>
          <option value="Desktop">Desktop Console</option>
        </select>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white border border-slate-200 p-4 rounded-lg">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
          <h3 className="text-base font-bold text-slate-900 mt-2">2.48%</h3>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Bounce Rate</span>
          <h3 className="text-base font-bold text-slate-900 mt-2">41.2%</h3>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Average Session</span>
          <h3 className="text-base font-bold text-slate-900 mt-2">4m 12s</h3>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Real-time Visitors</span>
          <h3 className="text-base font-bold text-emerald-600 mt-2">12 Active</h3>
        </div>
      </div>

      {/* Traffic source logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Source Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-3">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Traffic Sources</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Where your store visitors arrive from</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                  <th className="py-2 px-3">Traffic Channel</th>
                  <th className="py-2 px-3">Sessions</th>
                  <th className="py-2 px-3 text-right">Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {trafficSources.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold">{t.source}</td>
                    <td className="py-3 px-3">{t.users} users</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{t.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Browser Stats */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Client Browsers</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Distribution percentages</p>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Google Chrome</span>
                <span className="font-bold text-slate-800">58%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Apple Safari</span>
                <span className="font-bold text-slate-800">24%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: '24%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Mozilla Firefox</span>
                <span className="font-bold text-slate-800">12%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                <span>Other clients</span>
                <span className="font-bold text-slate-800">6%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;
