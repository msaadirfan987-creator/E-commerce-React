import React, { useState } from 'react';
import { Search } from 'lucide-react';

const CustomersList = () => {
  const [customers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: 'Jan 12, 2026', spend: 890.00, orders: 8, status: 'Active' },
    { id: 2, name: 'Alice Smith', email: 'alice@example.com', joined: 'Feb 24, 2026', spend: 1240.00, orders: 12, status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', joined: 'Mar 05, 2026', spend: 180.00, orders: 2, status: 'Inactive' },
    { id: 4, name: 'Clara Oswald', email: 'clara@example.com', joined: 'Apr 18, 2026', spend: 450.00, orders: 5, status: 'Active' },
    { id: 5, name: 'Danny Pink', email: 'danny@example.com', joined: 'May 02, 2026', spend: 990.00, orders: 10, status: 'Active' },
    { id: 6, name: 'Susan Foreman', email: 'susan@example.com', joined: 'Jun 19, 2026', spend: 2490.00, orders: 15, status: 'Active' }
  ]);

  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Customer Directory</h2>
        <p className="text-xs text-slate-400 font-bold">Track registered consumer accounts and retention stats.</p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 transition-all focus-within:border-slate-450">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 text-xs font-semibold bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
          />
        </div>

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Total Directory: {customers.length} users
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registration</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Orders</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total LTV</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-4 text-xs font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-500">{c.email}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-500">{c.joined}</td>
                  <td className="py-3 px-4 text-xs font-bold text-slate-600">{c.orders} orders</td>
                  <td className="py-3 px-4 text-xs font-bold text-slate-900">${c.spend.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    {c.status === 'Active' ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-400">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CustomersList;
