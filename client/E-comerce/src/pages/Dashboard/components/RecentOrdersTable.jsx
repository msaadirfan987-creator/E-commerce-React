import React from 'react';
import { Link } from 'react-router-dom';

const RecentOrdersTable = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-slate-100 text-slate-700';
      case 'Confirmed':
        return 'bg-blue-550/10 text-blue-700';
      case 'Packed':
        return 'bg-amber-50 text-amber-700';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700';
      case 'Out For Delivery':
        return 'bg-purple-50 text-purple-700';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const activeOrders = orders || [];

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
            {activeOrders.length > 0 ? (
              activeOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 text-xs font-bold text-slate-950 font-mono">#{order.orderNumber}</td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{order.buyer?.fullName || 'Customer'}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{order.buyer?.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs font-bold text-slate-800">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-10 text-center text-xs font-bold text-slate-400">
                  No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default RecentOrdersTable;
