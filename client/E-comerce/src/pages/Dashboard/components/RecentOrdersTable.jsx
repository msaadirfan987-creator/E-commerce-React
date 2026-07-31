import React from 'react';
import { Link } from 'react-router-dom';

const RecentOrdersTable = () => {
  const orders = [
    { id: '#ORD-9842', customer: 'John Doe', email: 'john@example.com', date: 'Jul 31, 2026', amount: '$129.00', status: 'Pending', statusColor: 'bg-slate-100 text-slate-700' },
    { id: '#ORD-9841', customer: 'Alice Smith', email: 'alice@example.com', date: 'Jul 30, 2026', amount: '$249.00', status: 'Shipped', statusColor: 'bg-blue-50 text-blue-700' },
    { id: '#ORD-9840', customer: 'Bob Johnson', email: 'bob@example.com', date: 'Jul 29, 2026', amount: '$89.00', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700' },
    { id: '#ORD-9839', customer: 'Clara Oswald', email: 'clara@example.com', date: 'Jul 28, 2026', amount: '$45.00', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs w-full flex flex-col justify-between overflow-hidden select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Orders</h4>
          <p className="text-[11px] text-slate-500 font-semibold">Incoming orders log</p>
        </div>
        <Link 
          to="/dashboard/orders" 
          className="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 bg-white px-2.5 py-1 rounded transition-colors"
        >
          Manage All
        </Link>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto w-full mt-3">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-150">
              <th className="py-2.5 px-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
              <th className="py-2.5 px-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="py-2.5 px-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="py-2.5 px-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3 text-xs font-bold text-slate-900">{order.id}</td>
                <td className="py-3 px-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">{order.customer}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{order.email}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs font-bold text-slate-800">{order.amount}</td>
                <td className="py-3 px-3 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${order.statusColor}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default RecentOrdersTable;
